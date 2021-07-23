/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { RequestResponse, CourseResponse, SubjectAreaResponse, DeptResponse, majorListResponse } from './types';

const IS_DEV = process.env.NODE_ENV === 'development';
const BASE_URL = IS_DEV ? 'http://localhost:8080/api' : 'http://cis4250-04.socs.uoguelph.ca/api';

export const getCoursesForSubjectArea = async (subjectArea: string): Promise<CourseResponse> =>
  (await axios.post(`${BASE_URL}/overview`, { subjectArea })).data;

export const getSpecificCourse = async (specificCourse: string): Promise<CourseResponse> =>
  (await axios.post(`${BASE_URL}/lookup`, { specificCourse })).data;

export const exportCourse = async (courseToExport: string): Promise<RequestResponse> =>
  (await axios.post(`${BASE_URL}/export`, { courseToExport })).data;

export const getCoursesDb = async (): Promise<CourseResponse> => (await axios.get(`${BASE_URL}/d3Data`)).data;

export const downloadElectronApp = async (os: 'mac' | 'win'): Promise<BlobPart> =>
  (
    await axios.get(`${BASE_URL}/download?os=${os}`, {
      responseType: 'blob',
    })
  ).data;

export const getAllSubjectAreas = async (): Promise<SubjectAreaResponse> =>
  (await axios.get(`${BASE_URL}/subject-areas`)).data;

export const getAllDepartments = async (): Promise<DeptResponse> => (await axios.get(`${BASE_URL}/departments`)).data;

export const getSpecificCoursesOverview = async (
  subjectArea: Array<string> | null,
  courseName: Array<string> | null,
  faculty: Array<string> | null,
  currSpots: number | null,
  currSpotsSign: string | null,
  totalSpots: number | null,
  totalSpotsSign: string | null,
  creditWeight: number | null,
  creditWeightSign: string | null,
  semester: Array<string> | null,
  department: string | null,
): Promise<CourseResponse> =>
  (
    await axios.post(`${BASE_URL}/overview-specific`, {
      subjectArea,
      courseName,
      faculty,
      currSpots,
      currSpotsSign,
      totalSpots,
      totalSpotsSign,
      creditWeight,
      creditWeightSign,
      semester,
      department,
    })
  ).data;
export const getCoursePrereq = async (courses: string | Array<string>): Promise<CourseResponse> =>
  (await axios.post(`${BASE_URL}/prereqs`, { courses })).data;

export const getMajor = async (): Promise<majorListResponse> => (await axios.get(`${BASE_URL}/majorsList`)).data;

export const getMajorCourses = async (major: string): Promise<majorListResponse> =>
  (await axios.post(`${BASE_URL}/getMajorCourses`, { major })).data;
