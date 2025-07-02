
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
      
      // Try to extract model from user agent or use more specific detection
      if (userAgent.includes('iPhone')) {
        // More specific iPhone model detection could be added here
        // For now, we'll use the model from Device API but with better fallback
        return info.model && info.model !== 'iPhone' ? info.model : 'iPhone (Model detection limited on iOS)';
      }
      return info.model || 'iOS Device';
    }
    
    return info.model || 'Unknown Device';
  };

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        const batteryInfo = await Device.getBatteryInfo();
        
        console.log('Raw Device Info:', info);
        console.log('Raw Battery Info:', batteryInfo);
        
        setDeviceInfo({
          device: {
            model: getDeviceModel(info),
            os: `${info.operatingSystem} ${info.osVersion}`,
            version: info.osVersion || 'Unknown',
            platform: info.platform,
            manufacturer: info.manufacturer || (info.platform === 'ios' ? 'Apple' : 'Unknown'),
            isVirtual: info.isVirtual,
            webViewVersion: info.webViewVersion
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
            isVirtual: false
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
                <span className="font-medium">{(navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Connection:</span>
                <span className="font-medium">{(navigator as any).connection?.effectiveType || 'Unknown'}</span>
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
