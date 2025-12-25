import React from 'react';
import { AudioDevice } from '../hooks/useAudioOutput';

interface DeviceSelectorProps {
    devices: AudioDevice[];
    selectedDeviceId: string;
    onDeviceSelect: (deviceId: string) => void;
    label: string;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
    devices,
    selectedDeviceId,
    onDeviceSelect,
    label,
}) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-xs text-gray-400 font-medium ml-1">{label}</label>
            <select
                value={selectedDeviceId}
                onChange={(e) => onDeviceSelect(e.target.value)}
                className="
          w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2
          border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
          overflow-hidden text-ellipsis
        "
            >
                {devices.length === 0 && <option value="default">Default Device</option>}
                {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                    </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
                To play through mic, you need <a href="#" onClick={(e) => { e.preventDefault(); window.open('https://vb-audio.com/Cable/', '_blank'); }} className="text-blue-400 hover:underline">VB-Cable</a> installed.
            </p>
        </div>
    );
};
