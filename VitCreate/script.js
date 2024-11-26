const web3 = new Web3('http://127.0.0.1:7545'); // Connect to Ganache

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
];
const contractAddress = '0x5209CFE7571F3006B1fA39fC3535967827E494fc'; // Contract Address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// DOM Elements
const accountSelect = document.getElementById('accountSelect');
const reportForm = document.getElementById('reportForm');
const fetchReportsBtn = document.getElementById('fetchReports');
const reportsDiv = document.getElementById('reports');
const queryStationInput = document.getElementById('queryStation');

const checkBalanceBtn = document.getElementById('checkBalance');
const balanceDisplay = document.getElementById('balanceDisplay');

// Load accounts from Ganache
async function loadAccounts() {
	const accounts = await web3.eth.getAccounts();
	accounts.forEach((account) => {
		const option = document.createElement('option');
		option.value = account;
		option.textContent = account;
		accountSelect.appendChild(option);
	});
}

// Submit Report
reportForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	const stationName = document.getElementById('stationName').value;
	const carriageNumber = document.getElementById('carriageNumber').value;
	const densityLevel = document.getElementById('density').value;
	const selectedAccount = accountSelect.value;

	try {
		await contract.methods
			.reportDensity(stationName, parseInt(carriageNumber), parseInt(densityLevel))
			.send({ from: selectedAccount, gas: 300000 }); // Increase gas limit as needed

		alert('Report submitted successfully!');
	} catch (error) {
		console.error(error);
		alert(error);
	}
});

// Fetch Recent Reports
fetchReportsBtn.addEventListener('click', async () => {
	const stationName = queryStationInput.value;

	try {
		const reports = await contract.methods.getRecentReports(stationName).call();

		reportsDiv.innerHTML = '<h3>Recent Reports:</h3>';
		reports.forEach((report, index) => {
			const reportHTML = `
        <div>
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
	} catch (error) {
		console.error(error);
		alert('Error fetching reports');
	}
});

// Check Token Balance
checkBalanceBtn.addEventListener('click', async () => {
	const selectedAccount = accountSelect.value;
  
	try {
	  const balance = await contract.methods.balanceOf(selectedAccount).call();
	  balanceDisplay.textContent = `Balance: ${web3.utils.fromWei(balance, 'ether')} Token(s)`;
	} catch (error) {
	  console.error("Error: ",error);
	  alert('Error fetching token balance');
	}
  });

// Initialize accounts on page load
loadAccounts();
