import { Course } from './course';
import mapping from './mappings';
export class SubjectArea {
  name: string; //The name of the subject area
  description: string; //The description of the subject area
  departments: string[]; //The departments of the subject area
  courses: Map<string, Course>; //All the courses in the subjectArea

  /**
   * Constructor for the subjectArea class
   * @param name  - The name of the subject area
   * @param departments  - The departments in the subject area
   * @param courses - (Optional) The courses in the subject area
   * @param description - (Optional) the descruption of the subject area
   */
  constructor(name: string, departments: string[], courses?: Map<string, Course>, description?: string) {
    if (!!!name || !!!departments || departments.length < 1) {
      throw new Error('Required parameter cannot be null/undefined');
    } else {
      this.name = name;
      this.courses = courses || new Map<string, Course>();
      this.description = description || '';
      this.departments = departments;
    }
  }

  /**
   * Returns the name of the subject area
   */
  getName = (): string => {
    return this.name;
  };

  /**
   * Returns the description of the subjectArea
   */
  getDescription = (): string => {
    return this.description;
  };

  /**
   * Returns the departments in the subject area
   */
  getDepartments = (): string[] => {
    return this.departments;
  };
  /**
   * Returns the courses in the subject area
   */
  getCourses = (): Map<string, Course> => {
    return this.courses;
  };

  /**
   * Returns Course object that is being searched
   * Return null if course doesn't exist
   * @param courseCode Course that we want to retrieve
   */

  getSpecificCourse(courseCode: string): Course | null {
    return this.courses.get(courseCode) || null;
  }

  /**
   *
   * @param courseCode optional course code to convert a single object into the database insert
   * @returns An array of exported database objects to insert
   */
  convertCoursesToDBInsert(courseCode?: string): Array<unknown> {
    const courses = [];
    if (courseCode) {
      const currentCourse = this.courses.get(courseCode);
      if (currentCourse) {
        const exported = currentCourse.exportToDB();
        exported['subjectarea'] = mapping.getNameMapping(this.name);
        courses.push(exported);
      }
    } else {
      this.courses.forEach(currentCourse => {
        const exported = currentCourse.exportToDB();
        exported['subjectarea'] = mapping.getNameMapping(this.name);
        courses.push(exported);
      });
    }
    return courses;
  }
}
