<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useConfirm } from "../use-dialog/confirm/useConfirm";

const links = ref([
  {
    text: "Movies",
    icon: "mdi-movie-search",
    route: "/shows",
    authenticated: true,
  },
  {
    text: "Websites",
    icon: "mdi-web",
    route: "/websites",
    authenticated: true,
  },
  {
    text: "Settings",
    icon: "mdi-cog",
    route: "/settings",
    admin_only: true,
  },
]);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const openConfirm = useConfirm();

const selectedLink = computed(() => route.path);

const getLinkColor = (route: string) => {
  return selectedLink.value === route ? "secondary" : "";
};

const logout = async () => {
  const ok = await openConfirm({
    props: {
      text: "Do you want to logout?",
    },
  });

  if (!ok) {
    return;
  }

  authStore.logout();
  router.push("/auth/login");
};

const login = () => {
  router.push("/auth/login");
};

const register = () => {
  router.push("/auth/register");
};

const canViewLink = (link: any) => {
  if (link.admin_only && !authStore.isAdmin) {
    return false;
  }

  if (link.authenticated && !authStore.isAuthenticated) {
    return false;
  }

  return true;
};
</script>

<template>
  <v-navigation-drawer :model-value="true" location="left">
    <template #prepend>
      <template v-for="link in links" :key="link.text">
        <v-list-item
          class="pa-2"
          link
          :class="{ 'active-link': selectedLink === link.route }"
          :to="link.route"
          :color="getLinkColor(link.route)"
          v-if="canViewLink(link)"
        >
          <template v-slot:prepend>
            <v-icon :icon="link.icon"></v-icon>
          </template>

          <v-list-item-title v-text="link.text"></v-list-item-title>
        </v-list-item>
      </template>
    </template>
    <template #append>
      <v-list-item v-if="authStore.isAuthenticated" link @click="logout">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout"></v-icon>
        </template>

        <v-list-item-title>Logout ({{ authStore.user?.username ?? "Unknown" }})</v-list-item-title>
      </v-list-item>
      <template v-else>
        <v-list-item link @click="login">
          <template v-slot:prepend>
            <v-icon icon="mdi-login"></v-icon>
          </template>

          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="register">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-plus"></v-icon>
          </template>

          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
      </template>
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
