// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract JIRA  {

    struct Ticket {
        uint index;
        string id;
        string abiLink;
        address repoter;
        string owner;
    }
    
    struct User {
        string name;
        string role;
        string boardData;
        string abiLink;
        address userAddress;
    }
     
    mapping(address => User) public users;

    Ticket[] public tickets;
    address[] public userList ;

    function addUser(string memory name , string memory role) public virtual {
        User memory newUser = User({
           name: name,
           role:role,
           boardData:"",
           abiLink:"",
           userAddress:msg.sender
        });
        users[msg.sender] = newUser;
        userList.push(msg.sender);
    }

    function getAllUser() public view returns(address[] memory){
        return userList;
    }

    function setUserAbi(string memory abiLink, address userAddress) public {
         User storage userData = users[userAddress];
         userData.abiLink = abiLink;
    }

    function setBoardDataToUser(string memory abiLink, address userAddress) public {
         User storage userData = users[userAddress];
         userData.boardData = abiLink;
    }


    function createTicket(string memory id, string memory abiLink, string memory owner) public  {
        Ticket memory newTicket = Ticket({
           index:tickets.length,
           id:id,
           abiLink: abiLink,
           repoter:msg.sender,
           owner:owner
        });
        tickets.push(newTicket);
    }
    
    function updateTicket(string memory abiLink, uint index) public  {
         Ticket storage newTicket = tickets[index];
         newTicket.abiLink = abiLink;
    }

    function getAllTickets() public view returns (Ticket[] memory) {
        return tickets;
    }

    function transferTicket(address sender, address receiver, string memory updatedSenderAbi, string memory updatedReceiverAbi) public {
        setBoardDataToUser(updatedSenderAbi, sender);
        setBoardDataToUser(updatedReceiverAbi, receiver);
    }
    
  
}