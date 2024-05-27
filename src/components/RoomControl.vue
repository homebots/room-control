<template>
  <div class="room">
    <button @click="onSelectRoom()" class="room__header">{{ layout.name }}</button>
    <div class="room__toggle-group">
      <button @click="store.toggleRoomSwitches(layout)" class="room__toggle">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
          <path
            d="M380-120v-120L240-380v-220q0-33 23.5-56.5T320-680h40l-40 40v-200h80v160h160v-160h80v200l-40-40h40q33 0 56.5 23.5T720-600v220L580-240v120H380Z"
          />
        </svg>
        <span>Switches</span>
      </button>
      <button @click="store.toggleRoomLights(layout)" class="room__toggle">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 -960 960 960" fill="currentColor">
          <path
            d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z"
          />
        </svg>
        <span>Lights</span>
      </button>
    </div>
    <LightPanel :lights="lights"></LightPanel>
    <SwitchPanel :switches="switches"></SwitchPanel>
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
const lights = computed(() => store.getLayoutDevicesOfType(props.layout, 'light'));
const switches = computed(() => store.getLayoutDevicesOfType(props.layout, 'switch'));

function onSelectRoom() {
  emit('select');
}
</script>
