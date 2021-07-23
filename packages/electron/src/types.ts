export type sideBarItems = 'help' | 'overview' | 'lookup' | 'export' | 'allCourses' | 'getElectron' | 'myPath' | 'quit';

export type RequestResponse = {
  code: number;
  message: string;
  error: boolean;
  data: unknown;
};

export type majorListResponse = {
  code: number;
  message: string;
  error: boolean;
  data: MajorObjectsResponseData;
};

export type MajorObjectsResponseData = {
  command: string;
  rowCount: number;
  rows: MajorObjects[];
};

export type MajorObjects = {
  major: string;
  allcourses: Array<string>;
};

export type CourseResponse = {
  code: number;
  message: string;
  error: boolean;
  data: Course[];
};

export type SubjectAreaResponse = {
  code: number;
  message: string;
  error: boolean;
  data: SubjectAreaResponseData;
};

export type SubjectAreaResponseData = {
  command: string;
  rowCount: number;
  rows: SubjectAreaObjects[];
};

export type SubjectAreaObjects = {
  subjectarea: string;
};

export type DeptResponse = {
  code: number;
  message: string;
  error: boolean;
  data: DeptResponseData;
};

export type DeptResponseData = {
  command: string;
  rowCount: number;
  rows: DeptObject[];
};

export type DeptObject = {
  depts: string[];
};

// some of these types are duplicated, we might want to consolidate them

export type PreReqs = {
  // the entire pre-req line
  fullRawPrereq: string;
  // list of course codes in pre-requisites Ex. ['CIS*1500', 'CIS*1200', ...]
  courseCodes: string[] | null;
};

export type CoReqs = {
  fullRawCoreqs: string;
  courseCodes: string[] | null;
};

export type MeetingInfo = {
  section?: string;
  lecture?: string;
  seminar?: string;
  lab?: string;
  exam?: string;
};

export type Course = {
  description: string;
  coursecode: string;
  name: string;
  weight: number;
  semesters: string[];
  departments: string[];
  lecslabs: string;
  prerequisites: PreReqs;
  corequisites: CoReqs;
  restrictions: {
    courseCodes: string[];
    fullRawRestrict: string;
  };
  offerings: string;
  location: string;
  equates: string;
  totalspots?: number;
  currentspots?: number;
  meetinginfo?: MeetingInfo[];
  faculty?: Array<string>;
  subjectarea: string;
};

export type D3Node = {
  id: string;
  group: number;
};

export type D3DOMNode = {
  id: string;
  group: number;
  x: number;
  y: number;
};

export type D3Link = {
  source: string;
  target: string;
  value: number;
};

export type GraphData = {
  nodes: D3Node[];
  links: D3Link[];
};

export type node = {
  id: string;
  group: number;
};

export type link = {
  source: string;
  target: string;
  value: number;
};

export type d3Obj = {
  nodes: Array<node>;
  links: Array<link>;
};

export type ExportInfo = {
  name: string;
  query: overviewExport;
  data: Course[];
  selected: boolean;
};

export type overviewExport = {
  exportName: string;
  subjectArea: string;
  courseName: string;
  faculty: string;
  currentSpot: string;
  currentSpotSign: string;
  totalSpot: string;
  totalSpotSign: string;
  creditWeight: string;
  creditWeightSign: string;
  semester: string;
  department: string;
};
