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
    current.value = state.current;
    events.dispatchEvent(new CustomEvent("change", { detail: c.detail }));
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

    get(p) {
      return state.current[p];
    },
    set(p, v) {
      return state.set(p, v);
    },
    remove(p) {
      return state.remove(p);
    },
  };
}
