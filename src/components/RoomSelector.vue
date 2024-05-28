<template>
  <h2 class="header">Rooms</h2>
  <div class="room-selector toggle-group">
    <button v-for="room in layouts" @click="onSelect(room)" class="toggle toggle-off">{{ room.name }}</button>
  </div>
</template>

<script setup lang="ts">
import { Layout } from '../types';

interface Props {
  layouts: Layout[];
}

defineProps<Props>();
const emit = defineEmits(['select']);

function onSelect(room) {
  emit('select', room);
}
</script>
