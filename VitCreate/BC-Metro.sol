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
    
    // Event เมื่อมีการรายงานใหม่
    event NewDensityReport(
        string stationName,
        uint8 carriageNumber,
        DensityLevel density,
        uint256 timestamp,
        address reporter
    );
    
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
        
        emit NewDensityReport(
            _stationName,
            _carriageNumber,
            _density,
            block.timestamp,
            msg.sender
        );
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
        DensityReport[] memory recentReports = new DensityReport[](recentReportsCount);
        uint256 currentIndex = 0;
        
        // เก็บเฉพาะรายงานในช่วง 5 นาที
        for (uint256 i = 0; i < allReports.length; i++) {
            if (allReports[i].timestamp >= fiveMinutesAgo) {
                recentReports[currentIndex] = allReports[i];
                currentIndex++;
            }
        }
        
        return recentReports;
    }
}