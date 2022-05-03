// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract JIRA  {

    struct Ticket {
        string id;
        string abiLink;
        address repoter;
        string owner;
    }
    
    struct User {
        string name;
        string role;
        string boardData;
    }
     
    mapping(address => User) public users;

    Ticket[] public tickets;
    address[] public userList ;

    function addUser(string memory name , string memory role) public virtual {
        User memory newUser = User({
           name: name,
           role:role,
           boardData:""
        });
        users[msg.sender] = newUser;
        userList.push(msg.sender);
    }

    function getAllUser() public view returns(address[] memory){
        return userList;
    }

    function setBoardDataToUser(string memory abiLink, address userAddress) public {
         User storage userData = users[userAddress];
         userData.boardData = abiLink;
    }


    function createTicket(string memory id, string memory abiLink, string memory owner) public  {
        Ticket memory newTicket = Ticket({
           id:id,
           abiLink: abiLink,
           repoter:msg.sender,
           owner:owner
        });
        tickets.push(newTicket);
    }

    function getAllTickets() public view returns (Ticket[] memory) {
        return tickets;
    }

    
    
  
}