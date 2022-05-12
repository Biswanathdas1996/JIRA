// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract JIRA  {

    struct Sprint {
        uint id;
        string name;
        string startDate;
        string enddate;
        string abiLink;
    }

    struct TicketTracker {
        string time;
        string status;
    }

    struct Ticket {
        uint index;
        string sprintId;
        string id;
        string abiLink;
        string repoter;
        string owner;
        string position;
        bool status;
        string tracking;
        string comments;
    }
    
    struct User {
        string name;
        string role;
        string boardData;
        string profileImg;
        string abiLink;
        string uid;
    }
     
    mapping(string => User) public users;
    Sprint[] public sprints;
    Ticket[] public tickets;
    string[] public userList ;
    address public manager;
    string public project;
    string public confluence;
    uint public activeSprintId;

    constructor(string memory projectName)  {
        manager = msg.sender;
        project = projectName;
        activeSprintId = 0;
    }  

    function createSprint(string memory name, string memory startDate, string memory enddate, string memory abiLink) public  {
        Sprint memory newSprint = Sprint({
           id:sprints.length,
           name:name,
           startDate:startDate,
           enddate:enddate,
           abiLink: abiLink
        });
        sprints.push(newSprint);
    }

    function addConfluence(string memory abiLink) public  {
        confluence = abiLink;
    }


    function activeNewSprint(uint id, string memory time) public  {
        activeSprintId = id;
        Sprint storage sprintData = sprints[id];
        sprintData.startDate = time;
    }

    

    function getAllSprints() public view returns (Sprint[] memory) {
        return sprints;
    }

    function login(string memory uid) public view returns(bool){
       bytes memory tempEmptyStringTest = bytes(users[uid].name);
        if(tempEmptyStringTest.length == 0){
            return false;
        }else{
            return true;
        }
    }

    function addUser(string memory uid, string memory name , string memory role ,string memory image,  string memory initialBoardData) public virtual {
        User memory newUser = User({
           name: name,
           role:role,
           boardData: initialBoardData,
           profileImg:image,
           abiLink:"",
           uid:uid
        });
        users[uid] = newUser;
        userList.push(uid);
    }

    function getAllUser() public view returns(string[] memory){
        return userList;
    }

    function setUserAbi(string memory abiLink, string memory uid) public {
         User storage userData = users[uid];
         userData.abiLink = abiLink;
    }

    function setBoardDataToUser(string memory abiLink, string memory uid) public {
         User storage userData = users[uid];
         userData.boardData = abiLink;
    }


    function createTicket(
            string memory sprintId, 
            string memory id, 
            string memory abiLink,  
            string memory repoterUid, 
            string memory tracking
        ) public returns(Ticket memory) {
           

        Ticket memory newTicket = Ticket({
           index:tickets.length,
           sprintId:sprintId,
           id:id,
           abiLink: abiLink,
           repoter:repoterUid,
           owner:'',
           position:"1",
           status:true,
           tracking:tracking,
           comments:""
        });
        tickets.push(newTicket);
        return newTicket;
    }

    

    // add comments to a ticket
    function setComments(string memory commentdata, uint index, string memory tracking) public  {
        Ticket storage newTicket = tickets[index];
        newTicket.comments = commentdata;
        newTicket.tracking = tracking;
    }

    // add tracking to a ticket
    function setTicketTracking(string memory abiLink, uint index) public  {
        Ticket storage newTicket = tickets[index];
        newTicket.tracking = abiLink;
    }

    // add sprint to a ticket
    function setSprintToTicket(string memory sprintId, uint index, string memory tracking) public  {
        Ticket storage newTicket = tickets[index];
        newTicket.sprintId = sprintId;
         newTicket.tracking = tracking;
    }
    
    // change position in the board
    function changePosition(string memory position, uint index, string memory abiLink, string memory uid, string memory trackingData) public  {
        Ticket storage newTicket = tickets[index];
        newTicket.position = position;
        newTicket.tracking = trackingData;
        setBoardDataToUser(abiLink,uid);
    }

    // assign a owner to a ticket for the first time
    function assignOwner(string memory owner, uint index, string memory ownersBoardData, string memory tracking) public  {
         Ticket storage newTicket = tickets[index];
         newTicket.owner = owner;
         newTicket.position = "1";
         newTicket.tracking = tracking;
         setBoardDataToUser(ownersBoardData, owner);
    }




    function updateTicket(string memory abiLink, uint index, string memory trackingData, bool status) public  {
         Ticket storage newTicket = tickets[index];
         newTicket.abiLink = abiLink;
         newTicket.tracking = trackingData;
         newTicket.status = status;
    }

    function getAllTickets() public view returns (Ticket[] memory) {
        return tickets;
    }

    function getTicketsAbi(uint index) public view returns(string memory){
        Ticket storage newTicket = tickets[index];
         return newTicket.abiLink;
    }

    function getTicketsOwnerImg(uint index) public view returns(string memory){
        Ticket storage newTicket = tickets[index];
         return users[newTicket.owner].profileImg;
    }

    function transferTicket(
        string memory senderUid, 
        string memory receiverUid, 
        string memory updatedSenderAbi, 
        string memory updatedReceiverAbi, 
        uint index, 
        string memory trackingData
        ) public {
        setBoardDataToUser(updatedSenderAbi, senderUid);
        setBoardDataToUser(updatedReceiverAbi, receiverUid);
        updateTicketOwner(receiverUid,index);

        Ticket storage newTicket = tickets[index];
        newTicket.tracking = trackingData;

    }

    function updateTicketOwner(string memory newOwnerUid, uint index) public  {
         Ticket storage newTicket = tickets[index];
         newTicket.owner = newOwnerUid;
    }
    
    
  
}



