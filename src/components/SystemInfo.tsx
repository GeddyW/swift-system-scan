
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Smartphone, Cpu, HardDrive, Wifi, Battery } from 'lucide-react';

const SystemInfo = () => {
  const systemData = {
    device: {
      model: 'iPhone 15 Pro',
      os: 'iOS 17.1',
      version: '21B74',
      storage: '256 GB'
    },
    hardware: {
      processor: 'A17 Pro',
      cores: navigator.hardwareConcurrency || 6,
      memory: '8 GB',
      gpu: 'A17 Pro GPU'
    },
    network: {
      type: 'WiFi',
      strength: 'Excellent',
      ip: '192.168.1.100'
    },
    battery: {
      level: '87%',
      status: 'Not Charging',
      health: 'Good'
    }
  };

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
                <Badge variant="outline">{systemData.device.model}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">OS Version:</span>
                <span className="font-medium">{systemData.device.os}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Build:</span>
                <span className="font-medium">{systemData.device.version}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage:</span>
                <span className="font-medium">{systemData.device.storage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Memory:</span>
                <span className="font-medium">{systemData.hardware.memory}</span>
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
                <span className="text-gray-600">Processor:</span>
                <Badge variant="outline">{systemData.hardware.processor}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CPU Cores:</span>
                <span className="font-medium">{systemData.hardware.cores}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Graphics:</span>
                <span className="font-medium">{systemData.hardware.gpu}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">RAM:</span>
                <span className="font-medium">{systemData.hardware.memory}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-purple-500" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Connection:</span>
              <Badge variant="outline">{systemData.network.type}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Signal:</span>
              <Badge className="bg-green-500">{systemData.network.strength}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">IP Address:</span>
              <span className="font-medium text-sm">{systemData.network.ip}</span>
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
              <Badge className="bg-green-500">{systemData.battery.level}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">{systemData.battery.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Health:</span>
              <Badge variant="outline">{systemData.battery.health}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemInfo;
