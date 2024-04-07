import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
//import getWeb3 from "./utils/getWeb3";
import {Route,Switch,Redirect} from "react-router-dom";
import Profile from './components/profile';
import Navbar from './components/navbar';
import Groups from './components/groups';
import Home from './components/home';

import "./App.css";

class App extends Component {

  render() {

    return (
      <div className="container">
      <Navbar />
      <Switch>
        <Route path="/home" component={Home}/>
        <Route path="/user" component={Profile}/>
        <Route path="/groups" component={Groups}/>
        <Redirect to="/home"/>
      </Switch>
      </div>
    );
  }
}

export default App;
