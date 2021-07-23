import { PreReqs, MeetingInfo, Corequisites, Restrictions } from './types';
import { utility } from './utility';

export class Course {
  description: string;
  courseCode: string;
  name: string;
  weight: number;
  semesters: string[];
  departments: string[];
  lecsLabs: string;
  prerequisites: PreReqs;
  corequisites: Corequisites;
  restrictions: Restrictions;
  offerings: string;
  location: string;
  equates: string;
  totalSpots?: number;
  currentSpots?: number;
  meetingInformation?: Array<MeetingInfo>;
  faculty?: Array<string>;

  /**
   * Creates an instance of Course.
   *
   * @constructor
   * @author: Josh
   * @param {string} courseCode The two part Course Code
   * @param {string} name The name of the course
   * @param {number} weight The weight of the course
   * @param {string[]} semesters The first letter of the semesters the course is offered
   * @param {string} lecsLabs How many lectures / labs are in the course respectively
   * @param {string} description A description of the course
   * @param {string} prerequisites Optional List of courses required to take the course
   * @param {string} restrictions Optional list of courses you cannot have taken to take this course
   * @param {string} corequisites Optional list of courses that must be taken at the same time this course is being takens
   * @param {string} equates Optional list of courses equivalent to this course
   * @param {string} offerings Optional list of rules regarding when a course can be taken
   * @param {string} location Optional location specifying where a course can be taken
   * @param {string} departments The deparments the course falls under
   */
  constructor(
    courseCode: string,
    name: string,
    weight: number,
    semesters: string[],
    lecsLabs: string,
    description: string,
    departments: string[],
    prerequisites?: PreReqs,
    restrictions?: Restrictions,
    corequisites?: Corequisites,
    offerings?: string,
    equates?: string,
    location?: string,
  ) {
    //checks if course parameters are nulls
    if (
      !!!courseCode ||
      !!!name ||
      weight < 0 ||
      !!!semesters ||
      semesters.length < 1 ||
      !!!lecsLabs ||
      !!!description ||
      !!!departments
    ) {
      throw new Error('Required parameter cannot be null/undefined');
    } else {
      this.courseCode = courseCode;
      this.name = name;
      this.weight = weight;
      this.semesters = semesters;
      this.lecsLabs = lecsLabs;
      this.description = description;
      this.prerequisites = prerequisites;
      this.restrictions = restrictions;
      this.corequisites = corequisites;
      this.offerings = offerings;
      this.equates = equates;
      this.location = location;
      this.departments = departments;
      this.currentSpots = 0;
      this.totalSpots = 0;
      this.meetingInformation = [];
      this.faculty = [];
    }
  }
  /**
   * Adds a value to the total number of spots on a course
   * @param newSpots The number of spots to add to the total spots on the course
   */
  addTotalSpots(newSpots: number): void {
    if (newSpots > -1) {
      this.totalSpots += newSpots;
    } else {
      throw new Error('Invalid parameters');
    }
  }
  /**
   * Adds a value to the total number of current spots left in a course
   * @param newSpots The number of spots to add to the total spots on the course
   */
  addCurrentSpots(newSpots: number): void {
    if (newSpots > -1) {
      this.currentSpots += newSpots;
    } else {
      throw new Error('Invalid parameters');
    }
  }
  /**
   * Adds the meeting information to the course
   * @param meetingInfo The meeting info type to add to the course
   */
  addMeetingInformation(meetingInfo: MeetingInfo): void {
    if (meetingInfo) {
      this.meetingInformation.push(meetingInfo);
    } else {
      throw new Error('Invalid parameters');
    }
  }
  /**
   * Adds the faculty to the course if that faculty member has not been added before
   * @param name The name of the faculty member
   */
  addFaculty(name: string): void {
    if (!!!name) {
      throw new Error('Invalid parameters');
    } else if (!this.faculty.includes(name)) {
      this.faculty.push(name);
    }
  }
  /**
   * This function exports all the values into the format they need to be for the database. Exception to this is arrays since they have special casing that will need to be done in the query
   */
  exportToDB(): unknown {
    const dbInsert = {};

    dbInsert['coursecode'] = this.courseCode;
    dbInsert['name'] = this.name.replace(/'/g, "''");
    dbInsert['weight'] = this.weight;
    dbInsert['semesters'] = utility.stringifyArrayToDBArray(this.semesters);
    dbInsert['lecslabs'] = this.lecsLabs;
    dbInsert['description'] = this.description.replace(/'/g, "''");
    dbInsert['department'] = utility.stringifyArrayToDBArray(this.departments);
    dbInsert['prerequisites'] =
      this.prerequisites['fullRawPrereq'].length > 0 ? JSON.stringify(this.prerequisites).replace(/'/g, "''") : null;
    dbInsert['restrictions'] =
      this.restrictions['fullRawRestrict'].length > 0 ? JSON.stringify(this.restrictions).replace(/'/g, "''") : null;
    dbInsert['corequisites'] =
      this.corequisites['fullRawCoreqs'].length > 0 ? JSON.stringify(this.corequisites).replace(/'/g, "''") : null;
    dbInsert['offerings'] = this.offerings;
    dbInsert['equates'] = this.equates;
    dbInsert['location'] = this.location;
    dbInsert['currentspots'] = this.currentSpots;
    dbInsert['totalspots'] = this.totalSpots;
    dbInsert['meetinginfo'] = JSON.stringify(this.meetingInformation);
    dbInsert['faculty'] = this.faculty.length > 0 ? utility.stringifyArrayToDBArray(this.faculty) : null;
    return dbInsert;
  }
}
