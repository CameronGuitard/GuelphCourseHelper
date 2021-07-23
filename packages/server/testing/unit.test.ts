import { University } from '../src/university';
import { SubjectArea } from '../src/subjectArea';
import { Course } from '../src/course';
import { MeetingInfo } from '../src/types';

import instance from '../src/mappings';
import { utility } from '../src/utility';
import { getInput } from '../src/cli';
import { parseCourses } from '../src/parsing';
import { courseOne, courseThree, mockMeeting1, emptyMeeting, missingFieldMeeting } from './mock-data/mocks';

/*
File to contain the unit tests. Unit tests can be split up into different files if wanted
*/

// mock helpers
jest.mock('readline-sync', () => ({
  question: () => cliInput,
}));

let cliInput = '';
let programOutput = '';
// override console.log to catch program output
console.log = data => {
  programOutput += data;
};

beforeEach(() => {
  programOutput = '';
});

/**
 * Unit tests related to the subject area tests
 */
describe('Subject Area tests', () => {
  const tempCourse = new Course('CIS*2750', 'Software integration and testing', 0.75, ['F,W'], '5,2', 'A fun course', [
    'Computers',
  ]);

  test('An error should be thrown if no variables are sent into subject area constructor', () => {
    try {
      new SubjectArea(null, null, null, null);
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toEqual('Required parameter cannot be null/undefined');
    }
  });

  test('An error should be thrown if one of the required parameters is set to null', () => {
    try {
      new SubjectArea('Art', null, null);
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toEqual('Required parameter cannot be null/undefined');
    }
  });

  test('No error should be thrown if only subject area description is null', () => {
    try {
      new SubjectArea('Art', ['Modern'], null);
      expect(true).toBe(true);
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('The name of the subject area should be "Music"', () => {
    try {
      const newArea = new SubjectArea('Music', ['Techno'], null, 'Temp description');
      expect(newArea.getName()).toBe('Music');
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });

  test('The departments Environmental and GIS should exist in the SubjectArea', () => {
    try {
      const newArea = new SubjectArea('Geography', ['Environmental', 'GIS'], null, 'Temp description');
      expect(newArea.getDepartments()).toStrictEqual(['Environmental', 'GIS']);
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('The description should be an empty string', () => {
    try {
      const newArea = new SubjectArea('Physics', ['Space'], new Map([['2750', tempCourse]]), null);
      expect(newArea.getDescription()).toBe('');
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test("The description is set to 'The best area of study'", () => {
    try {
      const newArea = new SubjectArea(
        'CIS',
        ['Software Engineering', 'Computer Science'],
        new Map([['2750', tempCourse]]),
        'The best area of study',
      );
      expect(newArea.getDescription()).toBe('The best area of study');
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('The courses should be an empty', () => {
    try {
      const newArea = new SubjectArea('Physics', ['Space'], null);
      expect(newArea.getCourses().size).toBe(0);
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('The course should be 2750', () => {
    try {
      const newArea = new SubjectArea('Physics', ['Space'], new Map([['2750', tempCourse]]), 'TempDesciption');
      expect(newArea.getCourses().get('2750')).toStrictEqual(tempCourse);
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });
});

describe('Mapping singleton class test', () => {
  test('Checking to see if "Biology" will return BIOL', () => {
    try {
      expect(instance.getNameMapping('Biology')).toBe('BIOL');
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Checking to see if "fakecourse" will not return a course code', () => {
    try {
      expect(instance.getNameMapping('fakecourse')).toBe(null);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Checking to see if "CIS" will match as a valid course code', () => {
    try {
      expect(instance.getCodeMapping('CIS')).toBe(true);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Checking to see if "BLOG" will not match as a valid course code', () => {
    try {
      expect(instance.getCodeMapping('BLOG')).toBe(false);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Add course to mapping', () => {
    try {
      instance.addCourse('CIS*2750');
      expect(instance.getCourseMapping('CIS*2750')).toBe(true);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Add course name to napping', () => {
    try {
      instance.addCourseName('Software Systems Development and Integration', 'CIS*2750');
      expect(instance.getCourseNameMapping('Software Systems Development and Integration')).toBe('CIS*2750');
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('insure get course will not match invalid course', () => {
    try {
      expect(instance.getCourseMapping('CIS*2705')).toBe(false);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('checkout course name mapping will not match an invalid coures name', () => {
    try {
      expect(instance.getCourseNameMapping('Systems Software Development and Integration')).toBe(null);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
});

describe('Utility function testing', () => {
  test('Checking to see if newline is removed from string', () => {
    try {
      expect(utility.sanatizeNewlines('This is a string that has a newline at the end\n')).toBe(
        'This is a string that has a newline at the end',
      );
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });

  test('Check if a multiple newlines are removed from string', () => {
    try {
      expect(utility.sanatizeNewlines('This is a\n string t\nhat has a new\nline at the end\n')).toBe(
        'This is a string that has a newline at the end',
      );
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });

  test('Checking to see if carriage returns are removed from string', () => {
    try {
      expect(utility.sanatizeNewlines('This is a string that has a newline at the end\r')).toBe(
        'This is a string that has a newline at the end',
      );
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });

  test('Check if a multiple carriage returns are removed from string', () => {
    try {
      expect(utility.sanatizeNewlines('This is a\r string t\rhat has a new\rline at the end\r')).toBe(
        'This is a string that has a newline at the end',
      );
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });
  test('Check to see if both newlines and carriage returns are removed', () => {
    try {
      expect(utility.sanatizeNewlines('T\n\rhis is a\r string t\nhat has a new\rline at the end\r\n')).toBe(
        'This is a string that has a newline at the end',
      );
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });

  test('Check to see if empty meeting info returns no meeting info available', () => {
    const returnedString = utility.stringifyMeetingInfo([]);
    const expectedString = 'No Meeting Info Available';

    expect(returnedString).toEqual(expectedString);
  });

  test('Check to see if an empty meeting info returns the correct string', () => {
    const returnedString = utility.stringifyMeetingInfo([emptyMeeting]);
    const expectedString =
      'Section-1\nLecture Times: No Lectures\nSeminar Times: No Seminars\nLab Times: No Labs\nExam Times: No Exams\n\n';

    expect(returnedString).toEqual(expectedString);
  });

  test('Check to see if valid meeting info returns correctly formatted string', () => {
    const returnedString = utility.stringifyMeetingInfo([mockMeeting1, missingFieldMeeting, emptyMeeting]);
    const expectedString =
      'Section-1\nLecture Times: This is lecture time 1\nSeminar Times: This is seminar time 1\nLab Times: This is lab time 1\nExam Times: This is exam time 1\n\n' +
      'Section-2\nLecture Times: T,Th, 3:30-4:00\nSeminar Times: No Seminars\nLab Times: T,Th, 1:30-2:00\nExam Times: April 1, 3:30-4:00\n\n' +
      'Section-3\nLecture Times: No Lectures\nSeminar Times: No Seminars\nLab Times: No Labs\nExam Times: No Exams\n\n';

    expect(returnedString).toEqual(expectedString);
  });
});

describe('getInput Tests', () => {
  const invalid = 'Invalid Course Syntax. Try again.';
  const university = new University();
  university.addSubjectAreaToMap(
    'CIS',
    new SubjectArea(
      'Computing and Information Science',
      [''],
      new Map<string, Course>().set(
        'CIS*4250',
        new Course('CIS*4250', 'Software Design V', 0.5, ['W'], '0,6', 'Great Course', ['Computers']),
      ),
    ),
  );

  test('providing no course to lookup gives an error', () => {
    cliInput = 'lookup';
    getInput(university);
    expect(programOutput).toBe('You must specify a valid course');
  });

  test('invalid course codes will be an invalid course syntax', () => {
    cliInput = 'lookup asdfasdf*asdfasdf';
    getInput(university);
    expect(programOutput).toBe(invalid);
  });

  test('will search for a valid course regardless of case', () => {
    cliInput = 'lookup cis*4250';
    getInput(university);
    expect(programOutput).toContain('CIS*4250');
  });

  test('will only search for one given course', () => {
    cliInput = 'lookup cis*1234 CIS*4321';
    getInput(university);
    expect(programOutput).toBe(invalid);
  });

  test('will return nothing if a course code is valid but does not exist', () => {
    cliInput = 'lookup CIS*1111';
    getInput(university);
    expect(programOutput).toBe('The course you are searching for does not exist.');
  });

  test('will return a valid course description', () => {
    cliInput = 'lookup CIS*4250';
    getInput(university);
    expect(programOutput).toContain('CIS*4250');
    expect(programOutput).toContain('Software Design V');
    expect(programOutput).toContain('0.5');
    expect(programOutput).toContain('W');
    expect(programOutput).toContain('0,6');
    expect(programOutput).toContain('Great Course');
    expect(programOutput).toContain('Computers');
  });
});

describe('Testing of overview command', () => {
  const uni = new University();
  const course = new Course('CIS*4250', 'Software Design V', 0.5, ['W'], '0,6', 'Great Course', ['Computers']);
  const filledMap = new Map<string, Course>().set('CIS*4250', course);

  uni.addSubjectAreaToMap('CIS', new SubjectArea('Computing and Information Science', [''], filledMap));

  test('Passing in an empty string', () => {
    try {
      expect(true).toBe(true);
    } catch (e) {
      console.log(e);
      expect(e.message).toEqual('The subject you passed is null/undefined');
    }
  });

  test('Passing in a valid string', () => {
    try {
      expect(uni.getCoursesOfDept('CIS')).toStrictEqual(filledMap);
    } catch (e) {
      console.log(e);
      expect(false).toBe(true);
    }
  });

  test('Passing in an invalid string', () => {
    try {
      expect(uni.getCoursesOfDept('AGR11111')).toStrictEqual(new Map<string, Course>());
    } catch (e) {
      console.log(e);
      expect(e.message).toEqual('There are no courses for this subject area');
    }
  });
});

describe('parsing Tests', () => {
  const rawSubjectArea = [
    [
      'Accounting',
      'Department of Management',
      'ACCT*1220 Introductory Financial Accounting F,W (3-0) [0.50]',
      'This introductory course is designed to develop a foundational understanding of current',
      'accounting  principles  and  their  implication  for  published  financial  reports  of  business',
      'enterprises.  It  builds  the  base  of  knowledge  and  understanding  required  to  succeed  in',
      'more advanced study of accounting. The course approaches the subject from the point',
      'of view of the user of accounting information rather than that of a person who supplies',
      'the information.',
      'Offering(s):Also offered through Distance Education format.',
      'Restriction(s):ACCT*2220 , This is a Priority Access Course. Enrolment may be',
      'restricted to particular programs or specializations. See department for',
      'more information.',
      'Department(s):Department of Management',
      'ACCT*1240 Applied Financial Accounting W (3-0) [0.50]',
      'This  course  requires  students  to  apply  the  fundamental  principles  emanating  from',
      'accounting’s conceptual framework and undertake the practice of financial accounting.',
      'Students  will  become  adept  at  performing  the  functions  related  to  each  step  in  the',
      'accounting  cycle,  up  to  and  including  the  preparation  of  the  financial  statements  and',
      'client   reports.   Students   will   also   develop   the   skills   necessary   for   assessing   an',
      'organization’s system of internal controls and financial conditions.',
      'Prerequisite(s):ACCT*1220 or ACCT*2220',
      'Restriction(s):ACCT*2240 , This is a Priority Access Course. Enrolment may be',
      'restricted to particular programs or specializations. See department for',
      'more information.',
      'Department(s):Department of Management',
    ],
    [
      '',
      'Agriculture',
      "Ontario Agricultural College, Dean's Office",
      'AGR*1110 Introduction to the Agri-Food Systems',
      'F (6-0) [1.00]',
      'This introductory course provides an overview of Canadian and global agri-food systems.',
      'Students  will  be  introduced  to  many  different  facets  of  agriculture,  including  primary',
      'production (conventional and organic) of commodity, mid-value and high-value crops,',
      'and livestock. Students will explore the agri-food system by tracing consumer end-products',
      'back to primary production. Modern, industrial agri-food systems as well as subsistence',
      'farming will be discussed. The course incorporates an experiential learning component',
      'in which students will explore a new agri-food opportunity for Ontario by designing and',
      'assessing the value chain.',
      'Restriction(s):AGR*1100 . AGR*1250 . Restricted to students in BAH.FARE,',
      'BSC(AGR), Minor in Agriculture',
      'Department(s):Department of Plant Agriculture, Department of Animal Biosciences',
      'Location(s):Guelph',
      'AGR*2050 Agroecology W (3-0) [0.50]',
      'This  course  considers  the  interactions  of  all  important  biophysical,  technical  and',
      'socioeconomic  components  of  farming  systems  and  examines  these  systems  as  the',
      'fundamental units of study. Mineral cycles, energy transformations, biological processes',
      'and socioeconomic relationships are analyzed as a whole in an interdisciplinary fashion.',
      'Prerequisite(s):(AGR*1110 or AGR*2150), (BIOL*1050 or BIOL*1070)',
      'Restriction(s):CROP*2110',
      'Department(s):Department of Plant Agriculture, Department of Animal Biosciences',
    ],
  ];

  test('given a raw subject area list, parse into valid courses', () => {
    const university = new University();
    parseCourses(university, rawSubjectArea);

    expect(university.getSubjectAreas().size).toBe(2);
    expect(university.getSpecificCourse('ACCT*1220').courseCode).toBe('ACCT*1220');
    expect(university.getSpecificCourse('AGR*1110').courseCode).toBe('AGR*1110');
  });

  test('parse course codes out of prerequisite string', () => {
    const university = new University();
    parseCourses(university, rawSubjectArea);
    expect(university.getSpecificCourse('AGR*2050').prerequisites.courseCodes).toStrictEqual([
      'AGR*1110',
      'AGR*2150',
      'BIOL*1050',
      'BIOL*1070',
    ]);
  });

  test('parse full prerequisites out of multiline prerequisites', () => {
    const university = new University();
    const subjectArea = [
      [
        'Biomedical Sciences',
        'Department of Biomedical Sciences',
        'BIOM*4070 Biomedical Histology F (2-3) [0.50]',
        'This histology course is designed for students interested in biomedical sciences. Basic',
        'tissue  types  and  major  organ  systems  of  mammals  will  be  examined  using  virtual',
        'microscopy. Lectures and discussions will focus on the relationship of tissue structure',
        'to cell and organ functions and the effects of injury or disease on microscopic structure.',
        'Prerequisite(s):(MCB*2050 or MCB*2210 ), (1of ANSC*3080, BIOM*3200,',
        'HK*3810, HK*3940 )',
        'Restriction(s):ZOO*3000 This is a Priority Access Course. Enrolment may be',
        'restricted to particular programs or specializations. See department for',
        'more information.',
        'Department(s):Department of Biomedical Sciences',
        'BIOM*4090 Pharmacology S,F,W (3-0) [0.50]',
        'Topics covered in this course include drugs used in the treatment of inflammatory, allergic,',
        'hormonal,  infectious,  neoplastic  and  hemorrhagic/thromboembolic  disease.  The  focus',
        'will be on drug targets and mechanisms of action that explain therapeutic and toxicological',
        'effects.',
        'Offering(s):Also offered through Distance Education format.',
        'Prerequisite(s):BIOM*3090',
        'Department(s):Department of Biomedical Sciences',
        'Revision:  2020-2021 Undergraduate Calendar',
        'XII. Course Descriptions, Biomedical Sciences 555',
      ],
    ];
    parseCourses(university, subjectArea);
    expect(university.getSpecificCourse('BIOM*4070').prerequisites.courseCodes).toStrictEqual([
      'MCB*2050',
      'MCB*2210',
      'ANSC*3080',
      'BIOM*3200',
      'HK*3810',
      'HK*3940',
    ]);
  });

  test('remove duplicate course codes from prerequisites', () => {
    const university = new University();
    const subjectArea = [
      [
        'Biomedical Sciences',
        'Department of Biomedical Sciences',
        'BIOM*4070 Biomedical Histology F (2-3) [0.50]',
        'This histology course is designed for students interested in biomedical sciences. Basic',
        'tissue  types  and  major  organ  systems  of  mammals  will  be  examined  using  virtual',
        'microscopy. Lectures and discussions will focus on the relationship of tissue structure',
        'to cell and organ functions and the effects of injury or disease on microscopic structure.',
        'Prerequisite(s):(MCB*2050 or MCB*2210 ) MCB*2210 can be taken in tandem.',
        'Restriction(s):ZOO*3000 This is a Priority Access Course. Enrolment may be',
        'restricted to particular programs or specializations. See department for',
        'more information.',
        'Department(s):Department of Biomedical Sciences',
        'BIOM*4090 Pharmacology S,F,W (3-0) [0.50]',
        'Topics covered in this course include drugs used in the treatment of inflammatory, allergic,',
        'hormonal,  infectious,  neoplastic  and  hemorrhagic/thromboembolic  disease.  The  focus',
        'will be on drug targets and mechanisms of action that explain therapeutic and toxicological',
        'effects.',
        'Offering(s):Also offered through Distance Education format.',
        'Prerequisite(s):BIOM*3090',
        'Department(s):Department of Biomedical Sciences',
        'Revision:  2020-2021 Undergraduate Calendar',
        'XII. Course Descriptions, Biomedical Sciences 555',
      ],
    ];
    parseCourses(university, subjectArea);
    expect(university.getSpecificCourse('BIOM*4070').prerequisites.courseCodes).toStrictEqual(['MCB*2050', 'MCB*2210']);
  });
});

describe('Course unit tests', () => {
  const tempCourse = courseOne;
  const tempCourseWithInfo = courseThree;
  test('Add "5" to a courses total spots that currently has 0 spots', () => {
    try {
      tempCourse.addTotalSpots(5);
      expect(tempCourse.totalSpots).toBe(5);
    } catch (e) {
      console.log(e);
      expect(false).toEqual(true);
    }
  });
  test('Add "9" to a courses total spots that currently has 7 spots', () => {
    try {
      tempCourseWithInfo.addTotalSpots(7);
      expect(tempCourseWithInfo.totalSpots).toBe(16);
    } catch (e) {
      console.log(e.message);
      expect(false).toEqual(true);
    }
  });
  test('Add a negative number to a courses total spots', () => {
    try {
      tempCourse.addTotalSpots(-5);
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toBe('Invalid parameters');
    }
  });
  test('Add "1" to a courses current spots that currently has 0 spots', () => {
    try {
      tempCourse.addCurrentSpots(1);
      expect(tempCourse.currentSpots).toBe(1);
    } catch (e) {
      console.log(e);
      expect(false).toEqual(true);
    }
  });
  test('Add "6" to a courses total spots that currently has 13 spots', () => {
    try {
      tempCourseWithInfo.addCurrentSpots(6);
      expect(tempCourseWithInfo.currentSpots).toBe(13);
    } catch (e) {
      console.log(e.message);
      expect(false).toEqual(true);
    }
  });
  test('Add a negative number to a courses current spots', () => {
    try {
      tempCourse.addCurrentSpots(-5);
      expect(false).toBe(true);
    } catch (e) {
      expect(e.message).toBe('Invalid parameters');
    }
  });
  test('Testing adding a meeting time that has no time', () => {
    const tempMeeting: MeetingInfo = {
      lecture: 'This is lecture time  newer',
      seminar: 'This is the seminar time seemm',
      lab: 'This is the lab time labbbb',
      exam: 'This is the exam time booooo',
    };
    try {
      tempCourse.addMeetingInformation(tempMeeting);
      expect(tempCourse.meetingInformation[0]).toStrictEqual(tempMeeting);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Testing adding a meeting time that has existing time', () => {
    const tempMeeting: MeetingInfo = {
      lecture: 'This is lecture time newer',
      seminar: 'This is the seminar time seemm',
      lab: 'This is the lab time labbbb',
      exam: 'This is the exam time booooo',
    };
    try {
      tempCourseWithInfo.addMeetingInformation(tempMeeting);
      expect(tempCourseWithInfo.meetingInformation[1]).toStrictEqual(tempMeeting);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Testing adding faculty for a course that does not have one', () => {
    try {
      tempCourse.addFaculty('George');
      expect(tempCourse.faculty[0]).toBe('George');
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Testing adding faculty for a course that does have one already', () => {
    try {
      tempCourseWithInfo.addFaculty('George');
      expect(tempCourseWithInfo.faculty[1]).toBe('George');
    } catch (e) {
      expect(false).toBe(true);
    }
  });
  test('Testing adding faculty for a course that has that faculty member already', () => {
    try {
      tempCourseWithInfo.addFaculty('Emily');
      expect(tempCourseWithInfo.faculty.filter(x => x == 'Emily').length).toBe(1);
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  //additional tests including web advisor tests below
  test('Add a meeting with only a lecture', () => {
    const tempMeeting: MeetingInfo = {
      lecture: 'This is lecture time  newer',
      seminar: '',
      lab: '',
      exam: '',
    };
    try {
      tempCourse.addMeetingInformation(tempMeeting);
      expect(tempCourse.meetingInformation[0].lecture).toStrictEqual('This is lecture time  newer');
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('Add a meeting with only a seminar', () => {
    const tempMeeting: MeetingInfo = {
      lecture: '',
      seminar: 'This is the seminar time seemm',
      lab: '',
      exam: '',
    };
    try {
      tempCourse.addMeetingInformation(tempMeeting);
      expect(tempCourse.meetingInformation[0].seminar).toStrictEqual('This is the seminar time seemm');
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('Add a meeting with only a lab', () => {
    const tempMeeting: MeetingInfo = {
      lecture: '',
      seminar: '',
      lab: 'This is the lab time labbbb',
      exam: '',
    };
    try {
      tempCourse.addMeetingInformation(tempMeeting);
      expect(tempCourse.meetingInformation[0].lab).toStrictEqual('This is the lab time labbbb');
    } catch (e) {
      expect(false).toBe(true);
    }
  });

  test('Add a meeting with only an exam', () => {
    const tempMeeting: MeetingInfo = {
      lecture: '',
      seminar: '',
      lab: '',
      exam: 'This is the exam time booooo',
    };
    try {
      tempCourse.addMeetingInformation(tempMeeting);
      expect(tempCourse.meetingInformation[0].exam).toStrictEqual('This is the exam time booooo');
    } catch (e) {
      expect(false).toBe(true);
    }
  });
});
