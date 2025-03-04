// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

    function registerLand(string memory _location, uint _price) public {
        landCount++;
        lands[landCount] = Land(landCount, msg.sender, _location, _price, false);
        emit LandRegistered(landCount, msg.sender, _location, _price);
    }

    function buyLand(uint _id) public payable {
        require(lands[_id].forSale, "Land not for sale");
        require(msg.value >= lands[_id].price, "Insufficient funds");

        address previousOwner = lands[_id].owner;
        lands[_id].owner = msg.sender;
        lands[_id].forSale = false;

        payable(previousOwner).transfer(msg.value);
        emit LandTransferred(_id, msg.sender, msg.value);
    }

    function putLandForSale(uint _id, uint _price) public {
        require(msg.sender == lands[_id].owner, "Not the owner");
        lands[_id].price = _price;
        lands[_id].forSale = true;
    }
}
