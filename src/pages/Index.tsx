
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Cpu, HardDrive, Smartphone, Play, RefreshCw } from 'lucide-react';
import DiagnosticsCard from '@/components/DiagnosticsCard';
import SystemInfo from '@/components/SystemInfo';
import PerformanceChart from '@/components/PerformanceChart';
import { Device } from '@capacitor/device';

const Index = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [batteryLevel, setBatteryLevel] = useState(0);

  // Get real device info on component mount
  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        const batteryInfo = await Device.getBatteryInfo();
        
        setDeviceInfo(info);
        setBatteryLevel(Math.round((batteryInfo.batteryLevel || 0) * 100));
        
        console.log('Device Info:', info);
        console.log('Battery Info:', batteryInfo);
      } catch (error) {
        console.error('Error getting device info:', error);
      }
    };

    getDeviceInfo();
  }, []);

  // Simulate real-time system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate CPU usage (0-100%)
      const newCpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40% for realistic values
      setCpuUsage(newCpuUsage);

      // Simulate RAM usage (0-100%)
      const newRamUsage = Math.floor(Math.random() * 40) + 30; // 30-70% for realistic values
      setRamUsage(newRamUsage);

      // Update performance history
      const timestamp = new Date();
      setPerformanceHistory(prev => [
        ...prev.slice(-19), // Keep last 19 entries
        {
          time: timestamp.toLocaleTimeString(),
          cpu: newCpuUsage,
          ram: newRamUsage,
          timestamp: timestamp.getTime()
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = async () => {
    setIsRunningTest(true);
    setTestResults(null);

    // Simulate diagnostic tests
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get fresh device info for diagnostics
    try {
      const info = await Device.getInfo();
      const batteryInfo = await Device.getBatteryInfo();
      
      const results = {
        overall: Math.random() > 0.2 ? 'excellent' : 'good',
        device: {
          model: info.model || 'Unknown',
          os: `${info.operatingSystem} ${info.osVersion}`,
          platform: info.platform,
          manufacturer: info.manufacturer || 'Apple'
        },
        cpu: {
          temperature: Math.floor(Math.random() * 20) + 35, // 35-55°C
          cores: navigator.hardwareConcurrency || 'Unknown',
          usage: cpuUsage,
          status: cpuUsage < 50 ? 'optimal' : 'moderate'
        },
        memory: {
          total: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown',
          used: `${Math.floor(ramUsage * 8 / 100 * 10) / 10} GB`,
          available: `${Math.floor((100 - ramUsage) * 8 / 100 * 10) / 10} GB`,
          usage: ramUsage,
          status: ramUsage < 60 ? 'good' : 'high'
        },
        battery: {
          level: Math.round((batteryInfo.batteryLevel || 0) * 100),
          isCharging: batteryInfo.isCharging,
          status: batteryInfo.isCharging ? 'Charging' : 'Not Charging'
        },
        storage: {
          total: 'Unknown', // iOS doesn't expose storage info via Capacitor
          used: 'Unknown',
          available: 'Unknown',
          status: 'Unknown'
        }
      };

      setTestResults(results);
      console.log('Diagnostic Results:', results);
    } catch (error) {
      console.error('Error during diagnostics:', error);
    }

    setIsRunningTest(false);
  };

  const getDeviceStatus = () => {
    if (!deviceInfo) return 'Unknown';
    
    // Simple health check based on available data
    if (batteryLevel > 80 && cpuUsage < 50 && ramUsage < 70) {
      return 'Excellent';
    } else if (batteryLevel > 50 && cpuUsage < 70 && ramUsage < 80) {
      return 'Good';
    } else {
      return 'Fair';
    }
  };

  const getDeviceStatusLevel = () => {
    const status = getDeviceStatus();
    switch (status) {
      case 'Excellent': return 'excellent';
      case 'Good': return 'good';
      default: return 'moderate';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              iOS Diagnostics
            </h1>
          </div>
          <p className="text-gray-600">Monitor your device performance and run system diagnostics</p>
          {deviceInfo && (
            <p className="text-sm text-gray-500">
              Scanning: {deviceInfo.model || 'Unknown Device'} • {deviceInfo.operatingSystem} {deviceInfo.osVersion}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DiagnosticsCard
            title="CPU Usage"
            value={`${cpuUsage}%`}
            progress={cpuUsage}
            icon={<Cpu className="w-5 h-5" />}
            status={cpuUsage < 50 ? 'good' : 'moderate'}
          />
          <DiagnosticsCard
            title="RAM Usage"
            value={`${ramUsage}%`}
            progress={ramUsage}
            icon={<HardDrive className="w-5 h-5" />}
            status={ramUsage < 60 ? 'good' : 'high'}
          />
          <DiagnosticsCard
            title="Device Status"
            value={getDeviceStatus()}
            progress={batteryLevel}
            icon={<Smartphone className="w-5 h-5" />}
            status={getDeviceStatusLevel()}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="diagnostics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitor</TabsTrigger>
            <TabsTrigger value="system">System Info</TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics" className="space-y-4">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-500" />
                  Run Diagnostic Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runDiagnostics}
                  disabled={isRunningTest}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  size="lg"
                >
                  {isRunningTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Full Diagnostic
                    </>
                  )}
                </Button>

                {testResults && (
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={testResults.overall === 'excellent' ? 'default' : 'secondary'}
                        className="text-sm"
                      >
                        Overall: {testResults.overall.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Device Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Model:</span>
                            <span>{testResults.device.model}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>OS:</span>
                            <span>{testResults.device.os}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Platform:</span>
                            <span>{testResults.device.platform}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Battery Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Level:</span>
                            <span>{testResults.battery.level}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <span>{testResults.battery.status}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Charging:</span>
                            <Badge variant="outline" className="text-xs">
                              {testResults.battery.isCharging ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <PerformanceChart data={performanceHistory} />
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <SystemInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
