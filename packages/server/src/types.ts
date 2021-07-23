export type PreReqs = {
  // the entire pre-req line
  fullRawPrereq: string;
  // list of course codes in pre-requisites Ex. ['CIS*1500', 'CIS*1200', ...]
  courseCodes: string[] | null;
};
//TODO::Update type to contain and handle more cases.
export type Restrictions = {
  // the entire pre-req line
  fullRawRestrict: string;
  // list of course codes in pre-requisites Ex. ['CIS*1500', 'CIS*1200', ...]
  courseCodes: string[] | null;
};
//TODO::Update type to contain and handle more cases
export type Corequisites = {
  // the entire pre-req line
  fullRawCoreqs: string;
  // list of course codes in pre-requisites Ex. ['CIS*1500', 'CIS*1200', ...]
  courseCodes: string[] | null;
};

export type Edge = {
  id: string;
  source: string;
  target: string; // pre-requisite for "source" course
  differentField: boolean; //True if target is a different field, false otherwise
};

export type Node = {
  id: string;
  label: string;
  attributes: Map<string, string | number>;
};

export type MeetingInfo = {
  section?: string;
  lecture?: string;
  seminar?: string;
  lab?: string;
  exam?: string;
};

export type MajorCourse = {
  code: string;
  credits: string;
  courseTitle: string;
};

export type Xof = {
  description?: string;
  courses?: MajorCourse[];
};

export interface Response {
  code: number;
  message: string;
  data: Array<unknown> | unknown | null;
  error: boolean;
}

export type ScrapedMajorInfo = {
  lastScraped: string; // really a Date but TS complains about imports from JSON
  majors: Array<Major>;
};

export type Major = {
  majorName: string;
  semesters: Semester[];
};

export type Semester = {
  level: string;
  courses: any[];
  notes: string[];
  electives: string[];
};
