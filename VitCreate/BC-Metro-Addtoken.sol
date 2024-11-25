// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrainDensityReport {
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
    mapping(address => uint256) public tokenBalance;

    // Event เมื่อมีการรายงานใหม่
    event NewDensityReport(
        string stationName,
        uint8 carriageNumber,
        DensityLevel density,
        uint256 timestamp,
        address reporter
    );
    event TokenBalanceUpdated(address indexed user, uint256 newBalance);

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

        tokenBalance[msg.sender] += 1;
        emit NewDensityReport(
            _stationName,
            _carriageNumber,
            _density,
            block.timestamp,
            msg.sender
        );
        emit TokenBalanceUpdated(msg.sender, tokenBalance[msg.sender]);
    }

    function getTokenBalance(address _user) public view returns (uint256) {
        return tokenBalance[_user];
    }

    // ฟังก์ชันดึงข้อมูลรายงานย้อนหลัง 5 นาที
    function getRecentReports(string memory _stationName)
        public
        view
        returns (DensityReport[] memory)
    {
        DensityReport[] storage allReports = stationReports[_stationName];
        uint256 currentTime = block.timestamp;
        uint256 fiveMinutesAgo = currentTime - 5 minutes;

        // นับจำนวนรายงานในช่วง 5 นาที
        uint256 recentReportsCount = 0;
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= fiveMinutesAgo) {
                recentReportsCount++;
            }
        }

        // สร้าง array ใหม่สำหรับเก็บรายงานล่าสุด
        DensityReport[] memory recentReports = new DensityReport[](
            recentReportsCount
        );
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= fiveMinutesAgo) {
                recentReports[currentIndex] = allReports[i];
                currentIndex++;
            }
        }

        return recentReports;
    }

    // ฟังก์ชั่น redeem สำหรับหักยอด
    function redeemTokens(uint256 _amount) public {
        require(tokenBalance[msg.sender] >= _amount, "Insufficient token balance");
        tokenBalance[msg.sender] -= _amount;
        emit TokenBalanceUpdated(msg.sender, tokenBalance[msg.sender]);
    }
}
