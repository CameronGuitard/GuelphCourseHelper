/* eslint-disable react/destructuring-assignment */

import * as React from 'react';
import * as d3 from 'd3';
import { D3Node } from '../../types';

export default class Label extends React.Component<{ node: D3Node }, unknown> {
  ref!: SVGTextElement;

  componentDidMount(): void {
    d3.select(this.ref).data([this.props.node]);
  }

  render(): React.ReactNode {
    return (
      <text
        className="label"
        ref={(ref: SVGTextElement) => {
          this.ref = ref;
        }}
      >
        {this.props.node.id}
      </text>
    );
  }
}
