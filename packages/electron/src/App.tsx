/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './App.css';

import * as d3 from 'd3';
import { sideBarItems } from './types';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainWindow from './components/MainWindow';

class App extends Component<unknown, { selected: sideBarItems }> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      selected: 'overview',
    };

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(sidebarItem: sideBarItems): void {
    this.setState({ selected: sidebarItem });
  }

  render(): React.ReactNode {
    return (
      <div>
        <Header />
        <div className="ml-3 h-100 mr-5">
          <div className="row h-100">
            <Sidebar selected={this.state.selected} onSelect={this.onSelect} />
            <MainWindow selected={this.state.selected} onSelect={this.onSelect} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
