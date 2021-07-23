import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import React from 'react';
import Links from './Links';
import Nodes from './Nodes';
import Labels from './Labels';

import { GraphData } from '../../types';

type Props = {
  width: number;
  height: number;
  data: GraphData;
};

export default class NetworkGraph extends React.Component<Props, unknown> {
  ref!: HTMLDivElement;

  simulation: any;

  constructor(props: Props) {
    super(props);
    const { width, height, data } = props;

    this.simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id((d: any) => {
          return d.id;
        }),
      )
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .nodes(data.nodes as SimulationNodeDatum[]);

    this.simulation.force('link').links(data.links);
  }

  componentDidMount(): void {
    const { data } = this.props;
    const node = d3.select('.nodes').selectAll('circle');
    const link = d3.select('.links').selectAll('line');
    const label = d3.selectAll('.label');

    function ticked() {
      link
        .attr('x1', function (d: any) {
          return d.source.x;
        })
        .attr('y1', function (d: any) {
          return d.source.y;
        })
        .attr('x2', function (d: any) {
          return d.target.x;
        })
        .attr('y2', function (d: any) {
          return d.target.y;
        });

      node
        .attr('cx', function (d: any) {
          return d.x;
        })
        .attr('cy', function (d: any) {
          return d.y;
        });

      label
        .attr('x', function (d: any) {
          return d.x + 5;
        })
        .attr('y', function (d: any) {
          return d.y + 5;
        });
    }

    this.simulation.nodes(data.nodes).on('tick', ticked);
  }

  render(): React.ReactNode {
    const { width, height, data } = this.props;
    return (
      <svg className="container" width={width} height={height} viewBox="0 0 1200 1200">
        <Links links={data.links} />
        <Nodes nodes={data.nodes} simulation={this.simulation} />
        <Labels nodes={data.nodes} />
      </svg>
    );
  }
}
