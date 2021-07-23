/* eslint-disable no-param-reassign */

import * as d3 from 'd3';
import React from 'react';

import { D3Node, D3DOMNode } from '../../types';

export default class Nodes extends React.Component<{ nodes: D3Node[]; simulation: any }, unknown> {
  ref!: SVGGElement;

  componentDidMount(): void {
    const { nodes } = this.props;
    const context: any = d3.select(this.ref);
    const { simulation } = this.props;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function onDragStart(event: { active: any }, d: any) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function onDrag(event: { x: any; y: any }, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function onDragEnd(event: any, d: any) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    context
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 7)
      .attr('fill', (d: D3Node) => {
        return color(d.group.toString());
      })
      .call(d3.drag().on('start', onDragStart).on('drag', onDrag).on('end', onDragEnd))
      .append('text')
      .text((d: D3Node) => {
        return d.id;
      });
  }

  render(): React.ReactNode {
    return (
      <g
        className="nodes"
        ref={(ref: SVGGElement) => {
          this.ref = ref;
        }}
      />
    );
  }
}
