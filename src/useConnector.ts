// import tuya from "https://tuya-connector.jsfn.run/index.mjs";
import * as tuya from "./connector.js";
import type { StatusEntry, Device } from "./types.js";

let credentials: Record<string, string> = {};

export function useConnector() {
  const actions = {
    async getState(device: Partial<Device>) {
      const state: StatusEntry[] = await tuya
        .status("", { deviceId: device.id }, credentials)
        .catch(() => []);

      switch (device.type) {
        case "switch":
          return {
            ...device,
            isOn: !!state.find((s) => s.code === "switch_1")?.value,
            countDown: state.find((s) => s.code === "countdown_1")?.value | 0,
          };
      }
    },
    async toggleSwitch(deviceId: string, value: boolean) {
      return tuya.switchSet("", { deviceId, value }, credentials);
    },
    async switchLed(deviceId: string, value: boolean) {
      return tuya.switchLed("", { deviceId, value }, credentials);
    },
    async connect(creds: Record<string, string>) {
      credentials = creds;
    },
  };

  return actions;
}
