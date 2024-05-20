import State from "https://state.api.apphor.de/index.mjs";
import { computed, ref } from "vue";

const events = new EventTarget();
const current = ref<any>();
let state: any;

async function connect(stateId: string) {
  state = await State.get(stateId || localStorage.stateId);
  localStorage.stateId = state.id;
  current.value = state.current;

  state.addEventListener("change", (c) => {
    current.value = c.detail;
    events.dispatchEvent(new CustomEvent("change", { detail: c.detail }));
  });

  return state.id;
}

export function useState() {
  return {
    events,
    current,
    connect,

    select(p: string) {
      return computed(() => current.value[p]);
    },

    get(p: string) {
      return state.current[p];
    },

    set<T>(p: string, v: T) {
      return state.set(p, v);
    },

    remove(p: string) {
      return state.remove(p);
    },
  };
}
