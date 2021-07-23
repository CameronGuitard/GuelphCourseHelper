import fs from 'fs';
import path from 'path';
//Importing this class example : import instance from './mappings'
class Mappings {
  _nameMapping: Map<string, string>; // Mapping the names of courses to their course code
  _codeMapping: Map<string, boolean>; // Mapping all the different course codes
  _courseMapping: Map<string, boolean>; // Mapping all the different courses
  _courseNameMapping: Map<string, string>; // The mapping between the names of courses and the course code
  constructor() {
    const temp = fs.readFileSync(path.join(__dirname, './assets/mapping.JSON')); // Parsing the information from the JSON file
    this._nameMapping = new Map(Object.entries(JSON.parse(temp.toString())));
    this._codeMapping = new Map();
    this._courseMapping = new Map();
    this._courseNameMapping = new Map();
    this._nameMapping.forEach(info => {
      // Looping through all the values to mark the different course codes
      if (info) {
        this._codeMapping.set(info, true);
      }
    });
  }
  /**
   * Get the value within the name mapping that corresponds with the given name
   * @param name The name of the course to get the code for
   */
  getNameMapping = (name: string): string => {
    return this._nameMapping.get(name.toUpperCase()) || null;
  };
  /**
   * Check to see if the given code is a valid subject area code
   * @param code The code to check if its valid
   */
  getCodeMapping = (code: string): boolean => {
    return this._codeMapping.get(code.toUpperCase()) || false;
  };

  /**
   * This function checks to see if a course exists
   * @param courseCode The course code to check if exists
   */
  getCourseMapping = (courseCode: string): boolean => {
    if (!!!courseCode) {
      throw new Error('Error: Invalid parameter');
    }
    return this._courseMapping.get(courseCode.toUpperCase()) || false;
  };
  /**
   * This function gets the course code for the name of the couse
   * @param name The name of the course
   */
  getCourseNameMapping = (name: string): string => {
    if (!!!name) {
      throw new Error('Error: Invalid parameter');
    }
    return this._courseNameMapping.get(name.toUpperCase()) || null;
  };
  /**
   * Adds a course to the map
   * @param course The course code to add
   */
  addCourse = (course: string): void => {
    if (!!!course) {
      throw new Error('Error: Invalid parameters');
    }
    this._courseMapping.set(course, true);
  };
  /**
   * Adds a course code to a course name
   * @param courseName The course name
   * @param courseCode The course code
   */
  addCourseName = (courseName: string, courseCode: string): void => {
    if (!!!courseName || !!!courseCode) {
      throw new Error('Error: Invalid parameters');
    }
    this._courseNameMapping.set(courseName.toUpperCase(), courseCode);
  };
}
const instance = new Mappings(); // Making this a singleton instance

export default instance;
