<template>
  <main class="flex flex-col h-screen w-screen" :class="!user && 'justify-center'">
    <template v-if="user">
      <header class="card user-card">
        <img :src="user.photo" class="w-8 h-8 rounded-full mr-4" />
        <span class="font-bold">{{ user.name }}</span>
      </header>
      <article class="flex-1 overflow-auto relative" v-if="state">
        <template v-if="!currentRoom"
          ><RoomControl
            v-for="room in layouts"
            :layout="room"
            :key="room.id"
            @select="currentRoom = room"
          ></RoomControl>
          <SwitchPanel :switches="switches"></SwitchPanel>
          <LightPanel :lights="lights"></LightPanel>
        </template>

        <RoomControl v-if="currentRoom" @select="currentRoom = null" :layout="currentRoom"></RoomControl>
      </article>
    </template>
    <div class="flex items-center justify-center w-full" v-else>
      <button class="btn btn-primary" @click="signIn()">Sign in to continue</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuth } from './src/useAuth.js';
import { useState } from './src/useState.js';
import { useConnector } from './src/useConnector.js';
import store from './src/store.js';
import LightPanel from './src/components/LightPanel.vue';
import SwitchPanel from './src/components/SwitchPanel.vue';
import RoomControl from './src/components/RoomControl.vue';
import type { Layout } from './src/types';

const { user, signIn, getProperty, setProperty } = useAuth();
const { connect: connectState, current: state } = useState();
const { connect: connectTuya } = useConnector();

const switches = computed(() =>
  (state.value.devices || [])
    .filter((d) => d.type === 'switch')
    .map((d) => ({
      ...d,
      ...store.getDevice(d.id),
    })),
);

const lights = computed(() =>
  (state.value.devices || [])
    .filter((d) => d.type === 'light')
    .map((d) => ({
      ...d,
      ...store.getDevice(d.id),
    })),
);

const layouts = computed(() => state.value.layouts);
const currentRoom = ref<Layout | null>(null);

onMounted(async () => {
  const clientId = await getProperty('clientId');
  const clientSecret = await getProperty('clientSecret');
  const userCode = await getProperty('userCode');
  const storeId = await getProperty('storeId');
  const stateId = await getProperty('stateId');

  await connectTuya({ clientId, clientSecret, userCode, storeId });
  const newId = await connectState(stateId);
  store.connect({ storeId });

  if (!stateId) {
    setProperty('stateId', newId);
  }

  await store.init();
});
</script>
