import React from 'react';

const Layout = (props) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand text-info ">
            <b>Konverrency</b>
          </span>
        </div>
      </nav>
      <div className="container py-3">{props.children}</div>
    </React.Fragment>
  );
};

export default Layout;
