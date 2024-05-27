export interface StatusEntry {
  code: string;
  value: any;
}

export interface BaseDevice {
  id: string;
  name: string;
}

export interface LightDevice extends BaseDevice {
  type: 'light';
  isOn: boolean;
  countDown: number;
  workMode: string;
  brightness: number;
  temperature: number;
  color: {
    h: number;
    s: number;
    v: number;
  };
}

export interface SwitchDevice extends BaseDevice {
  type: 'switch';
  isOn: boolean;
  countDown: number;
}

export interface CameraDevice extends BaseDevice {
  type: 'camera';
}

export interface SensorDevice extends BaseDevice {
  type: 'sensor';
}

export type Device = LightDevice | SwitchDevice | CameraDevice | SensorDevice;

export interface Layout {
  id: string;
  name: string;
  deviceIds: string[];
}

export interface State {
  devices: Device[];
  layouts: Layout[];
  lastUpdate: number;

  'device:id': Device;
}
