import { useState } from './useState.js';
import { useConnector } from './useConnector.js';
import { Device, LightDevice, SwitchDevice, Layout, SensorDevice } from './types.js';

const connector = useConnector();
const { set, get, current } = useState();
const credentials: Record<string, string> = {};

async function fetchAll(type) {
  const url = `https://store.homebots.io/${credentials.storeId}/${type}`;

  try {
    const req = await fetch(url);
    return await req.json();
  } catch {
    return [];
  }
}

const deviceKey = (id) => ('device:' + id) as any;

export function useStore() {
  const actions = {
    get state() {
      return current.value;
    },
    connect(o) {
      Object.assign(credentials, o);
      (window as any).state = {
        get current() {
          return current.value;
        },
        set,
        get,
        actions,
      };
    },

    async init() {
      await actions.refreshAll();
    },

    async toggleDevice(id: string, value?: boolean) {
      const device = actions.getDevice<SwitchDevice | LightDevice>(id);

      if (value === undefined) {
        value = !device.isOn;
      }

      switch (device.type) {
        case 'switch':
          await connector.toggleSwitch(device.id, value);
          break;

        case 'light':
          await connector.switchLed(device.id, value);
          break;
      }

      await set(deviceKey(id), { ...device, isOn: value });
    },

    async toggleSwitch(id: string, value?: boolean) {
      const device = actions.getDevice<SwitchDevice>(id);

      if (value === undefined) {
        value = !device.isOn;
      }

      await connector.toggleSwitch(device.id, value);
      await set(deviceKey(id), <SwitchDevice>{ ...device, isOn: value });
    },

    async toggleLight(id: string, value?: boolean) {
      const device = actions.getDevice<LightDevice>(id);

      if (value === undefined) {
        value = !device.isOn;
      }

      await connector.switchLed(device.id, value);
      await set(deviceKey(id), { ...device, isOn: value });
    },

    async allLightsOff() {
      const devices = actions.getAllOfType<LightDevice>('light');

      for (const dev of devices) {
        if (dev.isOn) {
          await actions.toggleLight(dev.id, false);
        }
      }
    },

    async allSwitchesOff() {
      const devices = actions.getAllOfType<SwitchDevice>('switch');

      for (const dev of devices) {
        if (dev.isOn) {
          await actions.toggleSwitch(dev.id, false);
        }
      }
    },

    toggleRoomSwitches(room: Layout) {
      return actions.toggleRoomDevices(room, 'switch');
    },

    toggleRoomLights(room: Layout) {
      return actions.toggleRoomDevices(room, 'light');
    },

    async toggleRoomDevices<T extends LightDevice | SwitchDevice>(room: Layout, type: T['type']) {
      const devices = actions.getLayoutDevicesOfType<T>(room, type);
      const newState = !devices.some((l) => l.isOn);

      const actionableItems = devices.filter((d) => d.isOn !== newState);

      for (const next of actionableItems) {
        if (next.type === 'light') {
          await actions.toggleLight(next.id, newState);
        }

        if (next.type === 'switch') {
          await actions.toggleSwitch(next.id, newState);
        }
      }
    },

    getLayoutDevicesOfType<T extends Device>(layout: Layout, type: T['type']): T[] {
      return layout.deviceIds
        .map((id) => {
          const d: Device = get(deviceKey(id));
          return d.type === type ? d : null;
        })
        .filter(Boolean) as T[];
    },

    getDevice<T = Device>(id: string): T {
      return get(deviceKey(id)) as T;
    },

    getAllOfType<T extends Device>(type: T['type']): T[] {
      return get('devices')
        .filter((d) => d.type === type)
        .map((d) => actions.getDevice(d.id));
    },

    getLayoutThermostat(layout: Layout): SensorDevice | null {
      const [device] = actions.getLayoutDevicesOfType<SensorDevice>(layout, 'sensor');

      return device || null;
    },

    async refreshDevice(device: Device) {
      const newState = await connector.getState(device);
      await set(deviceKey(device.id), newState);
      return newState;
    },

    async refreshDevices() {
      const list: Device[] = await fetchAll('devices');
      await set(
        'devices',
        list.sort((a, b) => (a.name > b.name ? 1 : -1)),
      );
    },

    async refreshLayouts() {
      return set('layouts', await fetchAll('layouts'));
    },

    async refreshAll() {
      await actions.refreshDevices();
      await actions.refreshLayouts();
      await actions.refreshDeviceStates();
    },

    async refreshDeviceStates() {
      const lastUpdate = Number(get('lastUpdate'));
      const now = Date.now();
      const interval = 1000 * 60 * 2;

      if (now - lastUpdate < interval) {
        return;
      }

      const devices = get('devices');
      for (const dev of devices) {
        await actions.refreshDevice(dev);
      }

      set('lastUpdate', now);
    },
  };

  setInterval(() => {
    actions.refreshDeviceStates();
  }, 1000 * 60 * 5);

  return actions;
}

export default useStore();
