/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */

import * as d3 from 'd3';
import React from 'react';

import Link from './Link';

import { D3Link } from '../../types';

export default class Links extends React.Component<{ links: D3Link[] }, unknown> {
  render(): React.ReactNode {
    const { links: propLinks } = this.props;

    const links = propLinks.map((link: D3Link, index: number) => {
      return <Link key={index} link={link} />;
    });

    return <g className="links">{links}</g>;
  }
}
