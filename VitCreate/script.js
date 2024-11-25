const web3 = new Web3('http://127.0.0.1:7545'); // Connect to Ganache

// ABI and Contract Address
const contractABI = [
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newBalance",
				"type": "uint256"
			}
		],
		"name": "TokenBalanceUpdated",
		"type": "event"
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
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getTokenBalance",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tokenBalance",
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
const contractAddress = '0xF1d07950769E3F9d89FeE5Aa62F23Cff9A72E983'; // Contract Address
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

// ADD ON Check Token Balance
checkBalanceBtn.addEventListener('click', async () => {
	const selectedAccount = accountSelect.value;

	try {
		// Call func. getTokenBalance from Smart Contract
		const balance = await contract.methods.getTokenBalance(selectedAccount).call();
		balanceDisplay.textContent = `Balance: ${balance} Token(s)`;
	} catch (error) {
		console.error(error);
		alert('Error fetching token balance');
	}
});

// Initialize accounts on page load
loadAccounts();
