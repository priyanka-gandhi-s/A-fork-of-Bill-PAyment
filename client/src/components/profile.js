import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import getWeb3 from "../utils/getWeb3";
import groupsContract from "../contracts/groupsContract.json";
import user from '../user.png';
const truffleContract = require('truffle-contract');

const scrollContainer = {
  'overflowY':'auto',
  'height' : '600px'
}
class Profile extends Component {

  constructor() {
    super();
    this.state = {
      web3: null,
      account: null,
      contract: null,
      balance : null,
      groups: [],
      noOfGroups:null
    }

  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const weiBalance = await web3.eth.getBalance(account);
      const balance = web3.utils.fromWei(weiBalance).toString();

      const groupsContractInstance = truffleContract(groupsContract);
      groupsContractInstance.setProvider(web3.currentProvider);

      const contract = await groupsContractInstance.deployed();
      console.log(account);

      let groups=[];

      const noOfGroups = await contract.getNoOfTotalGroupsOf.call(account);

      let yourAllGroups = await contract.getPastEvents('CreateGroup',{fromBlock: 0, toBlock: 'latest'});

      console.log(yourAllGroups);
      yourAllGroups.map((item,index) => {
        let value = item.returnValues;
        let group = {
          name:null,
          grpId:null,
          venue:null,
          date:null,
          fee:null
        }

        let pd = new Date(0);
        pd.setUTCSeconds(value.date);

        group.name = value.name;
        group.grpId = value.grpId;
        group.venue = value.venue;
        group.date = JSON.stringify(pd);
        group.fee = value.fee;

        groups.push(group);
      })
      console.log(noOfGroups);


      this.setState({
        web3,
        account,
        contract,
        balance,
        groups : [...groups],
        noOfGroups: noOfGroups.toNumber()
      });


    } catch (e) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(e);
    }
  }

  render() {
    return(
      <div className = "jumbotron card-deck jumbotron-fluid">
      <br></br>
        <div className="card">
        <img className="card-img-top text-center" src={user} alt="user" ></img>
          <div className="card-body">
            <h4 className="card-title font-weight-bold">USER</h4>
              <div className="card-text">
                <div className="font-weight-bold">
                  <dl>
                    <dt>ACCOUNT:</dt>
                    <dd>{this.state.account}</dd>
                  </dl>
                </div>
                <div className="font-weight-bold">
                  <dl>
                    <dt>ACCOUNT BALANCE:</dt>
                    <dd>{this.state.balance} ETH</dd>
                    </dl>
                </div>
                <div className="font-weight-bold">
                  <dl>
                    <dt>TOTAL NO OF GROUPS:</dt>
                    <dd>{this.state.noOfGroups}</dd>
                  </dl>
                </div>
              </div>
          </div>
        </div>

        <div className="card" >
          <div className="card-body">
            <h4 className="card-title font-weight-bold">YOUR GROUPS</h4>
              <div className="card-text" style = {scrollContainer}>
              <ul className="list-group">
                { this.state.groups.map((item,index) =>{
                  return (
                    <li className="list-group-item list-group-item-primary" key={index}>
                      <div className="font-weight-bold">Group Name: {item.name.toString()}</div>
                      <div className="font-weight-bold">Group Id: {item.grpId}</div>
                      <div className="font-weight-bold">Venue: {item.venue}</div>
                      <div className="font-weight-bold">Date And Time: {item.date}</div>
                      <div className="font-weight-bold">Entry Fee: {item.fee}</div>
                      <div className="font-weight-bold"></div>
                    </li>
                  )
                })
                }
              </ul>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
