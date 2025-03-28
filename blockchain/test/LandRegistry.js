// Import required libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  // Declare variables to be accessible in all tests
  let landRegistry;
  let owner;
  let user1;
  let user2;

  // Deploy the contract before each test
  beforeEach(async function () {
    // Get signers (Ethereum accounts)
    [owner, user1, user2] = await ethers.getSigners();

    // Get the contract factory and deploy the LandRegistry contract
    const LandRegistryFactory = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistryFactory.deploy();
    // No need to call deployed() as the contract is already deployed
  });

  // Test case: Should allow a user to buy listed land
  it("Should allow a user to buy listed land", async function () {
    // Register and verify user1 (Alice)
    await landRegistry.connect(user1).registerUser("Alice", "alice@example.com", "1234567890");
    await landRegistry.connect(owner).verifyUser(user1.address);

    // Register and verify user2 (Bob)
    await landRegistry.connect(user2).registerUser("Bob", "bob@example.com", "0987654321");
    await landRegistry.connect(owner).verifyUser(user2.address);

    // Register land by user1
    await landRegistry.connect(user1).registerLand("Farmville", ethers.parseEther("2"));

    // Verify the land by owner
    await landRegistry.connect(owner).verifyLand(1, true);

    // List the land for sale by user1
    await landRegistry.connect(user1).listLandForSale(1, ethers.parseEther("2"));

    // User2 buys the land
    await landRegistry.connect(user2).buyLand(1, { value: ethers.parseEther("2") });

    // Verify the new owner is user2
    const landData = await landRegistry.lands(1);
    expect(landData.owner).to.equal(user2.address);
  });
});