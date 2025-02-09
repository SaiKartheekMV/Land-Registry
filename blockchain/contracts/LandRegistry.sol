// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

contract LandRegistry{
    struct Land {
        uint id;
        string owner;
        string location;
        uint price;
    }
    mapping(uint => Land) public lands;
    uint public landCount = 0;

    function registerLand(string memory _owner, string memory _location, uint _price) public {
        landCount++;
        lands[landCount] = Land(landCount, _owner, _location, _price);
    }

    function getLand(uint _id) public view returns (Land memory){
        return lands[_id];
    }
}