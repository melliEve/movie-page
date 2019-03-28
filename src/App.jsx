import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Movies from './components/Movies';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <header>
          <NavBar />
        </header>
        <main className="container">
          <Movies />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
