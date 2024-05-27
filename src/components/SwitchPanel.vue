<template>
  <div class="device-group">
    <div class="device-group__header">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
          <path
            d="M380-120v-120L240-380v-220q0-33 23.5-56.5T320-680h40l-40 40v-200h80v160h160v-160h80v200l-40-40h40q33 0 56.5 23.5T720-600v220L580-240v120H380Z"
          />
        </svg>

        <span class="ml-4">Switches</span>
      </div>
      <button @click="store.allSwitchesOff()" class="device-group__all-off">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path
            d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-40q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm200-120Z"
          />
        </svg>
      </button>
    </div>
    <div class="device-group__body">
      <button
        v-for="device in switches"
        @click="store.toggleSwitch(device.id)"
        class="toggle"
        :class="(device.isOn && 'toggle-on') || 'toggle-off'"
      >
        <label class="whitespace-pre">{{ device.name }}</label>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SwitchDevice } from '../types';
import store from '../store.js';

interface Props {
  switches: Array<SwitchDevice>;
}

withDefaults(defineProps<Props>(), {
  switches: () => [],
});
</script>
