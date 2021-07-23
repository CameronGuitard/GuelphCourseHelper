import { Request, Response } from 'express';

import { createResponse, getNestedPrereqs } from '../utility';
import { setupUniversity } from '../parsing';
import mapping from '../mappings';
import { makeQuery, getCourses, customCourseQueryCreation } from '../dbconfig/dbcommands';

/*
 *   GET /overview
 *   Gets all courses for a subject area
 *
 *   REQ: {
 *      subjectArea: <string>,
 *   }
 *
 *   RES: {
 *      code: number,
 *      message: string,
 *      data: Courses,
 *      error: boolean
 *   }
 */
export async function getCoursesForSubjectArea(req: Request, res: Response): Promise<Response> {
  try {
    const { subjectArea } = req.body;
    if (!subjectArea) {
      return res.status(400).json(createResponse(400, 'Missing subject area', null, true));
    }

    const courses = await makeQuery(
      `SELECT * FROM courses WHERE coursecode LIKE '${subjectArea}%' ORDER BY coursecode`,
    );

    return res.status(200).json(createResponse(200, 'Successfully got subject area overview', courses.rows, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getSpecificCourse(req: Request, res: Response): Promise<Response> {
  try {
    const { specificCourse } = req.body;
    if (!specificCourse) {
      return res.status(400).json(createResponse(400, 'Missing specific course', null, true));
    }

    const course = await makeQuery(`SELECT * FROM courses WHERE coursecode = '${specificCourse}'`);

    return res.status(200).json(createResponse(200, 'Successfully got specific course lookup', course.rows, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getCoursesDb(req: Request, res: Response): Promise<Response> {
  try {
    const d3Data = await getCourses();
    return res.status(200).json(createResponse(200, 'Test', d3Data.rows, true));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function exportCourse(req: Request, res: Response): Promise<Response> {
  try {
    return res.status(200).json(createResponse(200, 'Test', null, true));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getAllSubjectAreas(req: Request, res: Response): Promise<Response> {
  try {
    const subjectAreas = await makeQuery(`SELECT subjectarea FROM courses GROUP BY subjectarea ORDER BY subjectarea`);

    return res.status(200).json(createResponse(200, 'Successfully got all subject areas', subjectAreas, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getAllDepartments(req: Request, res: Response): Promise<Response> {
  try {
    const subjectAreas = await makeQuery(
      `SELECT array_agg(DISTINCT u.val) depts FROM courses CROSS JOIN LATERAL unnest(courses.departments) as u(val);`,
    );

    return res.status(200).json(createResponse(200, 'Successfully got all departments', subjectAreas, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getOverviewCourses(req: Request, res: Response): Promise<Response> {
  try {
    const {
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
    } = req.body;

    const queryString = customCourseQueryCreation(
      courseName != null && courseName.length > 0 ? courseName : null,
      subjectArea != null && subjectArea.length > 0 ? subjectArea : null,
      creditWeight >= 0 ? creditWeight : null,
      creditWeightSign,
      semester != null && semester.length > 0 ? semester : null,
      department ? [department] : null,
      currSpots >= 0 ? currSpots : null,
      currSpotsSign,
      totalSpots >= 0 ? totalSpots : null,
      totalSpotsSign,
      faculty != null && faculty.length > 0 ? faculty : null,
    );

    if (!queryString) {
      return res.status(400).json(createResponse(400, 'No parameters given', null, true));
    }

    const courses = await makeQuery(queryString);

    return res
      .status(200)
      .json(createResponse(200, 'Successfully got specific course in overview', courses.rows, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getPrereqTreeForCourse(req: Request, res: Response): Promise<Response> {
  try {
    const { courses } = req.body;
    if (!courses) {
      return res.status(400).json(createResponse(400, 'Missing specific course', null, true));
    }

    const databaseResponse = await makeQuery(`SELECT * FROM courses;`);
    const allCourses2 = databaseResponse.rows;
    const fullCourseArray = getNestedPrereqs(courses, allCourses2, true);
    return res.status(200).json(createResponse(200, 'Successfully got prereqs', fullCourseArray, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getMajorList(req: Request, res: Response): Promise<Response> {
  try {
    const databaseResponse = await makeQuery(`SELECT major FROM majors;`);
    return res.status(200).json(createResponse(200, 'Successfully got prereqs', databaseResponse, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}

export async function getMajorCourses(req: Request, res: Response): Promise<Response> {
  try {
    const { major } = req.body;
    if (!major) {
      return res.status(400).json(createResponse(400, 'Missing specific major', null, true));
    }
    const databaseResponse = await makeQuery(`SELECT allcourses FROM majors WHERE major='${major}';`);
    return res.status(200).json(createResponse(200, 'Successfully got prereqs', databaseResponse, false));
  } catch (error) {
    return res.status(400).json(createResponse(400, error.message, null, true));
  }
}
