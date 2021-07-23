import fs, { promises as fsPromise } from 'fs';
import path from 'path';
import { QueryResult } from 'pg';
import { MajorCourse, Xof } from '../types';
import { University } from '../university';
import { utility } from '../utility';
import { createCourseValues } from './createCourseTable';
import { makeQuery } from './dbcommands';

/**
 * This function create the courses table on the database if it does not exist
 * Full query:
 * CREATE TABLE IF NOT EXISTS majors(
 * major TEXT NOT NULL,
 * semester1 TEXT [],
 * semester2 TEXT [],
 * semester3 TEXT [],
 * semester4 TEXT [],
 * semester5 TEXT [],
 * semester6 TEXT [],
 * semester7 TEXT [],
 * semester8 TEXT [],
 * allCourses TEXT [] NOT NULL,
 * PRIMARY KEY(major));
 */
export const createMajorTable = (): Promise<QueryResult> => {
  return makeQuery(`CREATE TABLE IF NOT EXISTS majors(
    major TEXT NOT NULL,
    semester1 TEXT [],
    semester2 TEXT [],
    semester3 TEXT [],
    semester4 TEXT [],
    semester5 TEXT [],
    semester6 TEXT [],
    semester7 TEXT [],
    semester8 TEXT [],
    allCourses TEXT [] NOT NULL,
    PRIMARY KEY(major));`);
};

/**
 * Create a string of course values, surround with single quotes, replace with null if value doesn't exist
 * @param courses Concatenates the different values of a course into
 * @returns String of a course's info between parentheses
 */

export const createMajorsValues = (university: University): string => {
  const allSubjectAreas = university.subjectAreas;
  let valueString = '';
  allSubjectAreas.forEach(subj => {
    const allCoursesFormatted = subj.convertCoursesToDBInsert();
    if (allCoursesFormatted.length > 0) {
      valueString += createCourseValues(allCoursesFormatted);
      valueString += ', ';
    }
  });
  // cut off the last two chars (final space and comma)
  valueString = valueString.slice(0, -2);
  return valueString;
};

export const fillMajorTable = async (): Promise<string> => {
  const temp = fs.readFileSync(path.join(__dirname, '../assets/scrapedMajorInfo.json'));
  let valueString = '';
  let mathFound = false;
  const allMajors = JSON.parse(temp.toString());
  allMajors.majors.forEach(currentMajor => {
    if (currentMajor.majorName == 'Mathematical Science (MSCI)') {
      if (mathFound) {
        return;
      }
      mathFound = true;
    }
    const allCourses = [];
    let allCoursesString = '';
    const semester1 = 'NULL';
    const semester2 = 'NULL';
    const semester3 = 'NULL';
    const semester4 = 'NULL';
    const semester5 = 'NULL';
    const semester6 = 'NULL';
    const semester7 = 'NULL';
    const semester8 = 'NULL';
    const major = "'" + currentMajor.majorName + "'";

    // goes through all the semesters
    currentMajor.semesters.forEach(currentSemester => {
      // goes through all the courses
      currentSemester.courses.forEach(currentCourse => {
        if ((currentCourse as MajorCourse).code) {
          allCourses.push(currentCourse.code);
        }
        if ((currentCourse as Xof).description) {
          currentCourse.courses.forEach(currentXoF => {
            allCourses.push(currentXoF.code);
          });
        }
      });
      allCoursesString = utility.stringifyArrayToDBArray(allCourses);
    });

    valueString += '(';

    valueString += major + ', ';
    valueString += semester1 + ', ';
    valueString += semester2 + ', ';
    valueString += semester3 + ', ';
    valueString += semester4 + ', ';
    valueString += semester5 + ', ';
    valueString += semester6 + ', ';
    valueString += semester7 + ', ';
    valueString += semester8 + ', ';
    valueString += "'" + allCoursesString + "'";
    valueString += ')'; //closing bracket
    if (currentMajor.majorName != 'Environment and Resource Management (ERM:C)') {
      // if last element no comma
      valueString += ', ';
    }
  });
  return valueString;
};
/**
 * Makes query to the DB to add all the majors
 * @param tableName Name of table to add the valueString for all majors
 * @param valueString String that contains the value of the majors being added
 * @returns Promise
 */
export const addMajorsToTable = (tableName: string, valueString: string): Promise<QueryResult> => {
  const queryString = `INSERT INTO ${tableName} (major, semester1, semester2, semester3, semester4, semester5, semester6, semester7, semester8, allcourses)\n\tVALUES ${valueString};`;
  return makeQuery(queryString);
};
