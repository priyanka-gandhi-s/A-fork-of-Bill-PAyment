pragma solidity ^0.5.0;

contract groupsContract {

  uint public totalGroups = 0;
  uint public totalExpenses = 0;

  struct Group{
    uint id;
    uint noOfMembers;
    uint disburseDate;
    uint fee;
    uint poolBalance;
    address payable[] members;
  }

  struct UnverifiedExpense{
    uint id;
    address payable to;
    uint cost;
  //  address[] verifiedBy;
    uint totalSigns;
    string expHash;
  }

  Group[] public groups;
  UnverifiedExpense[] public unverifiedExpenses;

  mapping(address => mapping(uint  => bool)) public belongsToOrNot;
  mapping(address => uint[]) public belongsTo;
  mapping(address => mapping(uint => bool)) public toSignOrNot;

  event CreateGroup(string name, uint indexed grpId, string venue,uint date, uint fee, uint disburseDate);
  event AddExpense(string name, uint indexed expId, uint indexed grpId, uint cost, address indexed to);
  event VerifiedExp(address indexed verifier, uint indexed expId, uint indexed grpId);

  function getNoOfTotalGroupsOf(address user) view public returns(uint){
    return belongsTo[user].length;
  }

  function createGroup( uint _disburseDate, uint _fee, string memory _name, string memory _venue, uint _date) public returns(uint){
    Group memory newGroup;

    newGroup.id = totalGroups;
    newGroup.disburseDate = _disburseDate;
    newGroup.fee = _fee;
    newGroup.poolBalance = 0;

    emit CreateGroup(_name,totalGroups,_venue,_date,_fee,_disburseDate);

    totalGroups++;
    groups.push(newGroup);
  }

  function joinGroup(uint _grpId) public payable {
    require(totalGroups >= _grpId && 0 <= _grpId);
    require(msg.value == groups[_grpId].fee);
    require(belongsToOrNot[msg.sender][_grpId]==false);

    groups[_grpId].members.push(msg.sender);
    groups[_grpId].noOfMembers++;
    groups[_grpId].poolBalance += msg.value;
    belongsToOrNot[msg.sender][_grpId] = true;
    belongsTo[msg.sender].push(_grpId);

  }

  function addExpense(string memory _name, uint _grpId, address payable _to, uint _cost, string memory _exphash) public {
      require(groups[_grpId].poolBalance >= _cost);

      UnverifiedExpense memory newUnverifiedExp;

      newUnverifiedExp.id = totalExpenses;
      newUnverifiedExp.cost = _cost;
      newUnverifiedExp.to = _to;
      newUnverifiedExp.expHash = _exphash;
      newUnverifiedExp.totalSigns = 0;


      for(uint i=0; i<groups[_grpId].noOfMembers ;i++){
          toSignOrNot[groups[_grpId].members[i]][totalExpenses] = true;
      }

      totalExpenses++;

      unverifiedExpenses.push(newUnverifiedExp);

      emit AddExpense(_name, newUnverifiedExp.id, _grpId, _cost, _to);
  }

  function verifyExpense(uint _expId, uint _grpId) public payable{
      if(unverifiedExpenses[_expId].totalSigns >= groups[_grpId].noOfMembers){
          revert();
      }
      else if(unverifiedExpenses[_expId].totalSigns == groups[_grpId].noOfMembers-1){

          unverifiedExpenses[_expId].totalSigns++;

          unverifiedExpenses[_expId].to.transfer(unverifiedExpenses[_expId].cost);

          groups[_grpId].poolBalance -= unverifiedExpenses[_expId].cost;


          delete unverifiedExpenses[_expId];

      }
      else{
          unverifiedExpenses[_expId].totalSigns++;
      }

      toSignOrNot[msg.sender][_expId] = false;


      emit VerifiedExp(msg.sender, _expId, _grpId);
  }

   function disburse(uint _grpId) public payable{
       require(now > groups[_grpId].disburseDate );
       uint dividedBal = groups[_grpId].poolBalance/groups[_grpId].noOfMembers;
       for(uint i=0;i<groups[_grpId].noOfMembers;i++){
           groups[_grpId].members[i].transfer(dividedBal);
       }
       groups[_grpId].poolBalance = 0;

   }

}
