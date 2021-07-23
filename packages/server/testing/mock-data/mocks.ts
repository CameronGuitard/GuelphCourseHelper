import { University } from '../../src/university';
import { SubjectArea } from '../../src/subjectArea';
import { Course } from '../../src/course';
import { PreReqs, MeetingInfo, Restrictions, Corequisites } from '../../src/types';

/**
 * Mock course one and related info
 */

const courseOnePre: PreReqs = {
  fullRawPrereq: 'MATH*1080',
  courseCodes: ['MATH*1080'],
};

const courseOneRes: Restrictions = {
  fullRawRestrict: 'MATH*1080',
  courseCodes: ['MATH*1080'],
};

const courseOneCos: Corequisites = {
  fullRawCoreqs: 'MATH*1080',
  courseCodes: ['MATH*1080'],
};

export const courseOne = new Course(
  'STAT*2040',
  'Introduction to Statistics',
  0.5,
  ['F', 'W', 'S'],
  '3-0',
  'A stats course',
  ['Department of Math'],
  courseOnePre,
  courseOneRes,
  courseOneCos,
  '',
  'ECON*2750',
  'Guelph-Humber',
);

/**
 * Mock course two and related info
 */

const courseTwoPre: PreReqs = {
  fullRawPrereq: '',
  courseCodes: [],
};

const courseTwoRes: Restrictions = {
  fullRawRestrict: '',
  courseCodes: [],
};

const courseTwoCos: Corequisites = {
  fullRawCoreqs: '',
  courseCodes: [],
};

export const courseTwo = new Course(
  'CIS*1500',
  'Introduction to Programming',
  0.5,
  ['F', 'W'],
  '3-3',
  'A stats course',
  ['Department of Math'],
  courseTwoPre,
  courseTwoRes,
  courseTwoCos,
  '',
  '',
  '',
);

/**
 * Mock course meetings and related info
 */
export const mockMeeting1: MeetingInfo = {
  lecture: 'This is lecture time 1',
  seminar: 'This is seminar time 1',
  lab: 'This is lab time 1',
  exam: 'This is exam time 1',
};

export const mockMeeting2: MeetingInfo = {
  lecture: 'This is lecture time 2',
  seminar: 'This is seminar time 2',
  lab: 'This is lab time 2',
  exam: 'This is exam time 2',
};

/**
 * Adding webadvisor information to course 2
 */
courseTwo.addCurrentSpots(7);
courseTwo.addTotalSpots(9);
courseTwo.addMeetingInformation(mockMeeting1);
courseTwo.addFaculty('Mock Faculty 1');
courseTwo.addCurrentSpots(7);
courseTwo.addTotalSpots(9);
courseTwo.addMeetingInformation(mockMeeting2);
courseTwo.addFaculty('Mock Faculty 2');
/**
 * Mock course three and related info
 */

const courseThreePre: PreReqs = {
  fullRawPrereq: 'CIS*1500 and STAT*2040',
  courseCodes: ['CIS*1500', 'STAT*2040'],
};

const courseThreeRes: Restrictions = {
  fullRawRestrict: 'MATH*1080 and STAT*2040',
  courseCodes: ['MATH*1080', 'STAT*2040'],
};

const courseThreeCos: Corequisites = {
  fullRawCoreqs: 'MATH*1080 and STAT*2040',
  courseCodes: ['MATH*1080', 'STAT*2040'],
};

export const courseThree = new Course(
  'CIS*2520',
  'Data Structures and Algorithms',
  0.5,
  ['F'],
  '3-3',
  'Data structs',
  ['Department of Computing'],
  courseThreePre,
  courseThreeRes,
  courseThreeCos,
  '',
  '',
  '',
);

export const emptyMeeting: MeetingInfo = {};

export const missingFieldMeeting: MeetingInfo = {
  lecture: 'T,Th, 3:30-4:00',
  lab: 'T,Th, 1:30-2:00',
  exam: 'April 1, 3:30-4:00',
};

courseThree.addCurrentSpots(7);
courseThree.addTotalSpots(9);
courseThree.addMeetingInformation(missingFieldMeeting);
courseThree.addFaculty('Emily');
/**
 * Create mock subject area maps and add courses
 */

const cisCourseMap = new Map<string, Course>();
cisCourseMap.set('CIS*1500', courseTwo);
cisCourseMap.set('CIS*2520', courseThree);

const statCourseMap = new Map<string, Course>();
statCourseMap.set('STAT*2040', courseOne);

/**
 * Create subject area object and add the maps
 */
export const mockSubjectAreaCis = new SubjectArea('Computing and Information Science', [''], cisCourseMap);
export const mockSubjectAreaStats = new SubjectArea('Statistics', [''], statCourseMap);

/**
 * Create university object and add the subject area maps
 */
const uni = new University();
uni.addSubjectAreaToMap('CIS', mockSubjectAreaCis);
uni.addSubjectAreaToMap('STAT', mockSubjectAreaStats);

export const mockUniversity = uni;
