// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract JIRA  {

    struct Ticket {
        uint index;
        string id;
        string abiLink;
        address repoter;
        address owner;
    }
    
    struct User {
        string name;
        string role;
        string boardData;
        string profileImg;
        string abiLink;
        address userAddress;
    }
     
    mapping(address => User) public users;

    Ticket[] public tickets;
    address[] public userList ;

    function addUser(string memory name , string memory role ,string memory image,  string memory initialBoardData) public virtual {
        User memory newUser = User({
           name: name,
           role:role,
           boardData: initialBoardData,
           profileImg:image,
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


    function createTicket(string memory id, string memory abiLink, address owner) public  {
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

    function getTokenAbi(uint index) public view returns(string memory){
        Ticket storage newTicket = tickets[index];
         return newTicket.abiLink;
    }


    function transferTicket(address sender, address receiver, string memory updatedSenderAbi, string memory updatedReceiverAbi, uint index) public {
        setBoardDataToUser(updatedSenderAbi, sender);
        setBoardDataToUser(updatedReceiverAbi, receiver);
        updateTicketOwner(receiver,index);

    }

    function updateTicketOwner(address newOwner, uint index) public  {
         Ticket storage newTicket = tickets[index];
         newTicket.owner = newOwner;
    }
    
    
  
}