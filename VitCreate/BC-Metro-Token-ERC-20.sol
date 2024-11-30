// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrainDensityReport {
    // รายละเอียด Token
    string public constant name = "Train Density Token"; // ชื่อ Token
    string public constant symbol = "TDT"; // สัญลักษณ์ Token
    uint8 public constant decimals = 18; // จำนวนตำแหน่งทศนิยม
    uint256 public totalSupply; // จำนวน Token ทั้งหมด

    // Enum สำหรับระดับความหนาแน่น
    enum DensityLevel { LOW, MEDIUM, HIGH }

    // โครงสร้างข้อมูลสำหรับรายงานความหนาแน่น
    struct DensityReport {
        string stationName;
        uint8 carriageNumber;
        DensityLevel density;
        uint256 timestamp;
        address reporter;
    }

    // เก็บประวัติรายงานทั้งหมดสำหรับแต่ละสถานี
    mapping(string => DensityReport[]) public stationReports;

    // สำหรับเก็บยอด Token ของผู้ใช้งานแต่ละคน
    mapping(address => uint256) private balances;
    // เก็บข้อมูลอนุมัติการใช้ Token
    mapping(address => mapping(address => uint256)) private allowances;

    // Event สำหรับ Token และรายงาน
    event NewDensityReport(
        string stationName,
        uint8 carriageNumber,
        DensityLevel density,
        uint256 timestamp,
        address reporter
    );
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // Constructor สำหรับกำหนด Supply เริ่มต้นของ Token
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply * 10**decimals;
        balances[msg.sender] = totalSupply; // ให้ Token ทั้งหมดกับเจ้าของสัญญา
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // ฟังก์ชันดึงยอด Token ของ Address ใดๆ
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    // ฟังก์ชันโอน Token
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, unicode"ยอด Token ไม่เพียงพอ");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // ฟังก์ชันอนุญาตให้ใช้ Token โดยบุคคลอื่น
    function approve(address spender, uint256 amount) public returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // ฟังก์ชันตรวจสอบสิทธิ์การใช้ Token
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }

    // ฟังก์ชันโอน Token จาก Address หนึ่งไปอีก Address
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        require(balances[sender] >= amount, unicode"ยอด Token ไม่เพียงพอ");
        require(allowances[sender][msg.sender] >= amount, unicode"สิทธิ์ไม่เพียงพอ");

        balances[sender] -= amount;
        balances[recipient] += amount;
        allowances[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    // ฟังก์ชันสำหรับรายงานความหนาแน่น
    function reportDensity(
        string memory _stationName,
        uint8 _carriageNumber,
        DensityLevel _density
    ) public {
        DensityReport memory newReport = DensityReport({
            stationName: _stationName,
            carriageNumber: _carriageNumber,
            density: _density,
            timestamp: block.timestamp,
            reporter: msg.sender
        });

        stationReports[_stationName].push(newReport);

        // ให้รางวัล Token สำหรับการรายงาน
        uint256 reward = 1 * 10**decimals;
        balances[msg.sender] += reward;
        totalSupply += reward;

        emit NewDensityReport(
            _stationName,
            _carriageNumber,
            _density,
            block.timestamp,
            msg.sender
        );
        emit Transfer(address(0), msg.sender, reward); // Mint tokens to the reporter
    }

    // ฟังก์ชันดึงข้อมูลรายงานย้อนหลัง 2 นาที
    function getRecentReports(string memory _stationName)
        public
        view
        returns (DensityReport[] memory)
    {
        DensityReport[] storage allReports = stationReports[_stationName];
        uint256 currentTime = block.timestamp;
        uint256 twoMinutesAgo = currentTime - 2 minutes;

        // นับจำนวนรายงานในช่วง 2 นาที
        uint256 recentReportsCount = 0;
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= twoMinutesAgo) {
                recentReportsCount++;
            }
        }

        // สร้าง array ใหม่สำหรับเก็บรายงานล่าสุด
        DensityReport[] memory recentReports = new DensityReport[](
            recentReportsCount
        );
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= twoMinutesAgo) {
                recentReports[currentIndex] = allReports[i];
                currentIndex++;
            }
        }

        return recentReports;
    }

    // ฟังก์ชันสำหรับใช้ Token
    function redeemTokens(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, unicode"ยอด Token ไม่เพียงพอ");
        balances[msg.sender] -= _amount;
        emit Transfer(msg.sender, address(0), _amount); // Burn tokens
    }
}
