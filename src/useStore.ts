import { useState } from "./useState.js";
import { useConnector } from "./useConnector.js";
import { Device, LightDevice, SwitchDevice } from "./types.js";

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

const deviceKey = (id) => "device:" + id;

export function useStore() {
  const actions = {
    connect(o) {
      Object.assign(credentials, o);
      (window as any).state = {
        get current() {
          return current.value;
        },
        set,
        get,
      };
    },

    async init() {
      await actions.refreshAll();
    },

    async toggleSwitch(id: string, value?: boolean) {
      const device = actions.getDevice<SwitchDevice>(id);

      if (value === undefined) {
        value = !device.isOn;
      }

      await connector.toggleSwitch(device.id, value);
      await set(deviceKey(id), { ...device, isOn: value });
    },

    async toggleLamp(id: string, value?: boolean) {
      const device = actions.getDevice<LightDevice>(id);

      if (value === undefined) {
        value = !device.isOn;
      }

      await connector.switchLed(device.id, value);
      await set(deviceKey(id), { ...device, isOn: value });
    },

    async allLightsOff() {
      const devices = actions.getAllOfType<LightDevice>("light");

      for (const dev of devices) {
        if (dev.isOn) {
          await actions.toggleLamp(dev.id, false);
        }
      }
    },

    async allSwitchesOff() {
      const devices = actions.getAllOfType<SwitchDevice>("switch");

      for (const dev of devices) {
        if (dev.isOn) {
          await actions.toggleSwitch(dev.id, false);
        }
      }
    },

    getDevice<T = Device>(id: string): T {
      return get(deviceKey(id));
    },

    getAllOfType<T extends Device>(type: T["type"]): T[] {
      return get("devices").filter((d) => d.type === type).map(d => actions.getDevice(d.id));
    },

    async refreshDevice(device: Device) {
      const newState = await connector.getState(device);
      await set(deviceKey(device.id), newState);
      return newState;
    },

    async refreshDevices() {
      return set("devices", await fetchAll("devices"));
    },

    async refreshLayouts() {
      return set("layouts", await fetchAll("layouts"));
    },

    async refreshRooms() {
      return set("rooms", await fetchAll("rooms"));
    },

    async refreshAll() {
      await actions.refreshDevices();
      await actions.refreshLayouts();
      await actions.refreshRooms();
      await actions.refreshDeviceStates();
    },

    async refreshDeviceStates() {
      const devices = get("devices");

      for (const dev of devices) {
        await actions.refreshDevice(dev);
      }
    },
  };

  setInterval(() => {
    actions.refreshDeviceStates();
  }, 1000 * 60 * 5);

  return actions;
}
