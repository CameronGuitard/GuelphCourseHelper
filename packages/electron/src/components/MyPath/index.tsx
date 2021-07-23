/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

import './MyPath.css';
import transcriptExample from '../../assets/transcript_example.png';

import { Course, PreReqs, CoReqs } from '../../types';
import Button from '../Button';
import NetworkGraphV2 from '../Graph/NetworkGraphV2';
import { getCoursePrereq, getMajor, getMajorCourses } from '../../requests';

type parsedCourse = {
  courseCode: string;
  section: string;
  courseName: string;
  grade: string;
  credits: string;
  repeat: string;
  term: string;
};

export default function MyPath(): JSX.Element {
  const [transcriptInput, setTranscriptInput] = useState('');
  const [majorDropdown, setMajorDropdown] = useState('');
  const [parsedTranscriptInfo, setParsedTranscriptInfo] = useState({
    studentNum: '',
    studentName: '',
    creditInfo: {
      totalEarnedCredits: '',
      totalGradePoints: '',
      cumulativeGPA: '',
    },
    courses: [] as parsedCourse[],
  });
  const [hoverInfo, setHoverInfo] = useState(false);
  const [transcriptCourses, setTransciptCourses] = useState([] as Array<Course>);
  const [majorDropdownOnjects, setMajorDropdownList] = useState<string[]>([]);
  const [majorCourses, setMajorCourses] = useState([] as Array<Course>);

  const parseCoursesToNetworkData = async (courses: parsedCourse[]) => {
    const courseCodes = [] as Array<string>;
    courses.forEach(parsedCourses => {
      courseCodes.push(parsedCourses.courseCode);
    });
    const courseMap = await getCoursePrereq(courseCodes);
    setTransciptCourses(courseMap.data);
  };

  const parseTranscript = () => {
    const lineArr: string[] = [];
    let line = '';

    let studentNum = '';
    let studentName = '';
    let otherInfo = [];

    transcriptInput.split(/\s+/).forEach((item, i) => {
      if (i === 0) {
        studentNum = item;
        return;
      }

      if (item === 'Course/Section') {
        studentName = line;
        line = '';
        return;
      }

      if (
        item === 'and' ||
        item === 'Title' ||
        item === 'Grade' ||
        item === 'Credits' ||
        item === 'Repeat' ||
        item === 'Term'
      ) {
        return;
      }

      line += `${item} `;

      // end of row
      if (item.match(/^[A-Z]{1}[0-9]{2}/gm)) {
        lineArr.push(line);
        line = '';
      }
    });
    otherInfo = line.split(' ');

    const formattedCourseInfo = lineArr.reduce(
      (acc, courseLine) => {
        const course: parsedCourse = {
          courseCode: '',
          section: '',
          courseName: '',
          grade: '',
          credits: '',
          repeat: '',
          term: '',
        };

        let courseName = '';
        let isCourseName = true;
        const courseInfo = courseLine.split(' ');
        courseInfo.forEach((info, i) => {
          if (i === 0) {
            course.courseCode = info;
            return;
          }

          if (i === 1) {
            course.section = info;
            return;
          }

          if (info === 'P' || info === 'OP' || info.match(/[0-9]{3}/gm)) {
            isCourseName = false;
            course.courseName = courseName.trim();
            courseName = '';
            course.grade = info;
            return;
          }

          courseName += `${info} `;

          if (isCourseName) return;

          if (info.match(/\d\.[0-9]{2}/gm)) {
            course.credits = info;
            return;
          }

          // what is actually in repeat??
          if (info === 'X') {
            course.repeat = info;
            return;
          }

          // jank with COOP name, figure out later
          if (info.match(/^[A-Z]{1}[0-9]{2}/gm)) {
            course.term = info;
          }
        });

        return {
          ...acc,
          courses: [...acc.courses, course],
        };
      },
      {
        studentNum,
        studentName,
        creditInfo: {
          totalEarnedCredits: otherInfo[2],
          totalGradePoints: otherInfo[5],
          cumulativeGPA: otherInfo[8],
        },
        courses: [] as parsedCourse[],
      },
    );
    setParsedTranscriptInfo(formattedCourseInfo);
    parseCoursesToNetworkData(formattedCourseInfo.courses);
  };

  const getMajorsList = async () => {
    try {
      const majors = await getMajor();
      const data = majors.data.rows;
      const stringArray = [] as Array<string>;
      data.forEach(element => {
        stringArray.push(element.major);
      });
      setMajorDropdownList(stringArray);
    } catch (error) {
      console.log('No majors');
    }
  };

  const createMajorGraph = async () => {
    if (majorDropdown) {
      const returnedCourses = await getMajorCourses(majorDropdown);
      const courseList = returnedCourses.data.rows[0].allcourses;
      const courseMap = await getCoursePrereq(courseList);
      setMajorCourses(courseMap.data);
    }
  };

  useEffect(() => {
    if (majorDropdownOnjects.length <= 0) {
      getMajorsList();
    }
  });
  return (
    <>
      <div className="flex-column">
        My Path View
        <div className="d-flex w-100 justify-content-left ">
          <div>
            <label htmlFor="course-code">
              Paste your unofficial UofG transcript to get started{' '}
              <FaQuestionCircle onMouseEnter={() => setHoverInfo(true)} onMouseLeave={() => setHoverInfo(false)} />:
              <input
                id="course-code"
                placeholder="Paste transcript"
                className="mr-3"
                value={transcriptInput}
                onChange={e => setTranscriptInput(e.target.value)}
              />
            </label>
            <Button type="primary" onClick={parseTranscript}>
              Parse
            </Button>
            <div className="d-flex ml-5 w-10 justify-content-right" style={{ float: 'right' }}>
              <label htmlFor="mypath-major-input">
                Major
                <select
                  value={majorDropdown}
                  onChange={e => setMajorDropdown(e.target.value)}
                  placeholder="Select a Major"
                >
                  <option selected key="" />
                  {majorDropdownOnjects.map(major => {
                    return <option>{major}</option>;
                  })}
                </select>
              </label>
              <Button type="primary" onClick={createMajorGraph}>
                Display
              </Button>
            </div>
          </div>
        </div>
        {hoverInfo && (
          <div className="d-flex w-100 justify-content-center flex-column align-items-center">
            Your copy selection should look like this:{' '}
            <img className="transcriptExample" src={transcriptExample} alt="transcript" />
          </div>
        )}
        <div>
          <div style={{ display: 'inline-block', width: '70em' }}>
            <NetworkGraphV2 data={transcriptCourses} WIDTH={700} HEIGHT={700} showLegend />
          </div>
          <div style={{ display: 'inline-block', width: '70em' }}>
            <NetworkGraphV2 data={majorCourses} WIDTH={700} HEIGHT={700} showLegend />
          </div>
        </div>
      </div>
    </>
  );
}
