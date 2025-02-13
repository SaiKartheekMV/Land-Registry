// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract LandRegistry {
    struct Land {
        uint id;
        address owner;
        string location;
        uint price;
    }

    mapping(uint => Land) public lands;
    uint public landCount = 0;

    event LandRegistered(uint id, address indexed owner, string location, uint price);

    function registerLand(string memory _location, uint _price) public {
        require(_price > 0, "Price must be greater than zero");

        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _location, _price);

        emit LandRegistered(landCount, msg.sender, _location, _price);
    }

    function getLand(uint _id) public view returns (Land memory) {
        require(_id > 0 && _id <= landCount, "Invalid land ID");
        return lands[_id];
    }
}
