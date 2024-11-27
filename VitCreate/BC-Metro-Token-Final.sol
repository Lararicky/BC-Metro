// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrainDensityReport {
    string public constant name = "Train Density Token";
    string public constant symbol = "TDT";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    enum DensityLevel { LOW, MEDIUM, HIGH }

    struct DensityReport {
        string stationName;
        uint8 carriageNumber;
        DensityLevel density;
        uint256 timestamp;
        address reporter;
    }

    mapping(string => DensityReport[]) public stationReports;
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    // Leaderboard storage
    mapping(address => uint256) public reporterRewards;
    address[] public leaderboard;

    event NewDensityReport(
        string stationName,
        uint8 carriageNumber,
        DensityLevel density,
        uint256 timestamp,
        address reporter
    );
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10**decimals;
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    modifier onlyValidAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    modifier onlyValidStation(string memory stationName) {
        require(bytes(stationName).length > 0, "Station name cannot be empty");
        _;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        onlyValidAmount(amount)
        returns (bool)
    {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount)
        public
        onlyValidAmount(amount)
        returns (bool)
    {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        returns (uint256)
    {
        return allowances[owner][spender];
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public onlyValidAmount(amount) returns (bool) {
        require(balances[sender] >= amount, "Insufficient balance");
        require(allowances[sender][msg.sender] >= amount, "Allowance exceeded");

        balances[sender] -= amount;
        balances[recipient] += amount;
        allowances[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    function reportDensity(
        string memory _stationName,
        uint8 _carriageNumber,
        DensityLevel _density
    ) public onlyValidStation(_stationName) {
        DensityReport memory newReport = DensityReport({
            stationName: _stationName,
            carriageNumber: _carriageNumber,
            density: _density,
            timestamp: block.timestamp,
            reporter: msg.sender
        });

        stationReports[_stationName].push(newReport);

        uint256 reward = 1 * 10**decimals;
        balances[msg.sender] += reward;
        totalSupply += reward;

        // Update leaderboard
        reporterRewards[msg.sender] += reward;
        if (reporterRewards[msg.sender] == reward) {
            leaderboard.push(msg.sender);
        }

        emit NewDensityReport(
            _stationName,
            _carriageNumber,
            _density,
            block.timestamp,
            msg.sender
        );
        emit Transfer(address(0), msg.sender, reward);
    }

    function getRecentReports(string memory _stationName)
        public
        view
        returns (DensityReport[] memory)
    {
        uint256 fiveMinutesAgo = block.timestamp - 5 minutes;
        DensityReport[] storage allReports = stationReports[_stationName];

        uint256 recentCount = 0;
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= fiveMinutesAgo) {
                recentCount++;
            }
        }

        DensityReport[] memory recentReports = new DensityReport[](recentCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= fiveMinutesAgo) {
                recentReports[index] = allReports[i];
                index++;
            }
        }

        return recentReports;
    }

    function cleanupOldReports(string memory _stationName) public {
        uint256 fiveMinutesAgo = block.timestamp - 5 minutes;
        DensityReport[] storage reports = stationReports[_stationName];

        uint256 i = 0;
        while (i < reports.length) {
            if (reports[i].timestamp < fiveMinutesAgo) {
                reports[i] = reports[reports.length - 1];
                reports.pop();
            } else {
                i++;
            }
        }
    }

    function redeemTokens(uint256 _amount) public onlyValidAmount(_amount) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        totalSupply -= _amount;
        emit Transfer(msg.sender, address(0), _amount);
    }
}
