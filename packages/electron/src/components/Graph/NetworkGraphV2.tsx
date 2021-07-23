/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useEffect, useRef, MouseEvent, WheelEventHandler, WheelEvent } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import subjectAreas from './allSubjectAreas.json';
import './NetworkGraph.css';

import { CourseResponse, D3Node, D3Link, d3Obj, Course } from '../../types';
import Button from '../Button';

const RADIUS = 5;
let isPanning = false;
let startPoint = { x: 0, y: 0 };
let endPoint = { x: 0, y: 0 };
let scale = 100;

export default function NetworkGraphV2({
  WIDTH,
  HEIGHT,
  data,
  isBounded = false,
  showLegend = false,
}: {
  WIDTH: number;
  HEIGHT: number;
  data: CourseResponse | Course[];
  isBounded?: boolean;
  showLegend?: boolean;
}): JSX.Element {
  // D3 ref
  const d3Graph = useRef(null);

  const [d3Simulation, setD3Simulation] = useState<d3.Simulation<d3.SimulationNodeDatum, undefined>>(
    {} as d3.Simulation<d3.SimulationNodeDatum, undefined>,
  );

  const [screenWidth, setWidth] = useState(window.innerWidth);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: screenWidth / 2, h: screenWidth / 2 });

  // transform the fetched course data to the D3 format
  const transformCourseData = (courseData: CourseResponse | Course[]): d3Obj => {
    const nodes: Array<D3Node> = [];
    const links: Array<D3Link> = [];
    const fileName = JSON.stringify(subjectAreas);
    const groupMap = new Map<string, { id: number; name: string }>(Object.entries(JSON.parse(fileName)));
    const newMap = new Map();
    let courseArray = null;

    if ('data' in courseData) {
      courseArray = courseData.data;
    } else if (courseData.length > 0) {
      courseArray = courseData;
    }
    if (courseArray) {
      courseArray.forEach(course => {
        if (!newMap.has(course.coursecode)) {
          const temp = course.subjectarea;
          const testNode: D3Node = { id: course.coursecode, group: groupMap.get(temp)!.id };
          nodes.push(testNode);
          newMap.set(course.coursecode, true);
        }
      });

      courseArray.forEach(course => {
        const prereqs = course.prerequisites;
        if (prereqs) {
          prereqs.courseCodes?.forEach(index => {
            if (newMap.has(index)) {
              const testLink: D3Link = { source: course.coursecode, target: index, value: 1 };
              links.push(testLink);
            }
          });
        }
      });
    }
    return { nodes, links };
  };

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const drag = (simulation: any) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  };

  const chart = () => {
    const { nodes, links } = transformCourseData(data);

    const simulation = d3
      .forceSimulation(nodes as SimulationNodeDatum[])
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.id),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2));

    const svg = d3.select(d3Graph.current).attr('width', WIDTH).attr('height', HEIGHT);

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', RADIUS)
      .attr('fill', (d: D3Node) => {
        return color(d.group.toString());
      })
      .attr('id', (d: D3Node) => d.id.replace('*', ''))
      .call(drag(simulation) as any);

    const labelsContainer = svg.append('g').attr('id', 'labelsContainer');
    nodes.forEach(node => {
      labelsContainer
        .append('text')
        .text(node.id)
        .attr('id', `text_${node.id.replace('*', '')}`)
        .attr('className', 'text');
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      if (isBounded) {
        // update the nodes position but also to be within the window view
        node
          .attr('cx', (d: any) => Math.max(RADIUS, Math.min(WIDTH - RADIUS, d.x)))
          .attr('cy', (d: any) => Math.max(RADIUS, Math.min(HEIGHT - RADIUS, d.y)));
      } else {
        // update the nodes position but unbounded
        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      }

      // update labels position
      const labels = document.getElementsByTagName('text');
      [...labels]
        .filter(l => !l.id.includes('LEGEND_'))
        .forEach(_label => {
          const node = d3.select(`#${_label.innerHTML.replace('*', '')}`);
          const label = d3.select(`#text_${_label.innerHTML.replace('*', '')}`);
          label.attr('x', Number(node.attr('cx')) + 8);
          label.attr('y', Number(node.attr('cy')) + 5);
        });
    });

    setD3Simulation(simulation);
  };

  const restartGraph = () => {
    if (Object.keys(d3Simulation).length !== 0) {
      d3.select(d3Graph.current).html('');
    }
  };

  const onMouseDown = function (e: MouseEvent) {
    if (e.button === 0 && e.ctrlKey) {
      isPanning = true;
      startPoint = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseMove = function (e: MouseEvent) {
    if (isPanning) {
      endPoint = { x: e.clientX, y: e.clientY };
      const dx = (startPoint.x - endPoint.x) / scale;
      const dy = (startPoint.y - endPoint.y) / scale;
      setViewBox({ x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h });
    }
  };

  const onMouseUp = function (e: MouseEvent) {
    if (isPanning) {
      isPanning = false;
      endPoint = { x: e.clientX, y: e.clientY };
      const dx = (startPoint.x - endPoint.x) / scale;
      const dy = (startPoint.y - endPoint.y) / scale;
      setViewBox({ x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h });
    }
  };

  function zoomIn() {
    const w = viewBox.w;
    const h = viewBox.h;
    const mx = screenWidth / 4; // mouse x
    const my = screenWidth / 4;
    const dw = w * Math.sign(1) * 0.2;
    const dh = h * Math.sign(1) * 0.2;
    const dx = (dw * mx) / (screenWidth / 2);
    const dy = (dh * my) / (screenWidth / 2);
    scale *= 0.8;
    setViewBox({ x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w - dw, h: viewBox.h - dh });
  }

  function zoomOut() {
    const w = viewBox.w;
    const h = viewBox.h;
    const mx = screenWidth / 4; // mouse x
    const my = screenWidth / 4;
    const dw = w * Math.sign(-1) * 0.2;
    const dh = h * Math.sign(-1) * 0.2;
    const dx = (dw * mx) / (screenWidth / 2);
    const dy = (dh * my) / (screenWidth / 2);
    scale *= 1.2;
    setViewBox({ x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w - dw, h: viewBox.h - dh });
  }

  useEffect(() => {
    restartGraph();
    chart();
  }, [data, d3Graph.current]);

  const renderLegend = () => {
    const graphData = transformCourseData(data);

    const uniqueCourses: any[] = [];
    graphData.nodes.forEach(course => {
      // if course group is not already in unique array
      if (!uniqueCourses.some(c => c?.group === course.group)) {
        uniqueCourses.push(course);
      }
    });

    const subjectMap: any = subjectAreas;

    return (
      <svg height={uniqueCourses.length * 20} width="100%" className="w-100 node_legend">
        {uniqueCourses.map((c, i) => (
          <g key={c.group}>
            <circle
              fill={color(c.group.toString())}
              cx={10}
              cy={i * 15 + 10}
              r={5}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
            <text id={`LEGEND_${i}`} x={20} y={i * 15 + 15}>
              {subjectMap[c.id.split('*')[0]].name}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="d-flex">
      <div className="d-flex">
        <div style={{ width: '20%', float: 'right' }}>
          <Button style={{ width: '30px' }} type="primary" onClick={zoomIn}>
            +
          </Button>
          <Button style={{ width: '30px' }} type="primary" onClick={zoomOut}>
            -
          </Button>
        </div>
        <svg
          id="d3ExportContainer"
          style={{ float: 'left' }}
          width={WIDTH - 50}
          height={HEIGHT - 50}
          ref={d3Graph}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          viewBox={`${viewBox.x}, ${viewBox.y},${viewBox.w},${viewBox.h}`}
        />
      </div>
      {showLegend && (
        <div className="d-flex">
          Node Legend:
          <div className="">{renderLegend()}</div>
        </div>
      )}
    </div>
  );
}
