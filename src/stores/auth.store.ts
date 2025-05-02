import { defineStore } from "pinia";
import { computed } from "vue";
import type User from "@/models/user";
import { AuthService } from "@/services/auth.service";
import { useStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  const token = useStorage<string | null>("authToken", null);
  const user = useStorage<User | null>("authUser", null, undefined, {
    serializer: {
      read: (value) => {
        try {
          return JSON.parse(value);
        } catch (e) {
          return null;
        }
      },
      write: (value) => {
        return JSON.stringify(value);
      },
    },
  });

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => {
    if (!user.value) return false;
    return !!user.value.is_admin;
  });

  const refreshTokenTimeoutId = ref<number | null>(null);

  const setToken = (newToken: string | null) => {
    if (refreshTokenTimeoutId.value) {
      clearTimeout(refreshTokenTimeoutId.value);
      refreshTokenTimeoutId.value = null;
    }

    token.value = newToken;

    if (!newToken) {
      user.value = null;
      return;
    }

    const refreshInterval = 30 * 60 * 1000; // 30 minutes

    refreshTokenTimeoutId.value = setTimeout(async () => {
      await refreshToken();
    }, refreshInterval);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService().login(username, password);
      setToken(response.access_token);

      await fetchUser();

      return true;
    } catch (error) {
      console.error("Login failed:", error);

      setToken(null);

      return false;
    }
  };

  const logout = async () => {
    setToken(null);
    user.value = null;
  };

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const userData = await AuthService().fetchCurrentUser();
      user.value = userData;
    } catch (error) {
      console.error("Failed to fetch user:", error);

      setToken(null);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await AuthService().refreshToken();
      setToken(response.access_token);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setToken(null);
      return false;
    }

    return true;
  };

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUser,
    refreshToken,
  };
});
