import express from 'express';

import { createResponse } from './utility';
import { parsing, course, electron } from './controllers';

const router = express.Router();

router.route('/').get((req, res) => {
  return res.status(200).json(createResponse(200, 'Hello World!', null, false));
});

// all other complex routing logic should be in a controller
// there is an example /parse controller to build off of
// in your controllers is where we can import our existing code and utilize that etc.
router.route('/parse').get(parsing.parse);

router.route('/d3Data').get(course.getCoursesDb);

router.route('/overview').post(course.getCoursesForSubjectArea);

router.route('/lookup').post(course.getSpecificCourse);

router.route('/export').post(course.exportCourse);

router.route('/download').get(electron.downloadElectronApp);

router.route('/subject-areas').get(course.getAllSubjectAreas);

router.route('/departments').get(course.getAllDepartments);

router.route('/overview-specific').post(course.getOverviewCourses);

router.route('/prereqs').post(course.getPrereqTreeForCourse);

router.route('/majorsList').get(course.getMajorList);

router.route('/getMajorCourses').post(course.getMajorCourses);

export default router;
