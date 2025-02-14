// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract LandRegistry {
    struct Land {
        uint256 id;
        address owner;
        string location;
        uint256 price;
        bool isAvailable;
    }

    mapping(uint256 => Land) private lands;
    uint256 public landCount;
    
    event LandRegistered(uint256 indexed id, address indexed owner, string location, uint256 price);
    event LandTransferred(uint256 indexed id, address indexed previousOwner, address indexed newOwner);
    event LandPriceUpdated(uint256 indexed id, uint256 oldPrice, uint256 newPrice);

    constructor() {
        landCount = 0;
    }

    modifier onlyOwner(uint256 _id) {
        require(lands[_id].owner == msg.sender, "Not the landowner");
        _;
    }

    function registerLand(string memory _location, uint256 _price) public {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _location, _price, true);

        emit LandRegistered(landCount, msg.sender, _location, _price);
    }

    function transferLand(uint256 _id, address _newOwner) public onlyOwner(_id) {
        require(_newOwner != address(0), "Invalid new owner");
        require(lands[_id].isAvailable, "Land is not available");

        address previousOwner = lands[_id].owner;
        lands[_id].owner = _newOwner;

        emit LandTransferred(_id, previousOwner, _newOwner);
    }

    function updateLandPrice(uint256 _id, uint256 _newPrice) public onlyOwner(_id) {
        require(_newPrice > 0, "New price must be greater than zero");

        uint256 oldPrice = lands[_id].price;
        lands[_id].price = _newPrice;

        emit LandPriceUpdated(_id, oldPrice, _newPrice);
    }

    function getLand(uint256 _id) public view returns (uint256, address, string memory, uint256, bool) {
        Land memory land = lands[_id];
        return (land.id, land.owner, land.location, land.price, land.isAvailable);
    }
}
