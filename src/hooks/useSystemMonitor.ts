
import { useState, useEffect, useCallback } from 'react';
import { scanDeviceMemory, scanDeviceCPU, scanDeviceHealth } from '@/utils/deviceScanner';

interface SystemStats {
  cpuUsage: number;
  ramUsage: number;
  memoryUsed: number;
  memoryTotal: number;
  batteryLevel: number;
  temperature: number;
  timestamp: number;
}

export const useSystemMonitor = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [memoryInfo, setMemoryInfo] = useState({ used: 0, total: 4096, available: 4096 });
  const [performanceHistory, setPerformanceHistory] = useState<SystemStats[]>([]);
  const [deviceHealth, setDeviceHealth] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const performDeviceScan = useCallback(async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    
    try {
      console.log('Starting device scan...');
      
      // Scan all device metrics
      const [memoryData, cpuData, healthData] = await Promise.all([
        scanDeviceMemory(),
        scanDeviceCPU(),
        scanDeviceHealth()
      ]);
      
      console.log('Device scan results:', { memoryData, cpuData, healthData });
      
      // Update state with real data
      setCpuUsage(cpuData.usage);
      setRamUsage(Math.round((memoryData.usedMemory / memoryData.totalMemory) * 100));
      setMemoryInfo({
        used: memoryData.usedMemory,
        total: memoryData.totalMemory,
        available: memoryData.availableMemory
      });
      setDeviceHealth(healthData);
      
      // Add to performance history
      const timestamp = new Date();
      const newStats: SystemStats = {
        cpuUsage: cpuData.usage,
        ramUsage: Math.round((memoryData.usedMemory / memoryData.totalMemory) * 100),
        memoryUsed: memoryData.usedMemory,
        memoryTotal: memoryData.totalMemory,
        batteryLevel: healthData.batteryLevel,
        temperature: cpuData.temperature,
        timestamp: timestamp.getTime()
      };
      
      setPerformanceHistory(prev => [
        ...prev.slice(-19), // Keep last 19 entries
        {
          ...newStats,
          time: timestamp.toLocaleTimeString(),
          cpu: cpuData.usage,
          ram: Math.round((memoryData.usedMemory / memoryData.totalMemory) * 100)
        }
      ]);
      
      console.log(`Real Device Stats - CPU: ${cpuData.usage}%, RAM: ${Math.round((memoryData.usedMemory / memoryData.totalMemory) * 100)}%, Memory: ${memoryData.usedMemory.toFixed(1)}MB/${memoryData.totalMemory}MB`);
      
    } catch (error) {
      console.error('Error during device scan:', error);
      // Set fallback values
      setCpuUsage(25);
      setRamUsage(45);
      setMemoryInfo({ used: 1800, total: 4096, available: 2296 });
    } finally {
      setIsScanning(false);
    }
  }, [isScanning]);

  useEffect(() => {
    // Initial scan
    performDeviceScan();
    
    // Set up interval for continuous scanning
    const interval = setInterval(performDeviceScan, 5000); // Every 5 seconds
    
    return () => clearInterval(interval);
  }, [performDeviceScan]);

  return {
    cpuUsage,
    ramUsage,
    memoryInfo,
    performanceHistory,
    deviceHealth,
    isScanning,
    performDeviceScan
  };
};
