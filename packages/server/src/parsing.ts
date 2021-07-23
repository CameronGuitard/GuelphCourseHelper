import fs, { promises as fsPromise } from 'fs';
import path from 'path';
import mapping from './mappings';
import { University } from './university';
import { SubjectArea } from './subjectArea';
import { Course } from './course';
import { MeetingInfo, PreReqs, Restrictions, Corequisites } from './types';
import { parsePDF } from './utility';
import { utility } from './utility';
import { ScrapedCourse } from './scraper';

/**
 *
 * @param {University} guelph the main university data structure that classes will be parsed into
 * @param {string[][]} subjectAreas the raw list of subjects areas
 */
export function parseCourses(guelph: University, subjectAreas: string[][]): void {
  for (let i = 0; i < subjectAreas.length; i++) {
    const subjectAreaMap = new Map<string, Course>();
    const currentSubjectArea = subjectAreas[i];
    let subjectAreaName;

    // course fields
    let courseCode = '';
    let name = '';
    let weight = 0;
    let semesters = [];
    let lecsLab = '';
    let fullDescription = '';
    let prereqs = '';
    let restrictions = '';
    let coreqs = '';
    let offerings = '';
    let equates = '';
    let location = '';
    let departments = [];

    // parsing flags
    let inCourse = false;
    let multiLine = null;

    if (i == 0) {
      subjectAreaName = currentSubjectArea[0];
    } else {
      subjectAreaName = currentSubjectArea[1];
    }

    for (let j = 0; j < currentSubjectArea.length; j++) {
      // course helpers
      let currLine = currentSubjectArea[j];
      let isCourseLine = currLine.match(/^\w*\*\d{4} /) && (multiLine == null || multiLine == 'departments');
      if (isCourseLine) {
        const oneLine = currLine.match(/^\w*\*\d{4} .*[)] \[.*\]/);
        if (!oneLine) {
          const temp = currLine + ' ' + currentSubjectArea[j + 1];
          if (temp.match(/^\w*\*\d{4} .*[)] \[.*\]/)) {
            j++;
            currLine += ' ' + currentSubjectArea[j];
          } else {
            isCourseLine = false;
          }
        }
      }
      const isSubjectAreaDone = j + 1 >= currentSubjectArea.length;
      let alreadyParsed = false;

      // if current line is a course parse course specific info
      if (isCourseLine) {
        inCourse = true;
        const [cc, ...rest] = currLine.split(' ');
        const tempCC = currLine.split(/F,|W,|S,|U,|F [(]|W [(]|S [(]|U [(]|P1|P2|P3|P4/, 1);
        name = tempCC[0].substring(tempCC[0].indexOf(' ') + 1, tempCC[0].length - 1);
        const otherInfo = rest.join(' ').split(name)[1].split(' ');
        courseCode = cc;
        semesters = otherInfo[1].split(',');
        lecsLab = otherInfo[2];
        weight = Number(otherInfo[3].substring(1, otherInfo[3].length - 1));
        // the line after the main course line will always be the description
        multiLine = 'description';
        continue;
      }
      // parse rest of course information
      if (currLine.includes('Prerequisite(s):')) {
        prereqs = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        multiLine = 'prerequisites';
        alreadyParsed = true;
      } else if (currLine.includes('Co-requisite(s):')) {
        coreqs = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        multiLine = 'corequisites';
        alreadyParsed = true;
      } else if (currLine.includes('Restriction(s):')) {
        restrictions = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        multiLine = 'restrictions';
        alreadyParsed = true;
      } else if (currLine.includes('Department(s):')) {
        currLine = currLine.replace(/\s*$/, '');
        const tempDep = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        departments = tempDep.split(/,\s*/);

        multiLine = 'departments';
        alreadyParsed = true;
      } else if (currLine.includes('Offering(s):')) {
        offerings = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        multiLine = 'offerings';
        alreadyParsed = true;
      } else if (currLine.includes('Equate(s):')) {
        equates = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        multiLine = 'equates';
        alreadyParsed = true;
      } else if (currLine.includes('Location(s):')) {
        location = currLine.substring(currLine.indexOf(':') + 1, currLine.length);
        multiLine = null;
        alreadyParsed = true;
      }
      // other unneeded lines
      else if (currLine.includes('Revision:') || currLine.includes('Course Descriptions,')) {
        multiLine = null;
      }

      if (!alreadyParsed) {
        switch (multiLine) {
          case 'prerequisites':
            prereqs += ' ' + utility.sanatizeNewlines(currLine);
            break;
          case 'corequisites':
            coreqs += ' ' + utility.sanatizeNewlines(currLine);
            break;
          case 'restrictions':
            restrictions += ' ' + utility.sanatizeNewlines(currLine);
            break;
          case 'departments':
            const newCurLine = utility.sanatizeNewlines(currLine);
            /* Case needed because the english subject area has text between courses*/
            if (!newCurLine.includes('The following topics courses')) {
              const tempDepExtra = newCurLine.split(/,\s*/);
              departments[departments.length - 1] +=
                departments[departments.length - 1].length > 0 ? ' ' + tempDepExtra[0] : tempDepExtra[0];
              tempDepExtra.shift();
              departments = departments.concat(tempDepExtra);
            } else {
              multiLine = null;
            }
            break;
          case 'offerings':
            offerings += ' ' + utility.sanatizeNewlines(currLine);
            break;
          case 'equates':
            equates += ' ' + utility.sanatizeNewlines(currLine);
            break;
          case 'locations':
            location += ' ' + utility.sanatizeNewlines(currLine);
            break;
          case 'description':
            fullDescription += ' ' + utility.sanatizeNewlines(currLine);
            break;
          default:
            multiLine = null;
            break;
        }
      }
      // if the next line is a course we are done parsing the current course
      if (
        isSubjectAreaDone ||
        (inCourse &&
          currentSubjectArea[j + 1]?.match(/^\w*\*\d{4} /) &&
          (multiLine == null || multiLine == 'departments'))
      ) {
        // parse pre-requisites
        const parsedPreReqs: PreReqs = {
          fullRawPrereq: prereqs,
          // pull out all courses matching and remove duplicates
          courseCodes: [...new Set(prereqs.match(/[A-Z]*\*[0-9]*/g))],
        };

        const parsedRestrictions: Restrictions = {
          fullRawRestrict: restrictions,
          // pull out all courses matching and remove duplicates
          courseCodes: [...new Set(restrictions.match(/[A-Z]*\*[0-9]*/g))],
        };

        const parsedCoreq: Corequisites = {
          fullRawCoreqs: coreqs,
          // pull out all courses matching and remove duplicates
          courseCodes: [...new Set(coreqs.match(/[A-Z]*\*[0-9]*/g))],
        };
        // some subject areas do not have any courses
        if (mapping.getNameMapping(subjectAreaName)) {
          const course = new Course(
            courseCode,
            name,
            weight,
            semesters,
            lecsLab,
            fullDescription,
            departments,
            parsedPreReqs,
            parsedRestrictions,
            parsedCoreq,
            offerings,
            equates,
            location,
          );
          subjectAreaMap.set(courseCode, course);
          mapping.addCourse(courseCode);
          mapping.addCourseName(name, courseCode);
          // reset course fields
          inCourse = false;
          courseCode = '';
          name = '';
          weight = 0;
          semesters = [];
          lecsLab = '';
          fullDescription = '';
          prereqs = '';
          restrictions = '';
          coreqs = '';
          offerings = '';
          equates = '';
          location = '';
          departments = [];
        }
      }
    }

    // subject area is finished
    const newSubjectArea = new SubjectArea(subjectAreaName, [''], subjectAreaMap);
    guelph.addSubjectAreaToMap(mapping.getNameMapping(subjectAreaName), newSubjectArea);
  }
}

/**
 *
 * @returns {University} the main university data structure that classes will be parsed into
 */
export async function setupUniversity(): Promise<University> {
  const fileName = './assets/2021_courses.pdf';

  const pdf = await parsePDF(fileName);

  // write the PDF to a txt file for easy readability
  // this will eventually be removed once we get the parsing down
  await fsPromise.writeFile(path.join(__dirname, './assets/courses.txt'), pdf.text);

  // pdf sections
  let rawCourseSection: string[] = [];

  // loop through lines of pdf
  let tempData: string[] = [];
  for (const line of pdf.text.split('\n')) {
    if (line === 'Disclaimer') {
      tempData = [];
    } else if (line === 'Introduction') {
      tempData = [];
    } else if (line === 'Learning Outcomes') {
      tempData = [];
    } else if (line === 'Table of Contents') {
      tempData = [];
    } else if (line === 'XII. Course Descriptions') {
      tempData = [];
    } else if (line === 'Accounting') {
      tempData = [];
    }

    tempData.push(line);
  }
  rawCourseSection = tempData;

  // parse out subject areas
  const guelph = new University();

  const subjectAreas: string[][] = []; // Accounting, CIS, Zoology, etc.
  let courses: string[] = [];
  for (let i = 0; i < rawCourseSection.length; i++) {
    const line = rawCourseSection[i];
    const nextLine = rawCourseSection[i + 1];

    // break up courses by department (school)
    if (line === '' && !nextLine.match(/.*\*.*/gm)) {
      subjectAreas.push(courses);
      courses = [];
    }
    courses.push(line);
  }
  subjectAreas.push(courses);

  // main course parsing
  parseCourses(guelph, subjectAreas);
  addWebadvisorToCourse(guelph);
  return guelph;
}

/**
 * Converts a string of parsed courseinfo from webadvisor and adds it into the existing course
 * @param {University} uni takes a university where the courses to be updated are stored
 */
export function addWebadvisorToCourse(uni: University): void {
  const temp = fs.readFileSync(path.join(__dirname, './assets/scrapedCourseInfo.json'));
  const parsedObject = JSON.parse(temp.toString());
  const advisorMap = new Map(parsedObject['courses']);
  advisorMap.forEach((value: ScrapedCourse, key: string) => {
    const courseObject = uni.getSpecificCourse(key);
    if (courseObject) {
      courseObject.addTotalSpots(value.capacity);
      courseObject.addCurrentSpots(value.availableSpots);
      for (const meeting of value.meetingInformation) {
        courseObject.addMeetingInformation(parseMeetingInformation(meeting));
      }
      for (const faculty of value.faculty) {
        courseObject.addFaculty(faculty);
      }
    }
  });
}

/**
 * Converts a string of meeting information for a course into a Meetinginfo type with the elements seperated clearly.
 * @param {string} meeting takes a string input of the meeting info of a course
 * @returns {MeetingInfo} the main university data structure that classes will be parsed into
 */
export function parseMeetingInformation(meeting: string): MeetingInfo {
  const sectionEndIndex = meeting.indexOf(' ', 4);
  const lecTimeIndex = meeting.indexOf('LEC') + 4;
  const seminarIndex = meeting.indexOf('SEM') + 4;
  const labIndex = meeting.indexOf('LAB') + 4;
  const examIndex = meeting.indexOf('EXAM') + 5;
  const section = meeting.substring(4, sectionEndIndex);
  let lecTime = '';
  let seminar = '';
  let lab = '';
  let exam = '';
  let endindex = 0;
  if (meeting.includes('LEC')) {
    if (meeting.includes('SEM')) {
      endindex = seminarIndex - 4;
    } else if (meeting.includes('LAB')) {
      endindex = labIndex - 4;
    } else if (meeting.includes('EXAM')) {
      endindex = examIndex - 5;
    } else {
      endindex = meeting.length;
    }
    lecTime = meeting.substring(lecTimeIndex, endindex);
  }
  if (meeting.includes('SEM')) {
    if (meeting.includes('LAB')) {
      endindex = labIndex - 4;
    } else if (meeting.includes('EXAM')) {
      endindex = examIndex - 5;
    } else {
      endindex = meeting.length;
    }
    seminar = meeting.substring(seminarIndex, endindex);
  }
  if (meeting.includes('LAB')) {
    if (meeting.includes('EXAM')) {
      endindex = examIndex - 5;
    } else {
      endindex = meeting.length;
    }
    lab = meeting.substring(labIndex, endindex);
  }
  if (meeting.includes('EXAM')) {
    exam = meeting.substring(examIndex, meeting.length);
  }
  const courseMeetingInfo: MeetingInfo = {
    section: section,
    lecture: lecTime,
    seminar: seminar,
    lab: lab,
    exam: exam,
  };
  return courseMeetingInfo;
}
