// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LandRegistry {
    address public owner;
    uint private landCounter;
    bool private locked; // Reentrancy lock

    struct User {
        string name;
        string email;
        string phone;
        bool isVerified;
    }

    struct Land {
        uint id;
        address owner;
        string location;
        uint price;
        bool forSale;
        bool isVerified;
        bool isAuctioned;
    }

    struct Auction {
        uint landId;
        address highestBidder;
        uint highestBid;
        bool isActive;
    }

    mapping(address => User) public users;
    mapping(uint => Land) public lands;
    mapping(uint => Auction) public auctions;
    mapping(address => bool) public isRegistered;

    event UserRegistered(address user, string name, string email, string phone);
    event UserVerified(address user);
    event LandRegistered(uint id, address owner, string location, uint price);
    event LandVerified(uint id, bool status);
    event LandTransferred(uint id, address newOwner, uint price);
    event LandListedForSale(uint id, uint price);
    event AuctionStarted(uint id, uint startPrice);
    event NewBid(uint id, address bidder, uint bidAmount);
    event AuctionEnded(uint id, address winner, uint winningBid);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyLandOwner(uint _id) {
        require(lands[_id].owner == msg.sender, "Not the land owner");
        _;
    }

    modifier onlyVerifiedUser() {
        require(users[msg.sender].isVerified, "User is not verified");
        _;
    }

    modifier noReentrancy() {
        require(!locked, "Reentrancy detected");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser(string memory _name, string memory _email, string memory _phone) public {
        require(!isRegistered[msg.sender], "User already registered");
        users[msg.sender] = User(_name, _email, _phone, false);
        isRegistered[msg.sender] = true;
        emit UserRegistered(msg.sender, _name, _email, _phone);
    }

    function verifyUser(address _user) public onlyOwner {
        require(isRegistered[_user], "User must be registered first");
        users[_user].isVerified = true;
        emit UserVerified(_user);
    }

    function registerLand(string memory _location, uint _price) public onlyVerifiedUser {
        landCounter++;
        lands[landCounter] = Land(landCounter, msg.sender, _location, _price, false, false, false);
        emit LandRegistered(landCounter, msg.sender, _location, _price);
    }

    function verifyLand(uint _id, bool _status) public onlyOwner {
        require(lands[_id].id != 0, "Land does not exist");
        lands[_id].isVerified = _status;
        emit LandVerified(_id, _status);
    }

    function transferOwnership(uint _id, address _newOwner) public onlyLandOwner(_id) {
        require(users[_newOwner].isVerified, "New owner is not verified");
        lands[_id].owner = _newOwner;
        emit LandTransferred(_id, _newOwner, lands[_id].price);
    }

    function listLandForSale(uint _id, uint _price) public onlyLandOwner(_id) {
        require(lands[_id].isVerified, "Land is not verified");
        lands[_id].price = _price;
        lands[_id].forSale = true;
        emit LandListedForSale(_id, _price);
    }

    function buyLand(uint _id) public payable onlyVerifiedUser noReentrancy {
        require(lands[_id].forSale, "Land is not for sale");
        require(msg.value >= lands[_id].price, "Insufficient payment");

        address previousOwner = lands[_id].owner;
        uint salePrice = lands[_id].price;

        lands[_id].owner = msg.sender;
        lands[_id].forSale = false;

        (bool sent, ) = previousOwner.call{value: salePrice}("");
        require(sent, "Payment failed");

        emit LandTransferred(_id, msg.sender, msg.value);
    }

    function startAuction(uint _id, uint _startPrice) public onlyLandOwner(_id) {
        require(lands[_id].isVerified, "Land is not verified");
        auctions[_id] = Auction(_id, address(0), _startPrice, true);
        lands[_id].isAuctioned = true;
        emit AuctionStarted(_id, _startPrice);
    }

    function placeBid(uint _id) public payable onlyVerifiedUser {
        require(auctions[_id].isActive, "Auction is not active");
        require(msg.value > auctions[_id].highestBid, "Bid must be higher than current highest");

        if (auctions[_id].highestBidder != address(0)) {
            (bool refunded, ) = auctions[_id].highestBidder.call{value: auctions[_id].highestBid}("");
            require(refunded, "Previous bidder refund failed");
        }

        auctions[_id].highestBidder = msg.sender;
        auctions[_id].highestBid = msg.value;
        emit NewBid(_id, msg.sender, msg.value);
    }

    function endAuction(uint _id) public onlyLandOwner(_id) {
        require(auctions[_id].isActive, "Auction is not active");
        auctions[_id].isActive = false;
        lands[_id].isAuctioned = false;

        if (auctions[_id].highestBidder != address(0)) {
            (bool sent, ) = lands[_id].owner.call{value: auctions[_id].highestBid}("");
            require(sent, "Payment to owner failed");

            lands[_id].owner = auctions[_id].highestBidder;
        }

        emit AuctionEnded(_id, auctions[_id].highestBidder, auctions[_id].highestBid);
    }
}
