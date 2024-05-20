import { useState } from "./useState.js";
import { useConnector } from "./useConnector.js";
import { Device, LightDevice, SwitchDevice } from "./types.js";

const connector = useConnector();
const { set, get } = useState();
const credentials = {};

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
    },

    async init() {
      await actions.refreshAll();
    },

    async toggleSwitch(id: string) {
      const device: SwitchDevice = get(deviceKey(id));
      const value = !device.isOn;

      if (device) {
        await connector.toggleSwitch(device.id, value);
        await set(deviceKey(id), { ...device, isOn: value });
      }
    },

    async toggleLamp(id: string) {
      const device: LightDevice = get(deviceKey(id));
      const value = !device.isOn;

      if (device) {
        await connector.switchLed(device.id, value);
        await set(deviceKey(id), { ...device, isOn: value });
      }
    },

    getDevice(id: string) {
      return get(deviceKey(id));
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
      // await actions.refreshDevices();
      // await actions.refreshLayouts();
      // await actions.refreshRooms();
      // await actions.refreshDeviceStates()
    },

    async refreshDeviceStates() {
      for (const dev of get("devices")) {
        await actions.refreshDevice(dev);
      }
    },
  };

  setInterval(() => {
    actions.refreshDeviceStates();
  }, 1000 * 60 * 5);

  return actions;
}
