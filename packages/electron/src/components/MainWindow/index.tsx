/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './MainWindow.css';

import { sideBarItems, ExportInfo, overviewExport } from '../../types';

import Help from '../Help';
import Overview from '../Overview';
import Lookup from '../Lookup';
import AllCourses from '../AllCourses';
import GetElectron from '../GetElectron';
import MyPath from '../MyPath';
import Export from '../Export';

export default function MainWindow({
  selected,
  onSelect,
}: {
  selected: sideBarItems;
  onSelect: (sidebarItem: sideBarItems) => void;
}): JSX.Element {
  const [selectedLookupCourse, setSelectedLookupCourse] = useState('');
  const [selectedOverviewCourse, setSelectedOverviewCourse] = useState('');
  const [selectedExports, setSelectedExports] = useState([] as Array<ExportInfo>);

  const appendToExports = (newExport: ExportInfo) => {
    if (newExport) {
      const array = [...selectedExports, newExport];
      setSelectedExports(array);
    }
  };

  const updateCheckedExport = (name: string, checked: boolean): void => {
    const exportArray = selectedExports;
    selectedExports.forEach((info, index) => {
      if (info.name === name) {
        if (info.selected !== checked) {
          exportArray[index].selected = checked;
          setSelectedExports(exportArray);
        }
      }
    });
  };

  const removeFromExports = (name: string) => {
    const exportArray = selectedExports;
    const startLength = exportArray.length;
    exportArray.forEach((info, index) => {
      if (info.name === name) {
        exportArray.splice(index, 1);
      }
    });
    if (startLength !== exportArray.length) {
      setSelectedExports(exportArray);
    }
  };

  const isInExports = (name: string) => {
    let inExport = false;
    selectedExports.forEach(info => {
      if (info.name === name) {
        inExport = true;
      }
    });
    return inExport;
  };

  const getExport = (name: string): overviewExport => {
    let queryInfo = {} as overviewExport;
    selectedExports.forEach(info => {
      if (info.name === name) {
        queryInfo = info.query;
      }
    });
    return queryInfo;
  };

  const renderView = () => {
    switch (selected) {
      case 'help':
        return <Help />;

      case 'overview':
        return (
          <Overview
            onSelect={onSelect}
            setSelectedLookupCourse={setSelectedLookupCourse}
            appendToExports={appendToExports}
            removeFromExports={removeFromExports}
            isInExports={isInExports}
            selectedOverviewCourse={selectedOverviewCourse}
            setSelectedOverviewCourse={setSelectedOverviewCourse}
            getExport={getExport}
          />
        );

      case 'lookup':
        return (
          <Lookup
            selectedLookupCourse={selectedLookupCourse}
            setSelectedLookupCourse={setSelectedLookupCourse}
            appendToExports={appendToExports}
            removeFromExports={removeFromExports}
            isInExports={isInExports}
          />
        );

      case 'allCourses':
        return <AllCourses />;

      case 'getElectron':
        return <GetElectron />;

      case 'myPath':
        return <MyPath />;

      case 'export':
        return (
          <Export
            selectedExports={selectedExports}
            updateCheckedExport={updateCheckedExport}
            onSelect={onSelect}
            setSelectedLookupCourse={setSelectedLookupCourse}
            setSelectedOverviewCourse={setSelectedOverviewCourse}
          />
        );

      default:
        return null;
    }
  };

  return <div className="col main-window-body">{renderView()}</div>;
}
