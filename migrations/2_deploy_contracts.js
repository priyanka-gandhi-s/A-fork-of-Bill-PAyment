var groupsContract = artifacts.require("./groupsContract.sol");

module.exports = function(deployer) {
  deployer.deploy(groupsContract);
};
