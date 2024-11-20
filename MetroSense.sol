// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MetroSense {
    // โครงสร้างสำหรับเก็บข้อมูลรายงาน
    struct Report {
        address reporter;     // ที่อยู่ของผู้รายงาน
        string stationName;   // ชื่อสถานีรถไฟ
        string trainCar;      // หมายเลขตู้
        string density;       // ความหนาแน่น (ไม่หนาแน่น, หนาแน่นปานกลาง, หนาแน่นมาก)
        uint256 timestamp;    // เวลาที่รายงาน (Unix timestamp)
    }

    // โทเค็นรางวัลที่ผู้รายงานจะได้รับ
    uint256 public rewardTokens = 1;

    // รายการของรายงานทั้งหมด
    Report[] public reports;

    // สมุดบัญชีโทเค็นของผู้ใช้
    mapping(address => uint256) public balances;

    // เหตุการณ์เมื่อมีการรายงานใหม่
    event NewReport(address indexed reporter, uint256 reportId);

    // เหตุการณ์เมื่อมีการให้รางวัล
    event RewardGiven(address indexed reporter, uint256 amount);

    // ฟังก์ชันสำหรับผู้ใช้ในการรายงานความหนาแน่น
    function reportDensity(string memory _stationName, string memory _trainCar, string memory _density) public {
        // สร้างรายงานใหม่
        Report memory newReport = Report({
            reporter: msg.sender,
            stationName: _stationName,
            trainCar: _trainCar,
            density: _density,
            timestamp: block.timestamp
        });

        // เพิ่มรายงานลงในรายการ
        reports.push(newReport);

        // ให้รางวัลโทเค็นแก่ผู้รายงาน
        balances[msg.sender] += rewardTokens;

        // ส่งเหตุการณ์การรายงานใหม่
        emit NewReport(msg.sender, reports.length - 1);

        // ส่งเหตุการณ์การให้รางวัล
        emit RewardGiven(msg.sender, rewardTokens);
    }

    // ฟังก์ชันสำหรับดึงข้อมูลรายงานของสถานีในช่วง 5 นาทีที่ผ่านมา
    function getRecentReports(string memory _stationName) public view returns (Report[] memory) {
        uint256 currentTime = block.timestamp;
        uint256 fiveMinutesAgo = currentTime - 5 minutes;

        // นับจำนวนรายงานที่ตรงกับเงื่อนไข
        uint256 count = 0;
        for (uint256 i = 0; i < reports.length; i++) {
            if (
                keccak256(abi.encodePacked(reports[i].stationName)) == keccak256(abi.encodePacked(_stationName)) &&
                reports[i].timestamp >= fiveMinutesAgo
            ) {
                count++;
            }
        }

        // สร้างอาเรย์สำหรับเก็บรายงานที่ตรงกับเงื่อนไข
        Report[] memory recentReports = new Report[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < reports.length; i++) {
            if (
                keccak256(abi.encodePacked(reports[i].stationName)) == keccak256(abi.encodePacked(_stationName)) &&
                reports[i].timestamp >= fiveMinutesAgo
            ) {
                recentReports[index] = reports[i];
                index++;
            }
        }

        return recentReports;
    }

    // ฟังก์ชันสำหรับตรวจสอบยอดโทเค็นของผู้ใช้
    function getBalance(address _user) public view returns (uint256) {
        return balances[_user];
    }
}
