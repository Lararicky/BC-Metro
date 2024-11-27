const Web3 = require("web3");
const cron = require("node-cron");

// Connect to Ganache or another Ethereum node
const web3 = new Web3("http://127.0.0.1:7545"); // Replace with your Ethereum node URL

// Contract ABI and address
const contractABI = [
  /* Replace this with your contract's ABI */
];
const contractAddress = "0xYourContractAddress"; // Replace with your deployed contract address

// Admin account credentials
const adminAddress = "0x3F9E5D4f0B400CDb5DCcE735784924988ACBf890"; // Replace with your wallet address
const privateKey = "0x868ee6cffa5b6f8dd0ce444964f32a559b9fb80215fb437e78c9cb50926edc1c"; // Replace with your private key

// Initialize the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Cleanup function for old reports
async function cleanupReports() {
  try {
    console.log("Starting cleanup process...");

    // Fetch all stations dynamically
    const stations = await contract.methods.getStationsWithReports().call();

    if (stations.length === 0) {
      console.log("No stations with reports to clean up.");
      return;
    }

    // Iterate through stations and clean up old reports
    for (const stationName of stations) {
      console.log(`Cleaning up old reports for station: ${stationName}`);

      const tx = contract.methods.cleanupOldReports(stationName);

      // Estimate gas and prepare transaction
      const gas = await tx.estimateGas({ from: adminAddress });
      const gasPrice = await web3.eth.getGasPrice();
      const data = tx.encodeABI();
      const nonce = await web3.eth.getTransactionCount(adminAddress);

      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data,
          gas,
          gasPrice,
          nonce,
        },
        privateKey
      );

      // Send the transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(`Cleanup completed for station: ${stationName}`);
      console.log(`Transaction hash: ${receipt.transactionHash}`);
    }

    console.log("Cleanup process finished.");
  } catch (error) {
    console.error("Error during cleanup process:", error);
  }
}

// Schedule the cleanup task to run every 5 minutes
cron.schedule("*/5 * * * *", cleanupReports);

console.log("Cleanup script started. Scheduled to run every 5 minutes.");
