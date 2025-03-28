const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");

    // Deploy the contract
    const landRegistry = await LandRegistry.deploy();
    
    // ✅ Correct way in ethers v6+
    await landRegistry.waitForDeployment();  

    // ✅ Get contract address
    console.log("LandRegistry deployed to:", await landRegistry.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
