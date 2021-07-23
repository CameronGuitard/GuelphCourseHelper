/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */

import React, { useState, useEffect, useRef } from 'react';
import './Export.css';
import { BiHelpCircle } from 'react-icons/bi';
import Canvg from 'canvg';
import { Course, ExportInfo, sideBarItems } from '../../types';
import Button from '../Button';
import NetworkGraphV2 from '../Graph/NetworkGraphV2';

export default function Export(
  this: any,
  {
    selectedExports,
    updateCheckedExport,
    onSelect,
    setSelectedLookupCourse,
    setSelectedOverviewCourse,
  }: {
    selectedExports: Array<ExportInfo>;
    updateCheckedExport: (name: string, checked: boolean) => void;
    onSelect: (sidebarItem: sideBarItems) => void;
    setSelectedLookupCourse: (course: string) => void;
    setSelectedOverviewCourse: (course: string) => void;
  },
): JSX.Element {
  const [graphName, setGraphName] = useState('');
  const [graphData, setGraphData] = useState([] as Course[]);
  const [isGraphGenerated, setIsGraphGenerated] = useState(false);
  const [screenWidth, setWidth] = useState(window.innerWidth);
  const [rowViewHeight, setRowViewHeight] = useState(50);
  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setupGraphDataObj = (): Course[] => {
    const selected = [] as Course[];
    selectedExports.forEach(exportInfo => {
      if (exportInfo.selected) {
        exportInfo.data.forEach(course => {
          selected.push(course);
        });
      }
    });
    return selected;
  };

  const downloadGraph = async () => {
    const svg = document.getElementById('d3ExportContainer');
    if (svg) {
      const serialized = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const v = Canvg.fromString(ctx, serialized);
        await v.render();
        const dataURL = canvas.toDataURL('image/PNG');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${graphName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.appendChild(link);
      }
    }
  };

  const lookupCourse = (courseCode: string) => {
    // set course to lookup
    setSelectedLookupCourse(courseCode);
    // switch view
    onSelect('lookup');
  };

  const lookupSubjectArea = (subjectArea: string) => {
    // set course to lookup
    setSelectedOverviewCourse(subjectArea);
    // switch view
    onSelect('overview');
  };

  return (
    <>
      <div className="row mt-5 mb-5 ml-1 mr-1">
        <div className="d-flex flex-column">
          <table width="450">
            <tr>
              <td>
                <table className="export-table" width="450">
                  <tr>
                    <th style={{ width: '33%' }} className="export-table-col">
                      Add to Graph
                      <BiHelpCircle size={25} />
                    </th>
                    <th style={{ width: '33%' }} className="export-table-col">
                      Description
                    </th>
                    <th style={{ width: '33%' }} className="export-table-col">
                      Select View
                    </th>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ height: (rowViewHeight + 22) * 6, overflow: 'auto' }}>
                  <table className="export-table" width="450">
                    {selectedExports.map(exports => {
                      return (
                        <tr key={exports.name} style={{ height: rowViewHeight }}>
                          <td style={{ width: '33%' }} className="export-table-col">
                            <input
                              type="checkbox"
                              defaultChecked={exports.selected}
                              onChange={event => {
                                updateCheckedExport(exports.name, event.target.checked);
                              }}
                            />
                          </td>
                          <td style={{ width: '33%' }} className="export-table-col">
                            {exports.name}
                          </td>
                          <td style={{ width: '33%' }} className="export-table-col">
                            <Button
                              type="primary"
                              onClick={() => {
                                if (exports.data.length > 1) {
                                  lookupSubjectArea(exports.name);
                                } else {
                                  lookupCourse(exports.name);
                                }
                              }}
                            >
                              Click to View
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
          <div className="spacing">
            <label htmlFor="graphType">
              Graph Type:
              <select name="dropdown" className="spacing">
                <option>Network Graph</option>
              </select>
            </label>
            <Button
              type="primary"
              onClick={() => {
                const updatedData = setupGraphDataObj();
                setGraphData(updatedData);
                setIsGraphGenerated(true);
              }}
            >
              Generate Graph
            </Button>
          </div>
        </div>
        <div style={{ width: '60%' }} className="ml-5">
          {isGraphGenerated && (
            <div className="smallerSpacing">
              <NetworkGraphV2 WIDTH={screenWidth / 2.5} HEIGHT={screenWidth / 4} data={graphData} showLegend />
              <label htmlFor="exportTitle">
                Graph Title:
                <input id="exportTitle" className="mr-3" onChange={e => setGraphName(e.target.value)} />
              </label>
              <Button type="primary" onClick={downloadGraph}>
                Download graph
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
