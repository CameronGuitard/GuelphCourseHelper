import React, { useState, useEffect } from 'react';

interface Window {
  process: {
    type?: string;
  };
}

interface Process {
  versions: {
    electron?: string;
  };
}

// this hook tells us if we are running in the browser, or electron app
const checkIfElectron = (): boolean => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Renderer process
    if (
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      (<Window>window).process.type === 'renderer'
    ) {
      return setIsElectron(true);
    }

    // Main process
    if (
      typeof process !== 'undefined' &&
      typeof process.versions === 'object' &&
      !!(<Process>process).versions.electron
    ) {
      return setIsElectron(true);
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (
      typeof navigator === 'object' &&
      typeof navigator.userAgent === 'string' &&
      navigator.userAgent.indexOf('Electron') >= 0
    ) {
      return setIsElectron(true);
    }

    return setIsElectron(false);
  }, []);

  return isElectron;
};

export default checkIfElectron;
