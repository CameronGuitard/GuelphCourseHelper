import { QueryResult } from 'pg';
import { University } from '../university';
import { makeQuery } from './dbcommands';

/**
 * This function create the courses table on the database if it does not exist
 * Full query:
 * CREATE TABLE IF NOT EXISTS courses(
 *   coursecode VARCHAR(14) NOT NULL,
 *   name TEXT NOT NULL,
 *   subjectarea TEXT NOT NULL,
 *   weight real NOT NULL,
 *   semesters VARCHAR(2) [] NOT NULL,
 *   lecslabs TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   departments TEXT [] NOT NULL,
 *   prerequisites json,
 *   restrictions json,
 *   corequisites json,
 *   offerings TEXT,
 *   equates TEXT,
 *   location TEXT,
 *   currentspots integer,
 *   totalspots integer,
 *   meetinginfo json,
 *   faculty text[],
 *   PRIMARY KEY(coursecode));
 */
export const createCourseTable = (): Promise<QueryResult> => {
  return makeQuery(`CREATE TABLE IF NOT EXISTS courses(
    coursecode VARCHAR(14) NOT NULL,
    name TEXT NOT NULL,
    subjectarea TEXT NOT NULL,
    weight real NOT NULL,
    semesters VARCHAR(2) [] NOT NULL,
    lecslabs TEXT NOT NULL,
    description TEXT NOT NULL,
    departments TEXT [] NOT NULL,
    prerequisites json,
    restrictions json,
    corequisites json,
    offerings TEXT,
    equates TEXT,
    location TEXT,
    currentspots integer,
    totalspots integer,
    meetinginfo json,
    faculty text[],
    PRIMARY KEY(coursecode));`);
};

/**
 * For each subject area in university, write the values of a course to the string
 * @param university The university for which we are adding courses to the DB
 * @returns String that has all the values concantenated for all c ourses
 */

export const createUniversityValues = (university: University): string => {
  const allSubjectAreas = university.subjectAreas;
  let valueString = '';
  allSubjectAreas.forEach(subj => {
    const allCoursesFormatted = subj.convertCoursesToDBInsert();
    if (allCoursesFormatted.length > 0) {
      valueString += createCourseValues(allCoursesFormatted);
      valueString += ', ';
    }
  });
  // cut off the last two chars (final space and comma)ddds
  valueString = valueString.slice(0, -2);
  return valueString;
};

/**
 * Create a string of course values, surround with single quotes, replace with null if value doesn't exist
 * @param courses Concatenates the different values of a course into
 * @returns String of a course's info between parentheses
 */

export const createCourseValues = (courses: Array<unknown>): string => {
  let valueString = '';
  let i = 0;
  for (i = 0; i < courses.length; i++) {
    const course = courses[i];
    const coursecode = "'" + course['coursecode'] + "'";
    const name = "'" + course['name'] + "'";
    const subjectarea = "'" + course['subjectarea'] + "'";
    const lecslabs = "'" + course['lecslabs'] + "'";
    const description = "'" + course['description'] + "'";
    const departments = "'" + course['department'] + "'";
    const semesters = "'" + course['semesters'] + "'";

    const prerequisites = !!course['prerequisites'] ? "'" + course['prerequisites'] + "'" : 'NULL';
    const restrictions = !!course['restrictions'] ? "'" + course['restrictions'] + "'" : 'NULL';
    const corequisites = !!course['corequisites'] ? "'" + course['corequisites'] + "'" : 'NULL';
    const meetinginfo = !!course['meetinginfo'] ? "'" + course['meetinginfo'] + "'" : 'NULL';
    const faculty = !!course['faculty'] ? "'" + course['faculty'] + "'" : 'NULL';
    const location = !!course['location'] ? "'" + course['location'] + "'" : 'NULL';
    const equates = !!course['equates'] ? "'" + course['equates'] + "'" : 'NULL';
    const offerings = !!course['offerings'] ? "'" + course['offerings'] + "'" : 'NULL';
    const currentspots = !!course['currentspots'] ? course['currentspots'] : 'NULL';
    const totalspots = !!course['totalspots'] ? course['totalspots'] : 'NULL';

    valueString += '(';

    valueString += coursecode + ', ';
    valueString += name + ', ';
    valueString += subjectarea + ', ';
    valueString += course['weight'] + ', ';
    valueString += semesters + ', ';
    valueString += lecslabs + ', ';
    valueString += description + ', ';
    valueString += departments + ', ';
    valueString += prerequisites + ', ';
    valueString += restrictions + ', ';
    valueString += corequisites + ', ';
    valueString += offerings + ', ';
    valueString += equates + ', ';
    valueString += location + ', ';
    valueString += currentspots + ', ';
    valueString += totalspots + ', ';
    valueString += meetinginfo + ', ';
    valueString += faculty;

    valueString += ')'; //closing bracket
    if (i !== courses.length - 1) {
      // if last element no comma
      valueString += ', ';
    }
  }

  return valueString;
};
/**
 * Makes query to the DB to add a course
 * @param tableName Name of table to add the valueString too for a course
 * @param valueString String that contains the value of the courses being added
 * @returns Promise
 */
export const addCoursesToTable = (tableName: string, valueString: string): Promise<QueryResult> => {
  const queryString = `INSERT INTO ${tableName} (coursecode, name, subjectarea, weight, semesters, lecslabs, description, departments, prerequisites, restrictions, corequisites, offerings, equates, location, currentspots, totalspots, meetinginfo, faculty)\n\tVALUES ${valueString};`;
  return makeQuery(queryString);
};
