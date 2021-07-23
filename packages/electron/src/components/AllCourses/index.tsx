import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import { getCoursesDb } from '../../requests';

import { Course } from '../../types';
import './AllCourses.css';
import NetworkGraphV2 from '../Graph/NetworkGraphV2';

export default function AllCourses(): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);

  const [screenWidth, setWidth] = useState(window.innerWidth);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const d3Data = async () => {
    const fullData = await getCoursesDb();
    if (fullData?.data?.length > 0) {
      setCourses(fullData.data);
    }
  };

  useEffect(() => {
    d3Data();
  }, []);

  return (
    <>
      <div className="d-flex flex-column">AllCourses View</div>
      <div className="">
        <NetworkGraphV2 WIDTH={screenWidth / 2} HEIGHT={screenWidth / 2} data={courses} showLegend />
      </div>
    </>
  );
}
