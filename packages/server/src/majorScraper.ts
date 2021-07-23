import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fsPromise } from 'fs';
import { Major, MajorCourse, ScrapedMajorInfo, Semester, Xof } from './types';

// set this if you wish to see puppeteer in action
// this should never be true in production
const SHOW_BROWSER = false;

/**
 * Will scrape Web Advisor for EVERY current course in W21 at the UofG guelph location
 * Takes about ~60s to run and write the results with 2610 courses at time of writing
 * @file will output the results to src/assets/scrapedCourseInfo.json in the type ScrapedCourseInfo
 * @usage await scrapeWebAdvisor()
 * @usage to import the results simply `import scrapedCourseInfo from '../assets/scrapedCourseInfo.json'
 */
export async function scrapeMajors(writeFile = true): Promise<ScrapedMajorInfo> {
  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // remove default page timeout as this could take a long time
  await page.setDefaultNavigationTimeout(0);

  // navigate to current year major list page
  await page.goto('https://www.uoguelph.ca/registrar/calendars/undergraduate/current/c10/index.shtml');

  // select section from sections tab
  const sections: Array<string> = await page.evaluate(() => {
    const temp = document.querySelectorAll('#sidebar > div > ul:nth-child(4) > li > a');
    const toReturn = [];
    temp.forEach(element => {
      toReturn.push(element.innerHTML);
    });
    return toReturn;
  });

  const majorArray = [];
  for (let g = 1; g <= sections.length; g++) {
    await Promise.all([page.click('#sidebar > div > ul:nth-child(4) > li:nth-child(' + g + ')')]);

    const subSectionMajors: Array<string> = await page.evaluate(() => {
      const temp = document.querySelectorAll('#sidebar > div > ul:nth-child(4) > li > a');
      const toReturn = [];
      temp.forEach(element => {
        toReturn.push(element.innerHTML);
      });
      return toReturn;
    });

    // select section from sections tab
    for (let h = 2; h <= subSectionMajors.length; h++) {
      await Promise.all([
        page.click('#sidebar > div > ul:nth-child(4) > li:nth-child(' + h + ') > a'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);

      // this is evaluated in the browser
      const scrapedMajor: Major = await page.evaluate(
        (subSectionMajors: Array<string>, h: number) => {
          const allSemesters = [];
          const allContent = Array.from(document.querySelectorAll('#content > div.calsect3 > h4'));
          for (let i = 0; i < allContent.length; i++) {
            if (allContent[i].textContent.includes('Major')) {
              const usefulContent = allContent[i].parentElement;
              const allUnscrapedSems = Array.from(usefulContent.querySelectorAll('div > div.calsect4'));
              for (let j = 0; j < allUnscrapedSems.length; j++) {
                if (allUnscrapedSems[j].querySelector('h5').textContent.includes('Semester')) {
                  const semester = allUnscrapedSems[j].querySelector('h5').textContent;
                  const courseArray = Array.from(allUnscrapedSems[j].querySelectorAll('div > table > tbody > tr'));
                  const scrapedSemester: Semester = {
                    level: semester,
                    courses: [],
                    notes: [],
                    electives: [],
                  };
                  let xofValue = '';
                  courseArray.forEach(element => {
                    if (element.className == 'citem') {
                      const currentCourse: MajorCourse = {
                        code: element.children[0].textContent as string,
                        credits: element.children[1].textContent as string,
                        courseTitle: element.children[2].textContent as string,
                      };
                      scrapedSemester.courses.push(currentCourse);
                    }

                    if (element.className == 'para') {
                      if (element.textContent.includes('of:')) {
                        xofValue = element.textContent;
                      } else if (element.textContent.match(/\s\s\s\s\s[0-9]\.[0-9][0-9]/g)) {
                        scrapedSemester.electives.push(element.textContent);
                      } else {
                        scrapedSemester.notes.push(element.textContent);
                      }
                    }
                    if (element.className == 'courselist') {
                      const currentXof: Xof = {
                        description: xofValue,
                        courses: [],
                      };
                      const xOfCourseArray = Array.from(element.querySelectorAll('td > table > tbody > tr'));
                      xOfCourseArray.forEach(xOfElement => {
                        if (xOfElement.className == 'citem') {
                          const currentXOfCourse: MajorCourse = {
                            code: xOfElement.children[0].textContent as string,
                            credits: xOfElement.children[1].textContent as string,
                            courseTitle: xOfElement.children[2].textContent as string,
                          };
                          currentXof.courses.push(currentXOfCourse);
                        }
                      });
                      scrapedSemester.courses.push(currentXof);
                      xofValue = '';
                    }
                  });
                  allSemesters.push(scrapedSemester);
                }
              }
              let currentMajor = null;
              if (allSemesters.length > 0) {
                currentMajor = {
                  majorName: subSectionMajors[h - 1],
                  semesters: allSemesters,
                } as Major;
              }

              return currentMajor;
            }
          }
        },
        subSectionMajors,
        h,
      );

      if (scrapedMajor) {
        majorArray.push(scrapedMajor);
        // console.log(scrapedMajor.semesters[0].electives[0]);
      }

      await Promise.all([
        page.click('#sidebar > div > ul > li:nth-child(3) > a'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);
    }
    await Promise.all([
      page.click('#sidebar > div > ul:nth-child(2) > li:nth-child(2) > a'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
  }
  // close the browser
  await browser.close();

  // return the new in memory course data if we need it
  const scrapedMajorInfo: ScrapedMajorInfo = {
    lastScraped: new Date().toString(),
    majors: majorArray,
  };

  console.log('Major Scraping Successful');

  // write the object to our file for storage
  if (writeFile) {
    await fsPromise.writeFile(path.join(__dirname, './assets/scrapedMajorInfo.json'), JSON.stringify(scrapedMajorInfo));
  }
  return scrapedMajorInfo;
}
