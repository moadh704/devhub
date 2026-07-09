import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api, setToken, getStoredToken } from '@/lib/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const bootstrapped = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  async function bootstrap() {
    if (!getStoredToken()) {
      bootstrapped.value = true;
      return;
    }
    try {
      loading.value = true;
      const { user: me } = await api.me();
      user.value = me;
    } catch {
      setToken(null);
      user.value = null;
    } finally {
      loading.value = false;
      bootstrapped.value = true;
    }
  }

  async function register(payload) {
    loading.value = true;
    try {
      const { token, user: u } = await api.register(payload);
      setToken(token);
      user.value = u;
      return u;
    } finally {
      loading.value = false;
    }
  }

  async function login(payload) {
    loading.value = true;
    try {
      const { token, user: u } = await api.login(payload);
      setToken(token);
      user.value = u;
      return u;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    setToken(null);
    user.value = null;
  }

  return {
    user,
    loading,
    bootstrapped,
    isAuthenticated,
    bootstrap,
    register,
    login,
    logout,
  };
});
