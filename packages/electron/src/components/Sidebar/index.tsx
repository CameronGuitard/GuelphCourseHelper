/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiFoldersLine, RiDatabase2Line } from 'react-icons/ri';
import { BiExport, BiBookBookmark, BiHelpCircle, BiPowerOff } from 'react-icons/bi';
import { SiElectron } from 'react-icons/si';
import './Sidebar.css';

import { sideBarItems } from '../../types';
import checkIfElectron from '../../hooks/isElectron';

export default function Sidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (sidebarItem: sideBarItems) => void;
}): JSX.Element {
  const isElectron = checkIfElectron();

  return (
    <div className="sidebar-body d-flex flex-column px-0">
      <div
        className={`first-item sidebar-item ${selected === 'overview' && 'sidebar-selected'}`}
        onClick={() => onSelect('overview')}
      >
        <RiFoldersLine size={40} />
        Overview
      </div>
      <div className={`sidebar-item ${selected === 'lookup' && 'sidebar-selected'}`} onClick={() => onSelect('lookup')}>
        <FaSearch size={40} />
        Lookup
      </div>
      <div
        className={`sidebar-item ${selected === 'allCourses' && 'sidebar-selected'}`}
        onClick={() => onSelect('allCourses')}
      >
        <RiDatabase2Line size={40} />
        All Courses
      </div>
      <div className={`sidebar-item ${selected === 'export' && 'sidebar-selected'}`} onClick={() => onSelect('export')}>
        <BiExport size={40} />
        Export
      </div>
      {!isElectron && (
        <div
          className={`sidebar-item ${selected === 'getElectron' && 'sidebar-selected'}`}
          onClick={() => onSelect('getElectron')}
        >
          <SiElectron size={40} />
          Get Electron
        </div>
      )}
      <div className={`sidebar-item ${selected === 'myPath' && 'sidebar-selected'}`} onClick={() => onSelect('myPath')}>
        <BiBookBookmark size={40} />
        My Path
      </div>
      <div className={`sidebar-item ${selected === 'help' && 'sidebar-selected'}`} onClick={() => onSelect('help')}>
        <BiHelpCircle size={40} />
        Help
      </div>
      {isElectron && (
        <div className={`sidebar-item ${selected === 'quit' && 'sidebar-selected'}`} onClick={() => window.close()}>
          <BiPowerOff size={40} />
          Quit
        </div>
      )}
    </div>
  );
}
