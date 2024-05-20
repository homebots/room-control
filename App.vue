<template>
  <main
    class="flex flex-col h-screen w-screen"
    :class="!user && 'justify-center'"
  >
    <template v-if="user">
      <header class="card user-card">
        <img :src="user.photo" class="w-8 h-8 rounded-full mr-4" />
        <span class="font-bold">{{ user.name }}</span>
      </header>
      <article class="flex-1 overflow-auto" v-if="state">
        <div class="device-group">
          <div class="device-group__header">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="white"
              >
                <path
                  d="M380-120v-120L240-380v-220q0-33 23.5-56.5T320-680h40l-40 40v-200h80v160h160v-160h80v200l-40-40h40q33 0 56.5 23.5T720-600v220L580-240v120H380Z"
                />
              </svg>

              <span class="ml-4">Switches</span>
            </div>
            <button
              @click="store.allSwitchesOff()"
              class="p-2 bg-white rounded-full w-10 h-10 text-primary flex items-center justify-center"
            >
              <svg
                fill="current"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
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
              <label class="ml-4 whitespace-pre">{{ device.name }}</label>
            </button>
          </div>
        </div>

        <div class="device-group">
          <div class="device-group__header">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 -960 960 960"
                fill="white"
              >
                <path
                  d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z"
                />
              </svg>
              <span class="ml-4">Lights</span>
            </div>
            <button
              @click="store.allLightsOff()"
              class="p-2 bg-white rounded-full w-10 h-10 text-primary flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="16"
                viewBox="0 -960 960 960"
                fill="current"
              >
                <path
                  d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm0-720q-44 0-81.5 15.5T332-742l-58-56q41-38 93.5-60T480-880q125 0 212.5 87.5T780-580q0 71-25 121.5T698-376l-56-56q21-23 39.5-59t18.5-89q0-92-64-156t-156-64Zm368 688-57 57-265-265H330q-69-41-109.5-110T180-580q0-20 2.5-39t7.5-37L56-792l56-56 736 736ZM354-400h92L260-586v6q0 54 24.5 101t69.5 79Zm-6-98Zm134-94Zm164 312v80H320v-80h326Z"
                />
              </svg>
            </button>
          </div>
          <div class="device-group__body">
            <button
              v-for="device in lights"
              @click="store.toggleLamp(device.id)"
              class="toggle"
              :class="(device.isOn && 'toggle-on') || 'toggle-off'"
            >
              <label class="ml-4 whitespace-pre">{{ device.name }}</label>
            </button>
          </div>
        </div>
      </article>
    </template>
    <div class="flex items-center justify-center w-full" v-else>
      <button class="btn btn-primary" @click="signIn()">
        Sign in to continue
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAuth } from "./src/useAuth.js";
import { useState } from "./src/useState.js";
import { useStore } from "./src/useStore.js";
import { useConnector } from "./src/useConnector.js";

const { user, signIn, getProperty, setProperty } = useAuth();
const { connect: connectState, current: state } = useState();
const { connect: connectTuya } = useConnector();
const store = useStore();

const switches = computed(() =>
  (state.value.devices || [])
    .filter((d) => d.type === "switch")
    .map((d) => ({
      ...d,
      ...store.getDevice(d.id),
    }))
);

const lights = computed(() =>
  (state.value.devices || [])
    .filter((d) => d.type === "light")
    .map((d) => ({
      ...d,
      ...store.getDevice(d.id),
    }))
);

onMounted(async () => {
  const clientId = await getProperty("clientId");
  const clientSecret = await getProperty("clientSecret");
  const userCode = await getProperty("userCode");
  const storeId = await getProperty("storeId");
  const stateId = await getProperty("stateId");

  await connectTuya({ clientId, clientSecret, userCode, storeId });
  const newId = await connectState(stateId);
  store.connect({ storeId });

  if (!stateId) {
    setProperty("stateId", newId);
  }

  await store.init();
});
</script>
