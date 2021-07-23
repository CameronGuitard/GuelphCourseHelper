/* eslint-disable react/button-has-type */
import React, { CSSProperties } from 'react';
import './Button.css';

export default function Button({
  children,
  type,
  onClick,
  style,
}: {
  children: string | JSX.Element;
  type: 'primary' | 'secondary' | 'warning';
  onClick: (param: React.MouseEvent) => void;
  style?: CSSProperties;
}): JSX.Element {
  return (
    <button style={style} className={`btn button-body button-${type}`} onClick={onClick}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  style: null,
};
