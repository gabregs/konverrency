import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';

import './App.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route render={() => <h1>404 Not found</h1>} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
