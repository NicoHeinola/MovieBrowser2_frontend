import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type User from "@/models/user";
import { AuthService } from "@/services/auth.service";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("authToken"));
  const user = ref<User | null>(null); // Or load from storage if persisted
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
      user.value = null;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService().login(username, password);
      setToken(response.token);

      await fetchUser();

      return true;
    } catch (error) {
      console.error("Login failed:", error);

      setToken(null);

      return false;
    }
  };

  async function logout() {
    setToken(null);
    user.value = null;
  }

  async function fetchUser() {
    if (!token.value) return;

    try {
      const userData = await AuthService().fetchCurrentUser();
      user.value = userData;
    } catch (error) {
      console.error("Failed to fetch user:", error);

      setToken(null);
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
});
