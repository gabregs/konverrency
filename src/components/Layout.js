import React from 'react';
import '../App.css';

const Layout = (props) => {
  return (
    <React.Fragment>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <span className="navbar-brand text-info">
              <b>Konverrency</b>
            </span>
          </div>
        </nav>
      </header>

      <div className="container py-3">{props.children}</div>

      <footer>
        <div className="text-center">
          <p>
            Created by {` `}
            <a href="https://github.com/paoregz">
              <i class="fab fa-github text-dark"></i>
            </a>
            {` `} paoregs
          </p>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Layout;
