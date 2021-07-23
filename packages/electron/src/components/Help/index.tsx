import * as d3 from 'd3';
import React, { useEffect } from 'react';
import './Help.css';

export default function Help(): JSX.Element {
  useEffect(() => {
    const data = [44, 50, 100, 16, 23, 35];
    const width = 500;
    const barHeight = 20;
    const x = d3.scaleLinear().domain([0, 35]).range([0, width]);
    const chart2 = d3
      .select('#chart')
      .attr('width', width)
      .attr('height', barHeight * data.length);
    const bar = chart2
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', function (d, i) {
        return `translate(0,${barHeight * i})`;
      });
    bar
      .append('rect')
      .attr('width', x)
      .attr('height', barHeight - 1);
    bar
      .append('text')
      .attr('x', function (d) {
        return x(d) - 3;
      })
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function (d) {
        return d;
      });
  }, []);

  return (
    <>
      <div className="mt-5 ml-5">
        Help Table
        <table className="help-table mb-5">
          <thead>
            <tr>
              <td style={{ width: '15%', fontWeight: 'bold' }} className="help-table-col">
                Pages
              </td>
              <td style={{ width: '15%', fontWeight: 'bold' }} className="help-table-col">
                Description of Page
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: '15%' }} className="help-table-col">
                Overview
              </td>
              <td className="help-table-col">
                This page gives you access through a table to view all possible courses offered in a particular
                department/subject area with additional applicable filters available such as credit weight, semester to
                narrow your searches. A Network Graph accompanies the table to provide a visual aid of the connections
                all these courses share in terms of prequisites.
              </td>
            </tr>
            <tr>
              <td style={{ width: '15%' }} className="help-table-col">
                Lookup
              </td>
              <td className="help-table-col">
                This page will display all of the information about any specific course in a subject area. This
                information includes the Description, Semester, Lecture/Labs, Offerings, Prerequisites, Corequisites,
                Restrictions, Location, Faculty, Equates, Departments, Current Spots, Total Spots and Class Meeting
                Timings.
              </td>
            </tr>
            <tr>
              <td style={{ width: '15%' }} className="help-table-col">
                All Courses
              </td>
              <td className="help-table-col">
                This page displays a huge and dense Network Graph which includes all courses across all subject areas
                offered at the University of Guelph. Alongside, an interactive Network Graph, a node legend is included
                which shows which subject areas correspond with which colours.
              </td>
            </tr>
            <tr>
              <td style={{ width: '15%' }} className="help-table-col">
                Export
              </td>
              <td className="help-table-col">
                This page will allow you to populate and generate Network graphs with courses and subject areas from
                either the Lookup or Overview page. Once these graphs are generated, you can export them as a .png file.
              </td>
            </tr>
            <tr>
              <td style={{ width: '15%' }} className="help-table-col">
                Get Electron
              </td>
              <td className="help-table-col">
                This page is where you can go to download either the Windows or Mac Version of the Electron Application
                depending on your operating system.
              </td>
            </tr>
            <tr>
              <td style={{ width: '15%' }} className="help-table-col">
                My Path
              </td>
              <td className="help-table-col">
                This page allows you to copy and paste your transcript so that it can be parsed and displayed in a more
                comprehensive fashion along with a Network graph
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
