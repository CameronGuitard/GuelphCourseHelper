import { SubjectArea } from './subjectArea';
import { Course } from './course';

export class University {
  // each subject area, (eg. Accounting) will map to SubjectArea class
  // this makes it easy to search for all courses in a given subject area,
  // as it will map directly to the subjectArea class
  subjectAreas: Map<string, SubjectArea>;

  constructor() {
    this.subjectAreas = new Map<string, SubjectArea>();
  }
  // set SubjectArea map into the unviersity class after it has been created
  // for each subjectArea has to be added to the map, then entire map set to University
  setSubjectAreas(subjectArea: Map<string, SubjectArea>): void {
    this.subjectAreas = subjectArea;
  }

  // retrieve entire subject area map
  getSubjectAreas(): Map<string, SubjectArea> {
    return this.subjectAreas;
  }

  /**
   * Returns map of specific subject area only
   * @param {string} courseCode will be in the form of CIS*1200
   */
  getSpecificSubjectArea(subjArea: string): SubjectArea {
    if (subjArea || subjArea.length > 0) {
      return this.subjectAreas.get(subjArea);
    }
  }

  /**
   * Get specific course from university
   * @param {string} courseCode will be in the form of CIS*1200
   */
  getSpecificCourse(courseCode: string): Course | null {
    const [subjectAreaString] = courseCode.split('*');
    const subjectArea = this.subjectAreas.get(subjectAreaString);
    return subjectArea ? subjectArea.getSpecificCourse(courseCode) : null;
  }

  /**
   * Get all the courses of a subject area
   * @param subject the subject area for which to retrieve all courses for
   */
  getCoursesOfDept(subject: string): Map<string, Course> {
    if (!!!subject) {
      throw new Error('The subject you passed is null/undefined');
    }
    const subjectArea = this.subjectAreas.get(subject);
    return subjectArea ? subjectArea.getCourses() : new Map<string, Course>();
  }

  //TODO: refactor
  addSubjectAreaToMap(subjName: string, subjArea: SubjectArea): void {
    this.subjectAreas.set(subjName, subjArea);
  }
}
