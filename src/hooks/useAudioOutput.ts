import { useState, useEffect, useCallback } from 'react';

export interface AudioDevice {
    deviceId: string;
    label: string;
    kind: MediaDeviceKind;
}

export function useAudioDevices() {
    const [outputs, setOutputs] = useState<AudioDevice[]>([]);
    const [inputs, setInputs] = useState<AudioDevice[]>([]);
    const [selectedOutputId, setSelectedOutputId] = useState<string>('default');
    const [selectedInputId, setSelectedInputId] = useState<string>('default');

    const refreshDevices = useCallback(async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true }); // Request permissions
            const deviceInfos = await navigator.mediaDevices.enumerateDevices();

            const allOutputs = deviceInfos
                .filter(d => d.kind === 'audiooutput')
                .map(d => ({ deviceId: d.deviceId, label: d.label || 'Speaker', kind: 'audiooutput' as MediaDeviceKind }));

            // Allow ALL outputs, but prioritize Cable Input for selection
            setOutputs(allOutputs);

            const cableOutput = allOutputs.find(d => d.label.toLowerCase().includes('cable input'));
            if (cableOutput) {
                console.log("Auto-selecting Cable Input:", cableOutput.label);
                setSelectedOutputId(cableOutput.deviceId);
            }

            setInputs(deviceInfos
                .filter(d => d.kind === 'audioinput')
                .map(d => ({ deviceId: d.deviceId, label: d.label || 'Microphone', kind: 'audioinput' })));
        } catch (err) {
            console.error('Error enumerating devices:', err);
        }
    }, []);

    useEffect(() => {
        refreshDevices();
        navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
        return () => navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
    }, [refreshDevices]);

    return {
        outputs,
        inputs,
        selectedOutputId,
        setSelectedOutputId,
        selectedInputId,
        setSelectedInputId,
        refreshDevices
    };
}
