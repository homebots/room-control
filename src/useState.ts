import StateApi from 'https://state.api.apphor.de/index.mjs';
import { computed, ref } from 'vue';
import type { State } from './types';

const events = new EventTarget();
const current = ref<State>();
let state: {
  id: string;
  current: State;
  addEventListener: any;
  set: any;
  get: any;
  remove: any;
};

async function connect(stateId: string) {
  state = await StateApi.get(stateId || localStorage.stateId);
  localStorage.stateId = state.id;
  current.value = state.current;

  state.addEventListener('change', (c) => {
    current.value = state.current;
    events.dispatchEvent(new CustomEvent('change', { detail: c.detail }));
  });

  return state.id;
}

export function useState() {
  return {
    events,
    current,
    connect,

    select(p) {
      return computed(() => current.value[p]);
    },

    get<K extends keyof State>(p: K): State[K] {
      return state.current[p];
    },
    set<K extends keyof State>(p: K, v: State[K]) {
      return state.set(p, v);
    },
    remove(p: keyof State) {
      return state.remove(p);
    },
  };
}
