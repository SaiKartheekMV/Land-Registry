// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LandRegistry {
    address public owner;
    uint private landCounter;
    bool private locked;

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
        uint auctionEndTime;
        bool isActive;
    }

    mapping(address => User) public users;
    mapping(uint => Land) public lands;
    mapping(uint => Auction) public auctions;
    mapping(address => bool) public isRegistered;
    mapping(address => uint) public pendingRefunds;

    event UserRegistered(address indexed user, string name, string email, string phone);
    event UserVerified(address indexed user);
    event LandRegistered(uint indexed id, address indexed owner, string location, uint price);
    event LandListedForSale(uint indexed id, uint price);
    event LandTransferred(uint indexed id, address indexed newOwner, uint price);
    event AuctionStarted(uint indexed id, uint startPrice, uint duration);
    event NewBid(uint indexed id, address indexed bidder, uint bidAmount);
    event AuctionEnded(uint indexed id, address indexed winner, uint winningBid);
    event RefundWithdrawn(address indexed user, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyLandOwner(uint _id) {
        require(lands[_id].owner == msg.sender, "Not the land owner");
        _;
    }

    modifier onlyVerifiedUser() {
        require(users[msg.sender].isVerified, "User not verified");
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

    function registerUser(string calldata _name, string calldata _email, string calldata _phone) external {
        require(!isRegistered[msg.sender], "User already registered");
        users[msg.sender] = User(_name, _email, _phone, false);
        isRegistered[msg.sender] = true;
        emit UserRegistered(msg.sender, _name, _email, _phone);
    }

    function verifyUser(address _user) external onlyOwner {
        require(isRegistered[_user], "User must be registered first");
        users[_user].isVerified = true;
        emit UserVerified(_user);
    }

    function registerLand(string calldata _location, uint _price) external onlyVerifiedUser {
        landCounter++;
        lands[landCounter] = Land(landCounter, msg.sender, _location, _price, false, false, false);
        emit LandRegistered(landCounter, msg.sender, _location, _price);
    }

    function registerMultipleLands(string[] calldata _locations, uint[] calldata _prices) external onlyVerifiedUser {
        require(_locations.length == _prices.length, "Invalid input");
        for (uint i = 0; i < _locations.length; i++) {
            landCounter++;
            lands[landCounter] = Land(landCounter, msg.sender, _locations[i], _prices[i], false, false, false);
            emit LandRegistered(landCounter, msg.sender, _locations[i], _prices[i]);
        }
    }

    function listLandForSale(uint _id, uint _price) external onlyLandOwner(_id) {
        require(lands[_id].isVerified, "Land is not verified");
        lands[_id].price = _price;
        lands[_id].forSale = true;
        emit LandListedForSale(_id, _price);
    }

    function buyLand(uint _id) external payable onlyVerifiedUser noReentrancy {
        require(lands[_id].forSale, "Land not for sale");
        require(msg.value >= lands[_id].price, "Insufficient payment");

        address previousOwner = lands[_id].owner;
        lands[_id].owner = msg.sender;
        lands[_id].forSale = false;

        (bool sent, ) = payable(previousOwner).call{value: msg.value}("");
        require(sent, "Payment failed");

        emit LandTransferred(_id, msg.sender, msg.value);
    }

    function startAuction(uint _id, uint _startPrice, uint _duration) external onlyLandOwner(_id) {
        require(lands[_id].isVerified, "Land not verified");
        require(_duration > 0, "Invalid duration");

        auctions[_id] = Auction(_id, address(0), _startPrice, block.timestamp + _duration, true);
        lands[_id].isAuctioned = true;

        emit AuctionStarted(_id, _startPrice, _duration);
    }

    function placeBid(uint _id) external payable onlyVerifiedUser {
        Auction storage auction = auctions[_id];

        require(auction.isActive, "Auction inactive");
        require(block.timestamp < auction.auctionEndTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");

        if (auction.highestBidder != address(0)) {
            pendingRefunds[auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit NewBid(_id, msg.sender, msg.value);
    }

    function endAuction(uint _id) external onlyLandOwner(_id) {
        Auction storage auction = auctions[_id];

        require(auction.isActive, "Auction inactive");
        require(block.timestamp >= auction.auctionEndTime, "Auction not over");

        auction.isActive = false;
        lands[_id].isAuctioned = false;

        if (auction.highestBidder != address(0)) {
            (bool sent, ) = payable(lands[_id].owner).call{value: auction.highestBid}("");
            require(sent, "Payment failed");
            lands[_id].owner = auction.highestBidder;
        }

        emit AuctionEnded(_id, auction.highestBidder, auction.highestBid);
    }

    function withdrawRefund() external {
        uint amount = pendingRefunds[msg.sender];
        require(amount > 0, "No refunds available");

        pendingRefunds[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Refund failed");

        emit RefundWithdrawn(msg.sender, amount);
    }

    function getAvailableLands() external view returns (Land[] memory) {
        uint count;
        for (uint i = 1; i <= landCounter; i++) {
            if (lands[i].forSale) count++;
        }

        Land[] memory availableLands = new Land[](count);
        uint index;
        for (uint i = 1; i <= landCounter; i++) {
            if (lands[i].forSale) {
                availableLands[index] = lands[i];
                index++;
            }
        }

        return availableLands;
    }
}
