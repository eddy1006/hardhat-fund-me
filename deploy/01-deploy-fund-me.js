// all deploy scripts will run when you run yarn hardhat deploy
require("dotenv").config();
const { network } = require("hardhat");

// async function deployFunc(hre) {
//   console.log("hi");
//   hre.getNamedAccounts();
//   hre.deployments();
// }

// module.exports.default = deployFunc    Method 1 of writing

// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre;     Method 2 of wrtiting
// }

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  // pulling these two out of hre just like importing require {ethers, run, network} from hardhat
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  //when going for localhost or hardhat we want to use a mock
  //when changing testnets we can pass the address of chainlink contract on that chain

  //A mock is like a mock contract for chains that do not have the chainlink address that is our hardhat
  //and localhost hardhat chains so, we deploy a mock contract for them

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify
    await verify(fundMe.address, args);
  }
};

module.exports.tags = ["all", "fundMe"];
