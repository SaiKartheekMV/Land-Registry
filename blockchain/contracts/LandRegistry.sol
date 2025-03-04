// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract LandRegistry {
    struct Land {
        uint id;
        address owner;
        string location;
        uint price;
        bool forSale;
    }

    mapping(uint => Land) public lands;
    uint public landCount;

    event LandRegistered(uint id, address owner, string location, uint price);
    event LandTransferred(uint id, address newOwner, uint price);

    function registerLand(String memory _location, uint _price) public {
        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _location, _price, false);
        emit LandRegistered(landCount, msg.sender, _location, _price);
    }
}