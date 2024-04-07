import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import group from '../group.jpg';
import pool from '../pool-ether.jpg';
import expense from '../expense.jpeg';
import disburse from '../disburse.png';
import brand from '../brand.jpg';
import metamask from '../metamask.png';

const Home = (props)=>{
  return(
    <div>
      <div className="jumbotron text-center">
        <dl>
          <dt className="display-1 font-weight-bold">SPLIT-PARTY</dt>
          <dd>
          <h4 className="font-weight-bold">A DAPP BUILT UPON ETHEREUM BLOCKCHAIN</h4></dd>
        </dl>
      </div>

      <div className="jumbotron card-deck">

      <div className="card bg-light">
      <img className="card-img-top text-center" src={group} alt="user" ></img>
        <div className="card-body">
          <h4 className="card-title font-weight-bold"><a className="stretched-link" href='groups'>CREATE YOUR PARTY GROUP</a></h4>
          <p className="card-text">Create your own group for your party with just few clicks</p>
        </div>
      </div>

      <div className="card bg-light">
      <img className="card-img-top text-center" src={pool} alt="user" ></img>
        <div className="card-body">
          <h4 className="card-title font-weight-bold"><a className="stretched-link" href='groups'>JOIN AND POOL ETHER WITH YOUR FRIENDS</a></h4>
          <p className="card-text">Join your friend party-groups and pool your ethers securely in a trustless way without giving anyone of your group burden to handle pooled money</p>
        </div>
      </div>

      <div className="card bg-light">
      <img className="card-img-top text-center" src={expense} alt="user" ></img>
        <div className="card-body">
          <h4 className="card-title font-weight-bold"><a className="stretched-link" href='groups'>SPEND WITH ALL THE GROUP MEMBERS CONSENT</a></h4>
          <p className="card-text">Add expenses of your party,and the transaction is made when only all the group members verify the expense </p>
        </div>
      </div>
    </div>
    <div className="jumbotron card-deck">

      <div className="card bg-light">
      <img className="card-img-top text-center" src={disburse} alt="user" ></img>
        <div className="card-body">
          <h4 className="card-title font-weight-bold"><a className="stretched-link" href='groups'>DISBURSE THE REMAINING THE POOL BALANCE AFTER THE PARTY</a></h4>
          <p className="card-text">Anyone can request disbursement of money after a specified date and money will get automatically distributed among all the group members equally</p>
        </div>
      </div>

      <div className="card bg-light">
      <img className="card-img-top text-center" src={brand} alt="user" ></img>
        <div className="card-body">
          <h4 className="card-title font-weight-bold"><a className="stretched-link" href='groups'>BUILT UPON ETHEREUM BLOCKCHAIN</a></h4>
          <p className="card-text">The data i.e. expenses, group Info, etc will be stored in an immutable distributed ledger with the help of Blockchain technology. Smart Contacts provides us autonomous process of disbursement, handling pooled money</p>
        </div>
      </div>

      <div className="card bg-light">
      <img className="card-img-top text-center" src={metamask} alt="user" ></img>
        <div className="card-body">
          <h4 className="card-title font-weight-bold"><a className="stretched-link" href='https://metamask.io/'>VERIFY ALL THE TRANSACTIONS WITH YOUR PRIVATE KEY</a></h4>
          <p className="card-text">Install Metamask Chrome extension to sign transaction and to be able to use this app</p>
        </div>
      </div>

      </div>
      <br></br>
      <br></br>
      <div className="jumbotron">
        <h4 className="font-weight-bold text-center">DEVELOPED BY <a href="https://github.com/prakashujjwal1010">PRAKASHUJJWAL1010</a></h4>
      </div>
    </div>
  )
}

export default Home;
