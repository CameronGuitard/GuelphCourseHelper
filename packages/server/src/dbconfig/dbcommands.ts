import { QueryResult } from 'pg';
import { pool } from './dbconnector';
import { createCourseTable } from './createCourseTable';
import { setupUniversity } from '../parsing';
import { addCoursesToTable, createUniversityValues } from './createCourseTable';
import { utility } from '../utility';
import { addMajorsToTable, createMajorTable, fillMajorTable } from './createMajorTable';

/**
 * This function makes a query to the database
 * @param queryString The query string to make
 */
export const makeQuery = (queryString: string): Promise<QueryResult> => {
  return pool
    .query(queryString)
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
};
/**
 * Example of how to use function
 *
 * makeQuery(`SELECT VERSION();`)
 * .then(function (data) {
 *  console.log(data);
 * })
 *.catch(error => {
 *  console.log(error);
 * });
 *
 */

/**
 * Creates and fills the table with course information if it is missing
 * @returns A promise indicating if it was successful or not
 */
export const createAndFillCourses = async (): Promise<void> => {
  return await createCourseTable()
    .then(async data => {
      return await makeQuery('SELECT CASE WHEN EXISTS (SELECT * FROM courses LIMIT 1) THEN 1 ELSE 0 END;')
        .then(async exists => {
          if (exists['rows'][0]['case'] == 0) {
            return await setupUniversity()
              .then(async university => {
                return await addCoursesToTable('courses', createUniversityValues(university))
                  .then(success => {
                    return success;
                  })
                  .catch(err => {
                    return err;
                  });
              })
              .catch(err => {
                return err;
              });
          }
          return 'Data already exists';
        })
        .catch(err => {
          return err;
        });
    })
    .catch(err => {
      console.log('Error here');
      return err;
    });
};

/**
 * Creates and fills the table with majors if it is missing
 * @returns A promise indicating if it was successful or not
 */
export const createAndFillMajors = async (): Promise<void> => {
  return await createMajorTable()
    .then(async data => {
      return await makeQuery('SELECT CASE WHEN EXISTS (SELECT * FROM majors LIMIT 1) THEN 1 ELSE 0 END;')
        .then(async exists => {
          if (exists['rows'][0]['case'] == 0) {
            return await addMajorsToTable('majors', await fillMajorTable())
              .then(success => {
                return success;
              })
              .catch(err => {
                return err;
              });
          }
          return 'Data already exists';
        })
        .catch(err => {
          return err;
        });
    })
    .catch(err => {
      console.log('Error here as well');
      return err;
    });
};

export const getCourses = async (): Promise<QueryResult> => {
  return await makeQuery('SELECT * FROM courses;');
};

/**
 * This function creates a custom query
 * @param name The name to search for
 * @param subjectArea The subject area to search for
 * @param weight The weight to search for
 * @param weightSign The sign of the weight (<,=,>)
 * @param semesters The semesters to search for
 * @param departments The departments to search for
 * @param currentspots The current spots to search for
 * @param currentspotsSign The sign of the currentSpots (<,=,>)
 * @param totalspots The total spots to search for
 * @param totalspotsSign The sign of the totalSpots (<,=,>)
 * @param faculty The faculty to search for
 * @returns The query for the database
 */
export const customCourseQueryCreation = (
  name?: Array<string>,
  subjectArea?: Array<string>,
  weight?: number,
  weightSign?: string,
  semesters?: Array<string>,
  departments?: Array<string>,
  currentspots?: number,
  currentspotsSign?: string,
  totalspots?: number,
  totalspotsSign?: string,
  faculty?: Array<string>,
): string => {
  let command = 'SELECT * FROM courses WHERE ';
  let multipleCommands = false;
  if (name && name.length > 0) {
    command += multipleCommands ? 'AND ' : '';
    name.forEach(element => {
      command += `name = '${element}' OR `;
    });
    command = command.slice(0, -3);

    multipleCommands = true;
  }
  if (subjectArea && subjectArea.length > 0) {
    command += multipleCommands ? 'AND ' : '';
    subjectArea.forEach(element => {
      command += `subjectarea = '${element}' OR `;
    });
    command = command.slice(0, -3);

    multipleCommands = true;
  }
  if (weight != null && weight >= 0 && weightSign) {
    command += multipleCommands ? 'AND ' : '';
    command += `weight ${weightSign} '${weight}' `;
    multipleCommands = true;
  }
  if (semesters && semesters.length > 0) {
    command += multipleCommands ? 'AND ' : '';
    const stringifySemesters = utility.stringifyArrayToDBArray(semesters);
    command += `semesters && '${stringifySemesters}' `;
    multipleCommands = true;
  }

  if (departments && departments.length > 0) {
    command += multipleCommands ? 'AND ' : '';
    const stringifyDepartments = utility.stringifyArrayToDBArray(departments);
    command += `departments && '${stringifyDepartments}' `;
    multipleCommands = true;
  }

  if (currentspots != null && currentspots >= 0) {
    command += multipleCommands ? 'AND ' : '';
    currentspotsSign = !!currentspotsSign ? currentspotsSign : '=';
    command += `currentspots ${currentspotsSign} '${currentspots}' `;
    multipleCommands = true;
  }

  if (totalspots != null && totalspots >= 0) {
    command += multipleCommands ? 'AND ' : '';
    totalspotsSign = !!totalspotsSign ? totalspotsSign : '=';
    command += `totalspots ${totalspotsSign} '${totalspots}' `;
    multipleCommands = true;
  }

  if (faculty && faculty.length > 0) {
    command += multipleCommands ? 'AND ' : '';
    const stringifyFaculty = utility.stringifyArrayToDBArray(faculty);
    command += `faculty && '${stringifyFaculty}' `;
    multipleCommands = true;
  }

  return multipleCommands ? command + 'GROUP BY coursecode ORDER BY coursecode;' : '';
};
