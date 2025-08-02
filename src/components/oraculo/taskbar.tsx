
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Battery, BatteryCharging, Wifi, WifiOff } from 'lucide-react';
import './taskbar.css';

interface TaskbarProps {
  userName: string;
}

// Extend the Navigator interface to include getBattery
declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
  interface BatteryManager extends EventTarget {
    charging: boolean;
    level: number;
    onchargingchange: (() => void) | null;
    onlevelchange: (() => void) | null;
  }
}

export const Taskbar: React.FC<TaskbarProps> = ({ userName }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [ping, setPing] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(true);

  // Function to get battery color based on level
  const getBatteryColor = (level: number, charging: boolean) => {
    if (charging) return 'text-sky-400';
    if (level > 75) return 'text-green-500';
    if (level > 50) return 'text-yellow-500';
    if (level > 25) return 'text-orange-500';
    return 'text-red-500';
  };

  // Function to get ping color based on latency
  const getPingColor = (latency: number) => {
    if (latency <= 50) return 'text-green-500';
    if (latency <= 100) return 'text-yellow-500';
    if (latency <= 200) return 'text-orange-500';
    return 'text-red-500';
  };

  // Effect for updating time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect for battery status
  useEffect(() => {
    if ('getBattery' in navigator && typeof navigator.getBattery === 'function') {
      let batteryManager: BatteryManager;

      const updateBatteryStatus = (bm: BatteryManager) => {
        setBatteryLevel(Math.round(bm.level * 100));
        setIsCharging(bm.charging);
      };

      navigator.getBattery().then(bm => {
        batteryManager = bm;
        updateBatteryStatus(batteryManager);
        batteryManager.onchargingchange = () => updateBatteryStatus(batteryManager);
        batteryManager.onlevelchange = () => updateBatteryStatus(batteryManager);
      });

      return () => {
        if (batteryManager) {
          batteryManager.onchargingchange = null;
          batteryManager.onlevelchange = null;
        }
      };
    }
  }, []);

  // Effect for ping and online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    const pingInterval = setInterval(() => {
        if (navigator.onLine) {
            // Simulate ping
            setPing(Math.floor(Math.random() * (250 - 10 + 1)) + 10);
        } else {
            setPing(999);
        }
    }, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(pingInterval);
    };
  }, []);

  const BatteryIcon = isCharging ? BatteryCharging : Battery;

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-[36px] bg-black/50 backdrop-blur-md border-b border-primary/20 flex items-center justify-between px-4 font-code text-sm">
      <div className="text-left text-primary text-glow-primary">
        <span>{currentTime}</span>
      </div>
      <div className="text-center text-muted-foreground flex-1">
        <span>Operador: {userName}</span>
      </div>
      <div className="text-right flex items-center gap-4">
         <div className={cn("flex items-center gap-1", isOnline ? getPingColor(ping) : 'text-red-500')}>
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{isOnline ? `${ping}ms` : 'Offline'}</span>
         </div>
         <div className={cn("flex items-center gap-1", getBatteryColor(batteryLevel, isCharging))}>
            <div className="battery-icon">
                <BatteryIcon size={20} className={cn(isCharging && "charging-animation")} />
            </div>
            <span>{batteryLevel}%</span>
         </div>
      </div>
    </header>
  );
};
