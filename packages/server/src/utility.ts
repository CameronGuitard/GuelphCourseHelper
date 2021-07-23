import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { MeetingInfo, Response } from './types';
import { Course } from './course';
import { course } from './controllers';

/**
 * This file contains any utility functions needed
 */
export interface PDF {
  numpages: number;
  numrender: number;
  info: {
    PDFFormatVersion: number;
    Title: string;
    Author: string;
    Creator: string;
    CreationDate: string;
  };
  metadata: null;
  version: string;
  text: string; // the actual PDF contents
}

/**
 * Takes in file name and uses pdf parse library to parse buffer from pdf
 * @param fileName The buffer read in from a file
 */
export async function parsePDF(fileName: string): Promise<PDF> {
  try {
    const dataBuffer = fs.readFileSync(path.join(__dirname, fileName));
    return await pdf(dataBuffer);
  } catch (err) {
    console.log(err);
  }
}

export const version = '1.0.0';

class Utility {
  /**
   * Take a string and sanatize it removing any newline characters
   * @param text The string to remove the newlines from
   */
  sanatizeNewlines = (text: string): string => {
    let sanitizedString = '';
    const textLength = text.length;
    for (let i = 0; i < textLength; i++) {
      if (text[i] != '\n' && text[i] != '\r') {
        sanitizedString += text[i];
      }
    }
    return sanitizedString;
  };
  /**
   * Converts and & signs into the word and
   * @param text The string to convert & to and
   */
  convertAndSign = (text: string): string => {
    return text.replace(/&/g, 'and');
  };

  /**
   * Create a string to be added to the attributes of course node in the gexf
   * @param meetingInfo an array of all meeting info from various sections of a course offering
   */
  stringifyMeetingInfo = (meetingInfo: Array<MeetingInfo>): string => {
    let returnString = '';
    let ctr = 0;

    meetingInfo.forEach(function (value) {
      ctr++;

      const tempLec = !!value.lecture ? value.lecture : 'No Lectures';
      const tempSem = !!value.seminar ? value.seminar : 'No Seminars';
      const tempLab = !!value.lab ? value.lab : 'No Labs';
      const tempExam = !!value.exam ? value.exam : 'No Exams';

      returnString += 'Section-' + ctr + '\n';
      returnString += 'Lecture Times: ' + tempLec + '\n';
      returnString += 'Seminar Times: ' + tempSem + '\n';
      returnString += 'Lab Times: ' + tempLab + '\n';
      returnString += 'Exam Times: ' + tempExam + '\n\n';
    });
    return returnString ? returnString : 'No Meeting Info Available';
  };

  /**
   * Array to stringf
   * @param array The array to stringify
   * @returns
   */
  stringifyArrayToDBArray = (array: Array<unknown>): string => {
    let stringedArray = JSON.stringify(array);
    stringedArray = stringedArray.replace('[', '{');
    stringedArray = stringedArray.replace(']', '}');
    stringedArray = stringedArray.replace(/'/g, "''");
    return stringedArray;
  };
}

const utility = new Utility(); //Making this a singleton instance
Object.freeze(utility);
export { utility };

/*  Formats a response to be sent back
 *  response: {
 *    code: Integer,
 *    message: String,
 *    data: Object || Array || null,
 *    error: Boolean || null
 *  }
 */
export const createResponse = (
  code = 500,
  message = 'Something went wrong',
  data: unknown,
  error: boolean,
): Response => ({
  code,
  message,
  data,
  error,
});

/**
 *This function gets the prereqs for all the courses
 * @param courseCode The coursecode or array of coursecodes to map get all courses through its prereqs
 * @param allCourses An array of all courses
 * @param limit True if the map should be limited to only the entered courses, false if it
 * @returns An array of all course objects that are prereqs to the given courses along with the courses themselves
 */
export const getNestedPrereqs = (
  courseCode: string | Array<string>,
  allCourses: Array<Course>,
  limit: boolean,
): Course[] => {
  const courseMap = allCourses.reduce((map, obj) => {
    const currentCourseCode = obj['coursecode'];
    if (limit) {
      if (Array.isArray(courseCode)) {
        if (courseCode.indexOf(currentCourseCode) > -1) {
          map[currentCourseCode] = obj;
        }
      } else {
        if (courseCode == currentCourseCode) {
          map[currentCourseCode] = obj;
        }
      }
    } else {
      map[currentCourseCode] = obj;
    }
    return map;
  }, {} as Map<'string', Course>);
  const courseArray = courseCode.length > 0 ? (courseCode as Array<string>) : ([courseCode] as Array<string>);
  return recursePrereqs(courseMap, courseArray, {});
};

/**
 * This is the recursive function for the prereqs
 * @param allCourses A map of all courses
 * @param coursesToGet The courses to get the prereqs of
 * @param alreadyMatchedCourses An object of already matched courses
 * @returns The course array of all courses
 */
const recursePrereqs = (
  allCourses: Map<'string', Course>,
  coursesToGet: string[],
  alreadyMatchedCourses: any,
): Course[] => {
  let newCourseArray = [] as Array<Course>;
  coursesToGet?.forEach(courseCode => {
    const currentCourse = allCourses[courseCode] as Course;
    if (currentCourse && !alreadyMatchedCourses[courseCode]) {
      alreadyMatchedCourses[courseCode] = true;
      newCourseArray.push(currentCourse);
      const prereqs = currentCourse?.prerequisites?.courseCodes;
      if (prereqs?.length > 0) {
        const coursesToAdd = recursePrereqs(allCourses, prereqs, alreadyMatchedCourses);
        if (coursesToAdd.length > 0) {
          newCourseArray = newCourseArray.concat(coursesToAdd);
        }
      }
    }
  });
  return newCourseArray;
};
