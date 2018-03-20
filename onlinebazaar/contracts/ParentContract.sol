pragma solidity ^0.4.18;

contract ParentContract{
  //state variable
  address owner;

  //modifiers

  modifier onlyOwner(){
    require(msg.sender == owner);
    _;// it's placeholder that represents the code of the function that the modifier is applied to
  }

  function ParentContract() public{
    owner = msg.sender;
  }
}
