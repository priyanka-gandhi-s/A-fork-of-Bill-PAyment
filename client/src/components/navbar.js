import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import brand from '../brand.jpg';

const brandStyle={
  'width':'40px',
  'height':'40px'
}

const Navbar=(props)=>{
  return(
    <div className="container">
      <nav className="navbar navbar-expand-sm bg-danger navbar-light fixed-top">
        <img className="navbar-brand" src={brand} alt="brand" style={brandStyle}></img>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id ="collapsibleNavbar">
          <ul className="navbar-nav">

            <li className="nav-item">
            <a className="nav-link font-weight-bold" href='home'>HOME</a>
            </li>

            <li className="nav-item">
            <a className="nav-link font-weight-bold" href='groups'>GROUPS</a>
            </li>

            <li className="nav-item">
            <a className="nav-link font-weight-bold" href='user'>USER</a>
            </li>

            </ul>
        </div>

      </nav>
      </div>
  )
}
export default Navbar;
