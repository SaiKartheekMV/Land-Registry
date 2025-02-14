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
    uint public landCount;

    event LandRegistered(uint indexed id, address indexed owner, string location, uint price);

    constructor() {
        landCount = 0; // Initializing land count
    }

    function registerLand(string memory _location, uint _price) public {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _location, _price);

        emit LandRegistered(landCount, msg.sender, _location, _price);
    }
}
