const { network } = require("hardhat");

const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  // pulling these two out of hre just like importing require {ethers, run, network} from hardhat
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("Local network detected ! Deploying mocks.....");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed successfully");
    log("----------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"]; // tags to use when you want to deploy only the mock file
