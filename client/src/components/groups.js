import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import getWeb3 from "../utils/getWeb3";
import groupsContract from "../contracts/groupsContract.json";
const truffleContract = require('truffle-contract');

const scrollContainer = {
  'overflowY':'auto',
  'height' : '500px'
}

class Groups extends Component {

  constructor(){
    super();
    this.state = {
      web3: null,
      account: null,
      contract: null,
      balance : null,
      grpName:null,
      venue: null,
      date: null,
      disburseDate : 1,
      entryFee : 1,
      grpId : null,
      groups: [],
      selectedGrp : null,
      grpIsSelectedOrNot : false,
      grpInfo : {
        name:null,
        id:null,
        venue:null,
        date:null,
        noOfMembers:null,
        fee:null,
        poolBalance:null,
        disburseDate:null,
      },
      expName : null,
      expTo : null,
      expCost : null,
      expHash : "okay",
      allAddExpEvents : [],
      unverifiedExpenses : []

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.yourGroups = this.yourGroups.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
    this.renderSelectedGrp = this.renderSelectedGrp.bind(this);
    this.addExpense = this.addExpense.bind(this);
    this.showAllExpenses = this.showAllExpenses.bind(this);
    this.verifyExpense = this.verifyExpense.bind(this);
    this.showGroupInfo = this.showGroupInfo.bind(this);
    this.disburse = this.disburse.bind(this);

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
      console.log(contract);
      console.log(account);

      this.setState({
        web3,
        account,
        contract,
        balance
      });

    } catch (e) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(e);
    }
  }

  handleChange (event) {

      const name = event.target.name;
      let value = event.target.value;

      if(name == 'disburseDate' || name == 'date'){
          value = new Date(value)/1000;
      }
      this.setState({
          [name] : value
      });
  }

  handleSubmit (event){
    event.preventDefault();

    const contractInstance = this.state.contract;
    contractInstance.createGroup(this.state.disburseDate,
      this.state.entryFee,
      this.state.grpName,
      this.state.venue,
      this.state.date,
      {from : this.state.account})
      .then(async (result) => {
        console.log(result.tx);
        let totalGrps= await contractInstance.totalGroups.call();
        let grpId = totalGrps.toNumber() - 1;
        console.log(grpId);
        alert('The group ID of the newly created group is: '+ grpId);
        this.setState({
          grpId
        })
      })
      .catch(err => {
        console.log(err);
      })

  }

   async handleSubmit1 (event){
    event.preventDefault();

    const contractInstance = this.state.contract;
    const grp = await contractInstance.groups.call(this.state.grpId);
    contractInstance.joinGroup(this.state.grpId,{from : this.state.account, value : grp.fee.toNumber()})
      .then(async (result) => {
        const belongsToGrpOrNot = await contractInstance.belongsToOrNot.call(this.state.account,this.state.grpId);
        console.log(result.tx);
        console.log(belongsToGrpOrNot);
        this.yourGroups();
      })
      .catch(err => {
        console.log(err);
      });
      if(this.state.grpIsSelectedOrNot){
        this.showGroupInfo();
      };
  }

  async yourGroups (){
    const contractInstance = this.state.contract;
    var groups=[];
    const noOfGroups = await contractInstance.getNoOfTotalGroupsOf.call(this.state.account);
    for(let i=0; i<noOfGroups.toNumber(); i++){
      const grpId = await contractInstance.belongsTo.call(this.state.account,i);
      console.log(grpId.toNumber());
      groups = [...groups,grpId.toNumber()];
    }
    this.setState({
      groups : [...groups]
    });

  }

  selectGroup (selectedGrp){
    this.setState({
      selectedGrp: selectedGrp,
      grpIsSelectedOrNot : true
    },function(){
      this.showGroupInfo();
    });
  }

  async showGroupInfo() {
    const contractInstance = this.state.contract;
    const group = await contractInstance.getPastEvents('CreateGroup',{ filter: {grpId: this.state.selectedGrp }, fromBlock: 0, toBlock: 'latest'});
    let grpInfo = await contractInstance.groups.call(this.state.selectedGrp);
    let pd = new Date(0);
    let dd = new Date(0);
    pd.setUTCSeconds(group[0].returnValues.date);
    dd.setUTCSeconds(group[0].returnValues.disburseDate);

    this.setState({
      grpInfo : {
        name: group[0].returnValues.name,
        id: group[0].returnValues.grpId,
        venue: group[0].returnValues.venue,
        date: pd,
        noOfMembers: grpInfo.noOfMembers.toNumber(),
        fee: group[0].returnValues.fee,
        poolBalance: grpInfo.poolBalance.toNumber(),
        disburseDate: dd,
      }
    });
    this.showAllExpenses(this.state.selectedGrp);
  }

  async addExpense (event){
    event.preventDefault();
    const contractInstance = this.state.contract;;
    contractInstance.addExpense(this.state.expName, this.state.selectedGrp, this.state.expTo, this.state.expCost, this.state.expHash,
    {
      from : this.state.account
    })
      .then(async (result) => {
        console.log(result);
        console.log(result.logs[0].args.expId.toNumber());
        alert('the expense ID of your added exoense is: '+result.logs[0].args.expId.toNumber());
        this.showAllExpenses(this.state.selectedGrp);

      })
  }

  async verifyExpense (expId, grpId){
    const contractInstance = this.state.contract;

    const result = await contractInstance.verifyExpense(
      expId
      ,grpId
      ,{from : this.state.account}
    );
    console.log(result.logs[0].args.verifier);
    this.showAllExpenses(this.state.selectedGrp);
    this.showGroupInfo();
  }

  async showAllExpenses (selectedGrp){
    const contractInstance = this.state.contract;
    const events = await contractInstance.getPastEvents('AddExpense',{ filter: {grpId: selectedGrp}, fromBlock: 0, toBlock: 'latest'})
    console.log(events);
    let allAddExpEvents =[];
    let unverifiedExpenses =[];
    events.map((item,index) => {
      allAddExpEvents = [...allAddExpEvents,item.returnValues]
    });

    for(let i=0; i<allAddExpEvents.length; i++){
      const toSignOrNot = await contractInstance.toSignOrNot.call(this.state.account,allAddExpEvents[i].expId);
      if(toSignOrNot){
        unverifiedExpenses.push(allAddExpEvents[i]);
      }
    }
    this.setState({
      allAddExpEvents : [...allAddExpEvents],
      unverifiedExpenses : [...unverifiedExpenses]
    })
  }

  async disburse (){
    const contractInstance = this.state.contract;
    const result = await contractInstance.disburse(this.state.selectedGrp,{from: this.state.account})
    console.log(result.logs);
    alert('The remaining balance of group of Id '+ this.state.selectedGrp+' has been disbursed to all the group members');
    this.showGroupInfo();
  }

  renderSelectedGrp (){
    if(this.state.grpIsSelectedOrNot){

      return(
        <div className="container">
          <h3 className="font-weight-bold"> YOUR GROUP</h3>
          <div className="jumbotron jumbotron-fluid card-deck">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Add Expense</h4>
                <div className="card-text">
                  <form onSubmit = {this.addExpense}>

                    <div className="form-group">
                      <label>Your Expense Name:</label>
                      <input type="text" name="expName" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <div className="form-group">
                      <label>To Address:</label>
                      <input type="text" name="expTo" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <div className="form-group">
                      <label>Cost of Expense(Wei):</label>
                      <input type="number" name="expCost" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <button type="submit" className="btn btn-block btn-primary">ADD</button>
                  </form>
                </div>
            </div>
          </div>

          <div className="card" >
            <div className="card-body">
              <h4 className="card-title">Group Info</h4>
                <div className="card-text" >
                  <div>Group Name: {this.state.grpInfo.name}</div>
                  <div>Group Id: {this.state.grpInfo.id}</div>
                  <div>Group Venue: {this.state.grpInfo.venue}</div>
                  <div>Date And Time: {JSON.stringify(this.state.grpInfo.date)}</div>
                  <div>No Of Members: {this.state.grpInfo.noOfMembers}</div>
                  <div>Entry-Fee: {this.state.grpInfo.fee}</div>
                  <div>Group Balance: {this.state.grpInfo.poolBalance}</div>
                  <div>Disburse Date: {JSON.stringify(this.state.grpInfo.disburseDate)}</div>
                  <button className="btn btn-block btn-primary" onClick={this.disburse}>REQUEST FOR DISBURSEMENT</button>
                </div>
            </div>

          </div>
          </div>
          <div className="jumbotron jumbotron-fluid card-deck">

          <div className="card" >
            <div className="card-body">
              <h4 className="card-title">All Expenses Of Your Group</h4>
                <div className="card-text" style = {scrollContainer}>
                  <ul className="list-group">
                  {
                    this.state.allAddExpEvents.map((item,index) => {
                      return(
                        <li key={index} className="list-group-item list-group-item-primary">
                          <div>Expense name: {item.name}</div>
                          <div>Expense Id: {item.expId}</div>
                          <div>Expense cost: {item.cost}</div>
                          <div>To address: {item.to}</div>
                          <div>Of group: {item.grpId}</div>
                        </li>
                      )
                    })
                  }
                  </ul>
                </div>
            </div>
          </div>

          <div className="card" >
            <div className="card-body">
              <h4 className="card-title">Expenses To Be Verified</h4>
                <div className="card-text" style = {scrollContainer}>
                  <ul className="list-group">
                  {
                    this.state.unverifiedExpenses.map((item,index) => {
                      return(
                        <li key={index} className="list-group-item list-group-item-primary">
                          <div>Expense name: {item.name}</div>
                          <div>Expense Id: {item.expId}</div>
                          <div>Expense cost: {item.cost}</div>
                          <div>To address: {item.to}</div>
                          <div>Of group: {item.grpId}</div>
                          <button className="btn btn-block btn-primary" onClick={()=>{this.verifyExpense(item.expId, item.grpId)}}>VERIFY</button>
                        </li>
                      )
                    })
                  }
                  </ul>
                </div>
            </div>
          </div>
          </div>
        </div>
      )
    }
  }

  render(){

    return(
      <div className ="container">
        <div className="card-deck jumbotron jumbotron-fluid">

          <div className="card" >
            <div className="card-body">
              <h4 className="card-title">Create Party-Group</h4>
                <div className="card-text">
                  <form onSubmit = {this.handleSubmit}>

                    <div className="form-group">
                      <label>Your Party-group Name:</label>
                      <input type="text" name="grpName" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <div className="form-group">
                      <label>Venue for Party:</label>
                      <input type="text" name="venue" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <div className="form-group">
                      <label>Party Date And Time:</label>
                      <input type="datetime-local" name="date" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <div className="form-group">
                      <label>Entry Fee(Wei):</label>
                      <input type="number" name="entryFee" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <div className="form-group">
                      <label>Disburse the remaining pool balance of group at:</label>
                      <input type="datetime-local" name="disburseDate" className="form-control" onChange = {this.handleChange}></input>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">Create</button>
                  </form>
                </div>

            </div>
          </div>

          <div className="card" >
            <div className="card-body">
              <h4 className="card-title">Join Party-Group</h4>
              <div className="card-text">
              <form onSubmit = {this.handleSubmit1}>

                <div className="form-group">
                  <label>Enter Party-Group Id you want to join:</label>
                  <input type="number" className="form-control" name="grpId" onChange = {this.handleChange}></input>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Join</button>
              </form>
              <br></br>
              <div className="alert alert-warning">
                YOU HAVE TO PROVIDE ENTRY FEE FOR JOINING A GROUP
              </div>
              <div className="alert alert-warning">
                CHECK THE GROUP ID TWICE BEFORE SUBMITING
              </div>
              </div>
            </div>
          </div>

        </div>

        <div className="jumbotron">

          <div className="dropdown">
            <button type="button" onClick={this.yourGroups} className="btn btn-block btn-primary dropdown-toggle" data-toggle="dropdown">
              YOUR GROUPS
            </button>

            <div className="dropdown-menu dropdown-menu-right">

              {
                this.state.groups.map((item, i) =>
                  <button className="dropdown-item" onClick={() => { this.selectGroup(item)}} key={i}>{item}</button>
                )
              }

            </div>
          </div>

        </div>

        <div className="container">

            {this.renderSelectedGrp()}

        </div>


      </div>
    )
  }
}

export default Groups;
