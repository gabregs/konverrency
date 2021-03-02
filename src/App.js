import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact render={() => <h1>Konverrency</h1>} />
        <Route render={() => <h1>404 Not found</h1>} />
      </Switch>
    </Router>
  );
};

export default App;
