import cron from 'node-cron';
import path from 'path';
import fs, { promises as fsPromise } from 'fs';

import { ScrapedCourse, scrapeWebAdvisor } from '../scraper';
import { utility } from '../utility';
import { parseMeetingInformation } from '../parsing';
import { makeQuery } from '../dbconfig/dbcommands';

// run scraper every 30 minutes. this can be changed to whatever we want
export const scrape = cron.schedule(
  '0 9 * * *',
  async () => {
    try {
      console.log('running scraper cron', new Date());
      // before running scraper, get old courses
      const temp = fs.readFileSync(path.join(__dirname, '../assets/scrapedCourseInfo.json'));
      const tempJSON = JSON.parse(temp.toString());

      const oldCourses: Map<string, ScrapedCourse> = new Map(tempJSON['courses']);

      const newCoursesTemp = await scrapeWebAdvisor(true);
      const newCourses: Map<string, ScrapedCourse> = new Map(newCoursesTemp);
      const updatedCourses = coursesToUpdate(oldCourses, newCourses);
      if (updatedCourses.size > 0) {
        const query = createWebUpdateQuery(updatedCourses);
        await makeQuery(query);
        console.log('scraper cron complete: changes made');
      } else {
        console.log('scraper cron complete: no changes made');
      }
    } catch (error) {
      console.log('Webadvisor Parsing Failed');
      console.log(error);
    }
  },
  {
    scheduled: false,
  },
);

/**
 * This function create the update query for the data coming from the scraper
 * @param data The map of updated courses
 * @returns The query
 */
export const createWebUpdateQuery = (data: Map<string, ScrapedCourse>): string => {
  let values = '';
  data.forEach(course => {
    const tempMeetings = [];
    for (const meeting of course.meetingInformation) {
      tempMeetings.push(parseMeetingInformation(meeting));
    }
    const meetingInfo = JSON.stringify(tempMeetings);
    const faculty = utility.stringifyArrayToDBArray(course.faculty);
    values += `( '${course.courseCode}', ${course.availableSpots},${course.capacity}, '${meetingInfo}', '${faculty}'),`;
  });
  values = values.replace(/,\s*$/, '');
  return `update courses as u set
      currentspots = u2.currentspots,
      totalspots = u2.totalspots,
      meetinginfo = u2.meetinginfo::jsonb,
      faculty = u2.faculty::text[]
      from (values
        ${values}
        ) as u2(coursecode, currentspots,totalspots,meetinginfo,faculty)
        where u2.coursecode = u.coursecode;`;
};

/**
 * This function compares 2 scraped couse objects to check if they are equal
 * @param c1 Scraped course object 1
 * @param c2 Scraped course object 2
 * @returns True if they are equal, false otherwise
 */
export const compareParsedCourses = (c1: ScrapedCourse, c2: ScrapedCourse): boolean => {
  if (
    c1.term == c2.term &&
    c1.status == c2.status &&
    c1.courseCode == c2.courseCode &&
    c1.location == c2.location &&
    JSON.stringify(c1.meetingInformation) == JSON.stringify(c2.meetingInformation) &&
    JSON.stringify(c1.faculty) == JSON.stringify(c2.faculty) &&
    c1.availableSpots == c2.availableSpots &&
    c1.capacity == c2.capacity &&
    c1.credits == c2.credits &&
    c1.academicLevel == c2.academicLevel
  ) {
    return true;
  }
  return false;
};

/**
 * This function compares the old file from the scraper to the newly scraped data
 * @param oldCourses The old courses map
 * @param newCourses The updated courses map
 * @returns
 */
export const coursesToUpdate = (
  oldCourses: Map<string, ScrapedCourse>,
  newCourses: Map<string, ScrapedCourse>,
): Map<string, ScrapedCourse> => {
  const diffCourses = new Map<string, ScrapedCourse>();

  oldCourses.forEach(oldCourse => {
    const currentCourseID = oldCourse.courseCode;
    const newCourseToCompare = newCourses.get(currentCourseID);

    const compare = compareParsedCourses(oldCourse, newCourseToCompare);

    if (!compare) {
      diffCourses.set(currentCourseID, newCourseToCompare);
    }
  });

  return diffCourses;
};
