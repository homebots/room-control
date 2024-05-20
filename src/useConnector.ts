// import tuya from "https://tuya-connector.jsfn.run/index.mjs";
import * as tuya from "./connector.js";
import type { StatusEntry, Device, LightDevice } from "./types.js";

let credentials: Record<string, string> = {};

export function useConnector() {
  const readStateField = (state, field) =>
    state.find((s) => s.code === field)?.value;

  const actions = {
    async getState(device: Partial<Device>) {
      const state: StatusEntry[] = await tuya
        .status("", { deviceId: device.id }, credentials)
        .catch(() => []);

      switch (device.type) {
        case "switch":
          return {
            ...device,
            isOn: !!readStateField(state, "switch_1"),
            countDown: readStateField(state, "countdown_1") | 0,
          };

        case "light":
          return <LightDevice>{
            ...device,
            isOn: !!readStateField(state, "switch_led"),
            countDown: readStateField(state, "countdown_1") | 0,
            workMode: readStateField(state, "work_mode"),
            brightness: readStateField(state, "bright_value_v2") | 0,
            temperature: readStateField(state, "temp_value_v2") | 0,
            color: JSON.parse(readStateField(state, "colour_data_v2") || "{}"),
          };
        default:
          return device;
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
