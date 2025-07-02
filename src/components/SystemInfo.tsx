
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Smartphone, Cpu, HardDrive, Wifi, Battery, RefreshCw } from 'lucide-react';
import { Device } from '@capacitor/device';
import { scanDeviceMemory, scanDeviceHealth } from '@/utils/deviceScanner';

const SystemInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const getDeviceModel = (info: any) => {
    if (info.platform === 'ios') {
      const userAgent = navigator.userAgent;
      
      // Better iPhone model detection
      if (userAgent.includes('iPhone')) {
        // Try to detect from device identifier
        if (info.model && info.model !== 'iPhone') {
          return info.model;
        }
        
        // Fallback to user agent parsing
        const osVersion = info.osVersion || '';
        if (osVersion.startsWith('17.')) {
          return 'iPhone (iOS 17)';
        } else if (osVersion.startsWith('16.')) {
          return 'iPhone (iOS 16)';
        } else if (osVersion.startsWith('15.')) {
          return 'iPhone (iOS 15)';
        }
        
        return 'iPhone';
      }
      return info.model || 'iOS Device';
    }
    
    return info.model || 'Unknown Device';
  };

  const getConnectionType = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const type = connection.effectiveType || connection.type;
      if (type === '4g' || type === 'cellular') return 'Cellular (4G/5G)';
      if (type === 'wifi') return 'WiFi';
      if (type === 'slow-2g') return 'Cellular (2G)';
      if (type === '3g') return 'Cellular (3G)';
      return type;
    }
    
    return navigator.onLine ? 'Connected' : 'Offline';
  };

  const performFullScan = async () => {
    setScanning(true);
    try {
      console.log('Performing full device scan...');
      
      const [deviceData, memoryData, healthData] = await Promise.all([
        Device.getInfo(),
        scanDeviceMemory(),
        scanDeviceHealth()
      ]);
      
      console.log('Full scan results:', { deviceData, memoryData, healthData });
      
      setDeviceInfo(deviceData);
      setMemoryInfo(memoryData);
      setHealthInfo(healthData);
    } catch (error) {
      console.error('Error during full scan:', error);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    const initializeDeviceInfo = async () => {
      try {
        await performFullScan();
      } finally {
        setLoading(false);
      }
    };

    initializeDeviceInfo();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center">Scanning device...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!deviceInfo) {
    return (
      <div className="space-y-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center text-red-500">Failed to scan device</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Device Information
          </CardTitle>
          <Button
            onClick={performFullScan}
            disabled={scanning}
            variant="outline"
            size="sm"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Rescan
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Model:</span>
                <Badge variant="outline">{getDeviceModel(deviceInfo)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">OS Version:</span>
                <span className="font-medium">{deviceInfo.operatingSystem} {deviceInfo.osVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform:</span>
                <span className="font-medium">{deviceInfo.platform}</span>
              </div>
              {deviceInfo.webViewVersion && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">WebView:</span>
                  <span className="font-medium text-xs">{deviceInfo.webViewVersion}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Manufacturer:</span>
                <span className="font-medium">{deviceInfo.manufacturer || 'Apple'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Device Type:</span>
                <span className="font-medium">{deviceInfo.isVirtual ? 'Simulator' : 'Physical Device'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CPU Cores:</span>
                <span className="font-medium">{navigator.hardwareConcurrency || 6}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-green-500" />
            Memory & Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Memory:</span>
                <span className="font-medium">
                  {memoryInfo ? `${(memoryInfo.totalMemory / 1024).toFixed(1)} GB` : 'Scanning...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Used Memory:</span>
                <span className="font-medium">
                  {memoryInfo ? `${(memoryInfo.usedMemory / 1024).toFixed(1)} GB` : 'Scanning...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Memory:</span>
                <span className="font-medium">
                  {memoryInfo ? `${(memoryInfo.availableMemory / 1024).toFixed(1)} GB` : 'Scanning...'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Memory Pressure:</span>
                <Badge variant={memoryInfo?.memoryPressure === 'low' ? 'default' : 'destructive'}>
                  {memoryInfo?.memoryPressure || 'Scanning...'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage:</span>
                <span className="font-medium">
                  {healthInfo ? `${(healthInfo.diskSpace.available / 1024).toFixed(0)} GB available` : 'Scanning...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Connection:</span>
                <span className="font-medium">{getConnectionType()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-orange-500" />
            Battery & Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Battery Level:</span>
            <Badge className={healthInfo?.batteryLevel > 50 ? "bg-green-500" : "bg-red-500"}>
              {healthInfo ? `${healthInfo.batteryLevel}%` : 'Scanning...'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Battery Health:</span>
            <Badge variant="outline">{healthInfo?.batteryHealth || 'Scanning...'}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thermal State:</span>
            <Badge variant="outline">{healthInfo?.thermalState || 'Scanning...'}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemInfo;
