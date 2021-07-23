import * as d3 from 'd3';
import React from 'react';

import { D3Link } from '../../types';

export default class Link extends React.Component<{ link: D3Link }, unknown> {
  ref!: SVGLineElement;

  componentDidMount(): void {
    const { link } = this.props;
    d3.select(this.ref).data([link]);
  }

  render(): React.ReactNode {
    const { link } = this.props;
    return (
      <line
        className="link"
        ref={(ref: SVGLineElement) => {
          this.ref = ref;
        }}
        strokeWidth={Math.sqrt(link.value)}
      />
    );
  }
}
