export interface StatusEntry {
  code: string;
  value: any;
}

export interface Room {
  id: string;
  name: string;
}

export interface BaseDevice {
  id: string;
  name: string;
}

export interface LightDevice extends BaseDevice {
  type: "light";
  isOn: boolean;
}

export interface SwitchDevice extends BaseDevice {
  type: "switch";
  isOn: boolean;
  countDown: number;
}

export interface CameraDevice extends BaseDevice {
  type: "camera";
}

export interface SensorDevice extends BaseDevice {
  type: "sensor";
}

export type Device = LightDevice | SwitchDevice | CameraDevice | SensorDevice;

export interface Layout {
  id: string;
  room: string;
  deviceIds: string[];
}
