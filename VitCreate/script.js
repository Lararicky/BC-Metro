const web3 = new Web3("http://127.0.0.1:7545"); // Connect to Ganache

// ABI and Contract Address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_stationName",
				"type": "string"
			}
		],
		"name": "cleanupOldReports",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "stationName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "carriageNumber",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum TrainDensityReport.DensityLevel",
				"name": "density",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			}
		],
		"name": "NewDensityReport",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "redeemTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_stationName",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_carriageNumber",
				"type": "uint8"
			},
			{
				"internalType": "enum TrainDensityReport.DensityLevel",
				"name": "_density",
				"type": "uint8"
			}
		],
		"name": "reportDensity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_stationName",
				"type": "string"
			}
		],
		"name": "getRecentReports",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "stationName",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "carriageNumber",
						"type": "uint8"
					},
					{
						"internalType": "enum TrainDensityReport.DensityLevel",
						"name": "density",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "reporter",
						"type": "address"
					}
				],
				"internalType": "struct TrainDensityReport.DensityReport[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "leaderboard",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "reporterRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stationReports",
		"outputs": [
			{
				"internalType": "string",
				"name": "stationName",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "carriageNumber",
				"type": "uint8"
			},
			{
				"internalType": "enum TrainDensityReport.DensityLevel",
				"name": "density",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const contractAddress = "0x2bee9c024E8818a2bDF03293e5aE2622A6852Df2"; // Contract Address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// DOM Elements
const connectWalletBtn = document.getElementById("connectWallet"); // ConnectWallet
const signOutBtn = document.getElementById("signOut"); // SignOut
const accountSelect = document.getElementById("accountSelect");
const reportForm = document.getElementById("reportForm");
const fetchReportsBtn = document.getElementById("fetchReports");
const reportsDiv = document.getElementById("reports");
const queryStationInput = document.getElementById("queryStation");
const checkBalanceBtn = document.getElementById("checkBalance");
const balanceDisplay = document.getElementById("balanceDisplay");

// Handle Wallet Connection
connectWalletBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Prompt MetaMask to let the user choose an account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const selectedAccount = accounts[0];

        // Populate the dropdown with the selected account
        accountSelect.innerHTML = ""; // Clear existing options
        const option = document.createElement("option");
        option.value = selectedAccount;
        option.textContent = selectedAccount;
        accountSelect.appendChild(option);

        // Update UI
        connectWalletBtn.textContent = `Connected: ${selectedAccount}`;
        connectWalletBtn.disabled = true; // Disable Connect Wallet button
        signOutBtn.style.display = "inline-block"; // Show Sign Out button
      }
    } catch (error) {
      console.error("User denied account access:", error);
      alert("Account connection failed. Please try again.");
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this feature.");
  }
});

// Handle Sign Out
signOutBtn.addEventListener("click", () => {
  // Clear account dropdown and reset UI
  accountSelect.innerHTML = ""; // Clear the dropdown
  connectWalletBtn.textContent = "Connect Wallet";
  connectWalletBtn.disabled = false; // Re-enable Connect Wallet button
  signOutBtn.style.display = "none"; // Hide Sign Out button

  alert("You have signed out successfully. Please reconnect to an account.");
});

// Detect Account Changes
if (typeof window.ethereum !== "undefined") {
  ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      // Update dropdown with the new account
      const selectedAccount = accounts[0];
      accountSelect.innerHTML = ""; // Clear existing options
      const option = document.createElement("option");
      option.value = selectedAccount;
      option.textContent = selectedAccount;
      accountSelect.appendChild(option);

      connectWalletBtn.textContent = `Connected: ${selectedAccount}`;
    } else {
      // Handle account disconnection
      alert("No accounts connected. Please reconnect to choose an account.");
      signOutBtn.click(); // Trigger sign-out functionality
    }
  });
}

// Submit Report
reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const stationName = document.getElementById("stationName").value;
  const carriageNumber = document.getElementById("carriageNumber").value;
  const densityLevel = document.getElementById("density").value;
  const selectedAccount = accountSelect.value;

  try {
    await contract.methods
      .reportDensity(
        stationName,
        parseInt(carriageNumber),
        parseInt(densityLevel)
      )
      .send({ from: selectedAccount, gas: 300000 }); // Increase gas limit as needed

    alert("Report submitted successfully!");
  } catch (error) {
    console.error(error);
    alert(error);
  }
});

// Fetch Recent Reports
fetchReportsBtn.addEventListener('click', async () => {
	const stationName = queryStationInput.value.trim();
  
	// ตรวจสอบว่ามีการใส่ชื่อสถานีหรือไม่
	if (!stationName) {
	  reportsDiv.innerHTML = `
		<p>Please enter a station name to fetch reports.</p>
	  `;
	  return;
	}
  
	try {
	  // เรียกใช้ฟังก์ชัน getRecentReports ใน Smart Contract
	  const reports = await contract.methods.getRecentReports(stationName).call();
  
	  // เคลียร์เนื้อหาเดิมใน reportsDiv
	  reportsDiv.innerHTML = '<h3>Recent Reports:</h3>';
  
	  // ตรวจสอบว่ามีรายงานในช่วง 5 นาทีหรือไม่
	  if (reports.length === 0) {
		reportsDiv.innerHTML += `
		  <p class="no-reports-message">No recent reports found for station "${stationName}" in the last 5 minutes.</p>
		  <p class="no-reports-message">Please check back later or submit a new report.</p>
		`;
	  } else {
		// แสดงรายงานทั้งหมดที่มี
		reports.forEach((report, index) => {
			const reportHTML = `
			  <div class="report">
				<strong>Report #${index + 1}</strong><br>
				Station: ${report.stationName}<br>
				Carriage: ${report.carriageNumber}<br>
				Density: ${["LOW", "MEDIUM", "HIGH"][report.density]}<br>
				Timestamp: ${new Date(report.timestamp * 1000).toLocaleString()}<br>
				Reporter: ${report.reporter}<br>
			  </div>
		    <hr>
		  `;
		  reportsDiv.innerHTML += reportHTML;
		});
	  }
	} catch (error) {
	  console.error('Error fetching reports:', error);
	  reportsDiv.innerHTML = `
		<p class="error-message" >Error fetching recent reports. Please try again.</p>
	  `;
	}
  });
  
// Check Token Balance
checkBalanceBtn.addEventListener("click", async () => {
  const selectedAccount = accountSelect.value;

  try {
    const balance = await contract.methods.balanceOf(selectedAccount).call();
    balanceDisplay.textContent = `Balance: ${web3.utils.fromWei(
      balance,
      "ether"
    )} Token(s)`;
  } catch (error) {
    console.error("Error: ", error);
    alert("Error fetching token balance");
  }
});

// Initialize accounts on page load
loadAccounts();
