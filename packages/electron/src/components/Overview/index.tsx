/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import './Overview.css';

import * as d3 from 'd3';
import { Course, sideBarItems, SubjectAreaObjects, ExportInfo, DeptObject, overviewExport } from '../../types';
import {
  getCoursesForSubjectArea,
  getAllSubjectAreas,
  getAllDepartments,
  getSpecificCoursesOverview,
} from '../../requests';

import Button from '../Button';
import NetworkGraphV2 from '../Graph/NetworkGraphV2';

export default function Overview({
  onSelect,
  setSelectedLookupCourse,
  appendToExports,
  removeFromExports,
  isInExports,
  selectedOverviewCourse,
  setSelectedOverviewCourse,
  getExport,
}: {
  onSelect: (sidebarItem: sideBarItems) => void;
  setSelectedLookupCourse: (course: string) => void;
  appendToExports: (newExport: ExportInfo) => void;
  removeFromExports: (name: string) => void;
  isInExports: (name: string) => boolean;
  selectedOverviewCourse: string;
  setSelectedOverviewCourse: (course: string) => void;
  getExport: (name: string) => overviewExport;
}): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [responseStatus, setResponseStatus] = useState('');
  // used when dynamically populating
  const [subjectAreaDropdown, setSubjectAreaDropdown] = useState<SubjectAreaObjects[]>([]);
  const [deptDropdown, setDeptDropdown] = useState<string[]>([]);

  const [subjectAreaInput, setSubjectAreaInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [facultyInput, setFacultyInput] = useState('');
  const [currentSpotsInput, setCurrentSpotsInput] = useState('');
  const [currentSpotsSign, setCurrentSpotsSign] = useState('');
  const [totalSpotsInput, setTotalSpotsInput] = useState('');
  const [totalSpotsSign, setTotalSpotsSign] = useState('');

  const [weightDropdown, setWeightDropdown] = useState('');
  const [weightSign, setWeightSign] = useState('');
  const [semDropdown, setSemDropdown] = useState('');

  const [deptInput, setDeptInput] = useState('');

  const [exportName, setExportName] = useState('');

  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [rowViewHeight, setRowViewHeight] = useState(50);

  /**
   * Send information from input fields to API and get response
   * @returns Search response from the backend
   */
  const getCourses = async () => {
    setResponseStatus('');
    setCourses([]);
    try {
      const semesters = semDropdown !== '' ? semDropdown.toUpperCase().split(',') : null;
      const subjectAreas = subjectAreaInput !== '' ? subjectAreaInput.toUpperCase().split(',') : null;
      const facultyInputs = facultyInput !== '' ? facultyInput.toUpperCase().split(',') : null;
      const nameInputs = nameInput !== '' ? nameInput.toUpperCase().split(',') : null;
      const courses = await getSpecificCoursesOverview(
        subjectAreas,
        nameInputs,
        facultyInputs,
        parseFloat(currentSpotsInput),
        currentSpotsSign,
        parseFloat(totalSpotsInput),
        totalSpotsSign,
        parseFloat(weightDropdown),
        weightSign,
        semesters,
        deptInput,
      );
      if (courses.data.length === 0) {
        setResponseStatus('No courses matching query found');
        return;
      }
      setCourses(courses.data);
      setResponseStatus('Successfully parsed courses');
    } catch (error) {
      setResponseStatus('You did not pass in an input');
    }
  };

  const getPassedCourses = async (overviewExport: overviewExport) => {
    setResponseStatus('');
    setCourses([]);
    try {
      const courseName = overviewExport.courseName !== '' ? overviewExport.courseName.toUpperCase().split(',') : null;
      const semesters = overviewExport.semester !== '' ? overviewExport.semester.toUpperCase().split(',') : null;
      const subjectArea =
        overviewExport.subjectArea !== '' ? overviewExport.subjectArea.toUpperCase().split(',') : null;
      const faculty = overviewExport.faculty !== '' ? overviewExport.faculty.toUpperCase().split(',') : null;
      const courses = await getSpecificCoursesOverview(
        subjectArea,
        courseName,
        faculty,
        parseFloat(overviewExport.currentSpot),
        overviewExport.currentSpotSign,
        parseFloat(overviewExport.totalSpot),
        overviewExport.totalSpotSign,
        parseFloat(overviewExport.creditWeight),
        overviewExport.creditWeightSign,
        semesters,
        overviewExport.department,
      );
      if (courses.data.length === 0) {
        setResponseStatus('No matching data');
        return;
      }
      setCourses(courses.data);
      setResponseStatus('Successfully parsed courses');
    } catch (error) {
      setResponseStatus('You did not pass in an input');
    }
  };

  const getSubjectAreas = async () => {
    setSubjectAreaDropdown([]);

    try {
      const subjectAreas = await getAllSubjectAreas();
      const subjectAreasData = subjectAreas.data.rows;

      setSubjectAreaDropdown(subjectAreasData);
    } catch (error) {
      setResponseStatus('Failed to get all subject areas');
    }
  };

  const getDepartments = async () => {
    setDeptDropdown([]);

    try {
      const depts = await getAllDepartments();
      const deptsData = depts.data.rows;
      // console.log(deptsData[0]); // object {depts: ['a', 'b', 'c']}
      // console.log(deptsData[0].depts); // array ['a', 'b', 'c']
      setDeptDropdown(deptsData[0].depts);
    } catch (error) {
      setResponseStatus('Failed to get all departments');
    }
  };

  const lookupCourse = (courseCode: string) => {
    // set course to lookup
    setSelectedLookupCourse(courseCode);
    // switch view
    onSelect('lookup');
  };

  // USE EFFECTS

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getSubjectAreas();
    getDepartments();
  }, []);

  useEffect(() => {
    if (selectedOverviewCourse) {
      const query = getExport(selectedOverviewCourse);
      getPassedCourses(query);
    }
    return () => {
      setSelectedOverviewCourse('');
    };
  }, [selectedOverviewCourse]);

  const exportHandler = (event: any) => {
    const { target } = event;
    const exportNameElement = document.getElementById('exportName') as HTMLInputElement;
    if (exportName !== '') {
      exportNameElement.required = false;
      if (target?.checked) {
        if (courses.length > 0) {
          const temp = {
            exportName,
            subjectArea: subjectAreaInput,
            courseName: nameInput,
            faculty: facultyInput,
            currentSpot: currentSpotsInput,
            currentSpotSign: currentSpotsSign,
            totalSpot: totalSpotsInput,
            totalSpotSign: totalSpotsSign,
            creditWeight: weightDropdown,
            creditWeightSign: weightSign,
            semester: semDropdown,
            department: deptInput,
          } as overviewExport;
          appendToExports({ name: exportName, query: temp, data: courses, selected: false } as ExportInfo);
        }
      } else if (courses.length > 0) {
        removeFromExports(exportName);
      }
    } else {
      target.checked = !event.target.checked;
      exportNameElement.required = true;
    }
  };

  return (
    <>
      <div className="d-flex flex-column">
        <div style={{ color: '#ffffff' }}>{responseStatus}</div>
        <div className="d-flex w-100">
          <label htmlFor="overview-main-input">
            Subject Area
            <input onChange={e => setSubjectAreaInput(e.target.value)} />
          </label>
          <label htmlFor="overview-name-input">
            Course Name
            <input onChange={e => setNameInput(e.target.value)} />
          </label>
          <label htmlFor="overview-faculty-input">
            Faculty
            <input onChange={e => setFacultyInput(e.target.value)} />
          </label>
        </div>
        <div className="d-flex w-100">
          <label htmlFor="overview-current-spots-input">
            Current Spots
            <select onChange={e => setCurrentSpotsSign(e.target.value)}>
              <option key=">"> {'>'} </option>
              <option selected key="=">
                {' '}
                ={' '}
              </option>
              <option key="<"> {'<'} </option>
            </select>
            <input onChange={e => setCurrentSpotsInput(e.target.value)} />
          </label>
          <label htmlFor="overview-total-spots-input">
            Total Spots
            <select onChange={e => setTotalSpotsSign(e.target.value)}>
              <option key=">"> {'>'} </option>
              <option selected key="=">
                {' '}
                ={' '}
              </option>
              <option key="<"> {'<'} </option>
            </select>
            <input onChange={e => setTotalSpotsInput(e.target.value)} />
          </label>
        </div>
        <div className="d-flex w-100">
          <label htmlFor="overview-credit-input">
            Credit Weight
            <select onChange={e => setWeightSign(e.target.value)}>
              <option key=">"> {'>'} </option>
              <option selected key="=">
                {' '}
                ={' '}
              </option>
              <option key="<"> {'<'} </option>
            </select>
            <select
              value={weightDropdown}
              onChange={e => setWeightDropdown(e.target.value)}
              placeholder="Select a Credit Weight"
            >
              <option selected key="" />
              <option key="0">0</option>
              <option key="0.25">0.25</option>
              <option key="0.5">0.5</option>
              <option key="0.75">0.75</option>
              <option key="1.00">1.00</option>
              <option key="1.00+">1.00+</option>
            </select>
          </label>
          <label htmlFor="overview-semester-input">
            Semester
            <input onChange={e => setSemDropdown(e.target.value)} />
          </label>
          <label htmlFor="overview-dept-input">
            Dept
            <input onChange={e => setDeptInput(e.target.value)} />
          </label>
        </div>
        <div className="d-flex w-100">
          <Button type="primary" onClick={getCourses}>
            Search
          </Button>
        </div>
        <div className="d-flex w-100">
          {courses.length > 0 && (
            <div>
              <label htmlFor="overview-expot-input">
                Export Name
                <input id="exportName" onChange={e => setExportName(e.target.value)} />
              </label>
              <label htmlFor="export-checkbox">
                <input
                  id="export-checkbox"
                  type="checkbox"
                  defaultChecked={isInExports(exportName)}
                  onClick={exportHandler}
                />
                Add to export ?
              </label>
            </div>
          )}
        </div>
        {courses.length > 0 && (
          <div style={{ width: '100%' }}>
            <div style={{ width: '60%', float: 'left' }}>
              <NetworkGraphV2 WIDTH={screenWidth / 3 - 100} HEIGHT={screenWidth / 3} data={courses} showLegend />
            </div>
            <table style={{ float: 'right' }} width="40%">
              <tr>
                <td>
                  <table className="export-table" width="400">
                    <tr>
                      <th style={{ width: '33%' }} className="export-table-col">
                        Course Code
                      </th>
                      <th style={{ width: '33%' }} className="export-table-col">
                        Description
                      </th>
                      <th style={{ width: '33%' }} className="export-table-col">
                        Lookup Course
                      </th>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ height: (rowViewHeight + 22) * 6, overflow: 'auto' }}>
                    <table className="overview-table mb-5" width="400">
                      {courses.map(course => {
                        return (
                          <tr key={course.coursecode}>
                            <td style={{ width: '33%' }} className="overview-table-col">
                              {course.coursecode}
                            </td>
                            <td style={{ width: '33%' }} className="overview-table-col">
                              {course.description}
                            </td>
                            <td style={{ width: '33%' }} className="overview-table-col">
                              <Button type="primary" onClick={() => lookupCourse(course.coursecode)}>
                                Click to Lookup
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
