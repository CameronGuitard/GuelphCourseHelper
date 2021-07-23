import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fsPromise } from 'fs';

export type ScrapedCourseInfo = {
  lastScraped: string; // really a Date but TS complains about imports from JSON
  courses: Array<[string, ScrapedCourse]>;
};

export type ScrapedCourse = {
  term: string;
  status: string;
  courseCode: string;
  location: string;
  meetingInformation: [];
  faculty: [];
  availableSpots: number;
  capacity: number;
  credits: string;
  academicLevel: string;
};

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
export async function scrapeWebAdvisor(writeFile = true): Promise<Array<[string, ScrapedCourse]>> {
  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // remove default page timeout as this could take a long time
  await page.setDefaultNavigationTimeout(0);

  // navigate to main web advisor page
  await page.goto('https://webadvisor.uoguelph.ca');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // select student tab
  await Promise.all([
    page.click('#sidebar > div > div.subnav > ul > li:nth-child(2) > a'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  // select search for sections tab
  await Promise.all([
    page.click('#sidebar > div > ul:nth-child(2) > li > a'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  // fill out query info
  await Promise.all([
    // W21 term
    page.select('#VAR1', 'W21'),
    // location to Guelph
    page.select('#VAR6', 'G'),
  ]);

  // hit submit - this will take 10-30s depending on network conditions
  await Promise.all([
    page.click('#content > div.screen.WESTS12A > form > div > input'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  // this is evaluated in the browser
  const allCourseOfferings: Array<[string, ScrapedCourse]> = await page.evaluate(() => {
    const courses = document.querySelectorAll('#GROUP_Grp_WSS_COURSE_SECTIONS > table > tbody > tr');
    const coursesInfo = new Map();
    // loop through all queried course rows
    courses.forEach((course: HTMLTableRowElement, i) => {
      // first two rows are table headers

      if (i < 2) return;

      const courseColumns = course.cells;
      const courseNameAndInfo = courseColumns[3].innerText;
      const secondStarindex = courseNameAndInfo.indexOf('*', courseNameAndInfo.indexOf('*') + 1);
      const spaceAfterSectionIndex = courseNameAndInfo.indexOf(' ', secondStarindex + 1);
      const courseCode = courseNameAndInfo.substr(0, secondStarindex);
      const section = courseNameAndInfo.substring(secondStarindex + 1, spaceAfterSectionIndex);
      if (!coursesInfo.has(courseCode)) {
        coursesInfo.set(courseCode, {
          term: courseColumns[1].innerText,
          status: courseColumns[2].innerText,
          courseCode: courseCode,
          location: courseColumns[4].innerText,
          meetingInformation: [],
          faculty: [],
          availableSpots: 0,
          capacity: 0,
          credits: courseColumns[8].innerText,
          academicLevel: courseColumns[10].innerText,
        } as ScrapedCourse);
      }
      const scrapedCourse = coursesInfo.get(courseCode);
      const availAndCap = courseColumns[7].innerText;
      scrapedCourse.meetingInformation.push(`SEC ${section} ` + courseColumns[5].innerText);
      if (!scrapedCourse.faculty.includes(courseColumns[6].innerText)) {
        scrapedCourse.faculty.push(courseColumns[6].innerText);
      }
      scrapedCourse.availableSpots += parseInt(availAndCap.substr(0, availAndCap.indexOf(' ')));
      scrapedCourse.capacity += parseInt(availAndCap.substr(availAndCap.indexOf('/') + 1, availAndCap.length));
    });
    return Array.from(coursesInfo.entries());
  });
  // close the browser
  await browser.close();

  // build the raw scraped course info object
  const scrapedCourseInfo: ScrapedCourseInfo = {
    lastScraped: new Date().toString(),
    courses: allCourseOfferings,
  };

  // write the object to our file for storage
  if (writeFile) {
    await fsPromise.writeFile(
      path.join(__dirname, './assets/scrapedCourseInfo.json'),
      JSON.stringify(scrapedCourseInfo),
    );
  }

  // return the new in memory course data if we need it
  return allCourseOfferings;
}
