import React, { useState } from 'react';
import './GetElectron.css';

import Button from '../Button';

import { downloadElectronApp } from '../../requests';

export default function GetElectron(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const downloadElectronAppHandler = async (os: 'mac' | 'win') => {
    setLoading(true);
    const file = await downloadElectronApp(os);
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `course_parser_${os}.zip`);
    document.body.appendChild(link);
    link.click();
    setLoading(false);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-50">
      <div className="d-flex flex-column text-center">
        <div>This application is also available as an electron App.</div>
        <div>Click on the OS of the device you wish to download the app for.</div>
        <div>Note: The downloaded file will be around 200mb</div>
      </div>

      {loading ? <div id="loading" /> : <div id="placeholder" />}

      <div className="d-flex">
        <Button type="primary" onClick={() => downloadElectronAppHandler('mac')}>
          Download Mac App
        </Button>
        <Button type="primary" onClick={() => downloadElectronAppHandler('win')}>
          Download Windows App
        </Button>
      </div>
    </div>
  );
}
