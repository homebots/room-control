<template>
  <div class="room">
    <button @click="onSelectRoom()" class="header room__header">{{ layout.name }}</button>
    <div class="room__body">
      <div class="room__toggle-group">
        <button @click="store.toggleRoomLights(layout)" class="room__toggle" v-if="lights.length">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960" fill="currentColor">
            <path
              d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z"
            />
          </svg>
          <span>Lights</span>
        </button>

        <button @click="store.toggleRoomSwitches(layout)" class="room__toggle" v-if="switches.length">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
            <path
              d="M380-120v-120L240-380v-220q0-33 23.5-56.5T320-680h40l-40 40v-200h80v160h160v-160h80v200l-40-40h40q33 0 56.5 23.5T720-600v220L580-240v120H380Z"
            />
          </svg>
          <span>Switches</span>
        </button>

        <div class="room__toggle" v-if="thermostat">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
            <path
              d="M480-80q-83 0-141.5-58.5T280-280q0-48 21-89.5t59-70.5v-320q0-50 35-85t85-35q50 0 85 35t35 85v320q38 29 59 70.5t21 89.5q0 83-58.5 141.5T480-80Zm-40-440h80v-40h-40v-40h40v-80h-40v-40h40v-40q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240Z"
            />
          </svg>

          <span class="whitespace-pre">{{ thermostat.temperature }} C / {{ thermostat.humidity }} %</span>
        </div>
      </div>
      <div class="room__switches">
        <LightPanel :lights="lights"></LightPanel>
        <SwitchPanel :switches="switches"></SwitchPanel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LightPanel from './LightPanel.vue';
import SwitchPanel from './SwitchPanel.vue';
import store from '../store.js';
import { computed } from 'vue';
import type { Layout } from '../types';

interface Props {
  layout: Layout;
}

const props = defineProps<Props>();
const emit = defineEmits(['select']);
const lights = computed(() => store.state && store.getLayoutDevicesOfType(props.layout, 'light'));
const switches = computed(() => store.state && store.getLayoutDevicesOfType(props.layout, 'switch'));
const thermostat = computed(() => store.getLayoutThermostat(props.layout));

function onSelectRoom() {
  emit('select');
}
</script>
