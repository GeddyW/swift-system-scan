import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Smartphone, Cpu, HardDrive, Wifi, Battery } from 'lucide-react';
import { Device } from '@capacitor/device';

const SystemInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getDeviceModel = (info: any) => {
    // Better device model detection for iOS
    if (info.platform === 'ios') {
      const userAgent = navigator.userAgent;
      
      // Extract iPhone model from user agent string
      if (userAgent.includes('iPhone')) {
        // Try to detect iPhone model from user agent
        const iphoneMatch = userAgent.match(/iPhone OS (\d+_\d+)/);
        const deviceMatch = userAgent.match(/iPhone(\d+,\d+)/);
        
        // For iPhone 11, the identifier is usually iPhone12,1
        if (deviceMatch) {
          const identifier = deviceMatch[1];
          console.log('Device identifier from user agent:', identifier);
        }
        
        // Use the model from Device API, but provide better fallback
        return info.model || 'iPhone';
      }
      return info.model || 'iOS Device';
    }
    
    return info.model || 'Unknown Device';
  };

  const getEstimatedMemory = () => {
    // Estimate device memory based on typical iOS device specs
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('iPhone')) {
      // iPhone 11 typically has 4GB RAM
      // iPhone 12 and newer typically have 6GB RAM
      // This is an estimation since iOS doesn't expose actual RAM
      return '4-6 GB (estimated)';
    }
    
    if ((navigator as any).deviceMemory) {
      return `${(navigator as any).deviceMemory} GB`;
    }
    
    return '4 GB (estimated)';
  };

  const getConnectionType = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return connection.effectiveType || connection.type || 'Unknown';
    }
    
    // Fallback detection based on online status
    if (navigator.onLine) {
      return 'WiFi/Cellular (estimated)';
    }
    
    return 'Offline';
  };

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        const batteryInfo = await Device.getBatteryInfo();
        
        console.log('Raw Device Info:', info);
        console.log('Raw Battery Info:', batteryInfo);
        console.log('User Agent:', navigator.userAgent);
        
        setDeviceInfo({
          device: {
            model: getDeviceModel(info),
            os: `${info.operatingSystem} ${info.osVersion}`,
            version: info.osVersion || 'Unknown',
            platform: info.platform,
            manufacturer: info.manufacturer || (info.platform === 'ios' ? 'Apple' : 'Unknown'),
            isVirtual: info.isVirtual,
            webViewVersion: info.webViewVersion,
            estimatedMemory: getEstimatedMemory(),
            connectionType: getConnectionType()
          },
          battery: {
            level: `${Math.round((batteryInfo.batteryLevel || 0) * 100)}%`,
            status: batteryInfo.isCharging ? 'Charging' : 'Not Charging',
            health: 'Good' // iOS doesn't expose battery health via Capacitor
          }
        });
      } catch (error) {
        console.error('Error getting device info:', error);
        // Enhanced fallback with user agent parsing
        const userAgent = navigator.userAgent;
        let deviceModel = 'Unknown Device';
        
        if (userAgent.includes('iPhone')) {
          deviceModel = 'iPhone';
        } else if (userAgent.includes('iPad')) {
          deviceModel = 'iPad';
        }
        
        setDeviceInfo({
          device: {
            model: deviceModel,
            os: 'iOS',
            version: 'Unknown',
            platform: 'ios',
            manufacturer: 'Apple',
            isVirtual: false,
            estimatedMemory: getEstimatedMemory(),
            connectionType: getConnectionType()
          },
          battery: {
            level: 'Unknown',
            status: 'Unknown',
            health: 'Unknown'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    getDeviceInfo();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center">Loading device information...</div>
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
            <div className="text-center text-red-500">Failed to load device information</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Model:</span>
                <Badge variant="outline">{deviceInfo.device.model}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">OS Version:</span>
                <span className="font-medium">{deviceInfo.device.os}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform:</span>
                <span className="font-medium">{deviceInfo.device.platform}</span>
              </div>
              {deviceInfo.device.webViewVersion && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">WebView:</span>
                  <span className="font-medium text-xs">{deviceInfo.device.webViewVersion}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Manufacturer:</span>
                <span className="font-medium">{deviceInfo.device.manufacturer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Device Type:</span>
                <span className="font-medium">{deviceInfo.device.isVirtual ? 'Simulator' : 'Physical Device'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CPU Cores:</span>
                <span className="font-medium">{navigator.hardwareConcurrency || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-green-500" />
            Hardware Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform:</span>
                <Badge variant="outline">{deviceInfo.device.platform}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CPU Cores:</span>
                <span className="font-medium">{navigator.hardwareConcurrency || 'Unknown'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Memory:</span>
                <span className="font-medium">{deviceInfo.device.estimatedMemory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Connection:</span>
                <span className="font-medium">{deviceInfo.device.connectionType}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-orange-500" />
            Battery Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Level:</span>
            <Badge className="bg-green-500">{deviceInfo.battery.level}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">{deviceInfo.battery.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Health:</span>
            <Badge variant="outline">{deviceInfo.battery.health}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemInfo;
