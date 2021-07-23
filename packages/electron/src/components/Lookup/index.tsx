import React, { useState, useEffect } from 'react';
import './Lookup.css';

import { Course, ExportInfo } from '../../types';
import { getSpecificCourse } from '../../requests';

import Button from '../Button';

export default function Lookup(
  this: any,
  {
    selectedLookupCourse,
    setSelectedLookupCourse,
    appendToExports,
    removeFromExports,
    isInExports,
  }: {
    selectedLookupCourse: string;
    setSelectedLookupCourse: (course: string) => void;
    appendToExports: (newExport: ExportInfo) => void;
    removeFromExports: (name: string) => void;
    isInExports: (name: string) => boolean;
  },
): JSX.Element {
  const [course, setCourse] = useState<Course | null>(null);
  const [specificCourseInput, setSpecificCourseInput] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const openModal = () => {
    setPopupVisible(!popupVisible);
  };

  const getCourse = async () => {
    setResponseStatus('');
    setCourse(null);

    try {
      const courseResponse = await getSpecificCourse(specificCourseInput.toUpperCase());
      if (courseResponse == null || courseResponse.data == null || courseResponse.data.length === 0) {
        setResponseStatus('Invalid Course Code');
        return;
      }
      setCourse(courseResponse.data[0]);
      setPopupVisible(false);
      setResponseStatus('Successfully got Course');
    } catch (error) {
      setResponseStatus('You did not pass in an input');
    }
  };

  // could probably be made reusable but yolo
  const getPassedCourse = async (passedCourse: string) => {
    setResponseStatus('');
    setCourse(null);

    try {
      const courseResponse = await getSpecificCourse(passedCourse.toUpperCase());
      if (courseResponse == null || courseResponse.data == null || courseResponse.data.length === 0) {
        setResponseStatus('Invalid Course Code');
        return;
      }
      setCourse(courseResponse.data[0]);
      setResponseStatus('Successfully got Course');
    } catch (error) {
      setResponseStatus('You did not pass in an input');
    }
  };

  // when a passed lookup course from overview changes, refetch course
  useEffect(() => {
    if (selectedLookupCourse) {
      setSpecificCourseInput(selectedLookupCourse);
      getPassedCourse(selectedLookupCourse);
    }

    return () => {
      setSpecificCourseInput('');
      setSelectedLookupCourse('');
    };
  }, [selectedLookupCourse]);

  const exportHandler = (event: any) => {
    if (event.target?.checked) {
      if (course) {
        appendToExports({ name: course?.coursecode, data: [course], selected: false } as ExportInfo);
      }
    } else if (course) {
      removeFromExports(course.coursecode);
    }
  };
  return (
    <>
      <div className="tableProp mb-5">
        <div style={{ color: '#ffffff' }}>{responseStatus}</div>
        <div className="d-flex w-100 justify-content-center">
          <label htmlFor="course-code">
            Enter a course code (ex. CIS*1000)
            <input
              id="course-code"
              placeholder="Enter Course Code"
              className="mr-3"
              value={specificCourseInput}
              onChange={e => setSpecificCourseInput(e.target.value)}
            />
          </label>
          <Button type="primary" onClick={getCourse}>
            Search
          </Button>
        </div>
        <div className="d-flex w-100 justify-content-center">
          {course !== null && (
            <label htmlFor="export-checkbox">
              <input
                id="export-checkbox"
                type="checkbox"
                defaultChecked={isInExports(course.coursecode)}
                onChange={exportHandler}
              />
              Add to export ?
            </label>
          )}
        </div>
        <div className="lookup-table-header">
          {course?.coursecode} - {course?.name}
        </div>
        <table className="lookup-table mb-5">
          <tbody>
            <tr>
              <td className="lookup-table-col">Description</td>
              <td className="lookup-table-col">{course?.description}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Semester</td>
              <td className="lookup-table-col">{course?.semesters.join(', ')}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Lecture/Labs</td>
              <td className="lookup-table-col">{course?.lecslabs}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Offerings</td>
              <td className="lookup-table-col">{course?.offerings}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Prerequisites</td>
              <td className="lookup-table-col">{course?.prerequisites?.fullRawPrereq}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Corequisites</td>
              <td className="lookup-table-col">{course?.corequisites?.fullRawCoreqs}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Restrictions</td>
              <td className="lookup-table-col">{course?.restrictions?.fullRawRestrict}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Location</td>
              <td className="lookup-table-col">{course?.location}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Faculty</td>
              <td className="lookup-table-col">{course?.faculty ? course?.faculty.join(', ') : ''}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Equates</td>
              <td className="lookup-table-col">{course?.equates}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Departments</td>
              <td className="lookup-table-col">{course?.departments.join(', ')}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Current Spots</td>
              <td className="lookup-table-col">{course?.currentspots}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Total Spots</td>
              <td className="lookup-table-col">{course?.totalspots}</td>
            </tr>
            <tr>
              <td className="lookup-table-col">Meeting Info</td>
              <td className="lookup-table-col">
                <Button type="primary" onClick={openModal}>
                  View Meeting Info
                </Button>
                {popupVisible && course?.meetinginfo?.length !== undefined ? (
                  <tr>
                    <td className="lookup-table-col">Section</td>
                    <td className="lookup-table-col">Lecture</td>
                    <td className="lookup-table-col">Seminar</td>
                    <td className="lookup-table-col">Lab</td>
                    <td className="lookup-table-col">Exam</td>
                  </tr>
                ) : null}
                {popupVisible && course?.meetinginfo?.length === undefined ? (
                  <div>There is no meeting information for this course</div>
                ) : null}
                {popupVisible && course?.meetinginfo?.length !== undefined
                  ? course?.meetinginfo?.map(timings => {
                      return (
                        <tr>
                          <td className="lookup-table-col">{timings.section}</td>
                          <td className="lookup-table-col">{timings.lecture}</td>
                          <td className="lookup-table-col">{timings.seminar}</td>
                          <td className="lookup-table-col">{timings.lab}</td>
                          <td className="lookup-table-col">{timings.exam}</td>
                        </tr>
                      );
                    })
                  : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
