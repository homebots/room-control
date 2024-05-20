import { onMounted, ref } from "vue";
import {
  getPropertyNS,
  setPropertyNS,
  setNS,
  getProfile,
  signIn,
  signOut,
  events,
} from "https://auth.api.apphor.de/index.mjs";

interface Profile {
  id: string;
  name: string;
  photo: string;
}

const isLoggedIn = ref(true);
const user = ref<Profile>();

export function useAuth() {
  onMounted(async () => {
    setNS("tuya");
    const update = async () => {
      user.value = await getProfile();
      isLoggedIn.value = !!user.value;
    };

    events.addEventListener("signin", update);
    events.addEventListener("signout", () => (isLoggedIn.value = false));
    update();
  });

  return {
    isLoggedIn,
    user,
    signIn: () => signIn(true),
    signOut,
    getProperty: (p) => getPropertyNS(p),
    setProperty: (p, v) => setPropertyNS(p, v),
  };
}
