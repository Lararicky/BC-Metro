import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ABI จาก contract ที่เราสร้างก่อนหน้า (ต้องใส่ ABI จริงตรงนี้)
const CONTRACT_ABI = [/* ใส่ ABI ของ contract ที่ deploy แล้วตรงนี้ */];
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // ใส่ address ของ contract ที่ deploy แล้ว

const TrainDensityApp = () => {
  const [account, setAccount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [stationName, setStationName] = useState('');
  const [carriageNumber, setCarriageNumber] = useState('');
  const [density, setDensity] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      // เช็คว่ามี MetaMask หรือไม่
      if (typeof window.ethereum !== 'undefined') {
        // ขอ permission ใช้งาน account
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        // สร้าง Web3 instance
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        // ดึงรายการ accounts ทั้งหมด
        setAccounts(accounts);
        setAccount(accounts[0]);

        // สร้าง contract instance
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        // ฟังก์ชัน callback เมื่อมีการเปลี่ยน account
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
        });
      } else {
        setError('Please install MetaMask!');
      }
    } catch (err) {
      setError('Error connecting to MetaMask');
      console.error(err);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      if (!contract || !web3) return;
      
      await contract.methods.reportDensity(
        stationName,
        parseInt(carriageNumber),
        parseInt(density)
      ).send({ from: account });
      
      // หลังจากรายงานสำเร็จ ดึงข้อมูลล่าสุดมาแสดง
      fetchRecentReports();
      
      // เคลียร์ฟอร์ม
      setStationName('');
      setCarriageNumber('');
      setDensity('');
    } catch (err) {
      setError('Error submitting report');
      console.error(err);
    }
  };

  const fetchRecentReports = async () => {
    try {
      if (!contract || !stationName) return;
      
      const reports = await contract.methods.getRecentReports(stationName).call();
      setRecentReports(reports);
    } catch (err) {
      setError('Error fetching reports');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Train Density Reporter</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Connected Account</h3>
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc} value={acc}>
                    {acc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-4">
            <div>
              <label className="block mb-2">Station Name:</label>
              <Input
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="Enter station name"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Carriage Number:</label>
              <Input
                type="number"
                value={carriageNumber}
                onChange={(e) => setCarriageNumber(e.target.value)}
                placeholder="Enter carriage number"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block mb-2">Density Level:</label>
              <Select value={density} onValueChange={setDensity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select density level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Low</SelectItem>
                  <SelectItem value="1">Medium</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Recent Reports</h2>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchRecentReports} className="mb-4">
            Refresh Reports
          </Button>
          
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 border rounded">
                <p>Reporter: {report.reporter}</p>
                <p>Station: {report.stationName}</p>
                <p>Carriage: {report.carriageNumber}</p>
                <p>Density: {['Low', 'Medium', 'High'][parseInt(report.density)]}</p>
                <p>Time: {new Date(parseInt(report.timestamp) * 1000).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainDensityApp;