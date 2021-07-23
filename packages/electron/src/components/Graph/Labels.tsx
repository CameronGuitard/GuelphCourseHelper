/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import * as d3 from 'd3';

import { D3Node } from '../../types';
import Label from './Label';

export default class Labels extends React.Component<{ nodes: D3Node[] }, unknown> {
  render(): React.ReactNode {
    const labels = this.props.nodes.map((node: D3Node, index: number) => {
      return <Label key={index} node={node} />;
    });

    return <g className="labels">{labels}</g>;
  }
}
