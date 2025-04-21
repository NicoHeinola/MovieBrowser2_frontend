<script lang="ts" setup>
import { ref } from "vue";

const open = ref(true);

const links = ref([
  {
    text: "Movies",
    icon: "mdi-movie-search",
    route: "/shows",
  },
  {
    text: "Settings",
    icon: "mdi-cog",
    route: "/settings",
  },
]);

const route = useRoute();

const selectedLink = computed(() => route.path);

const getLinkColor = (route: string) => {
  return selectedLink.value === route ? "secondary" : "";
};
</script>

<template>
  <v-navigation-drawer :model-value="true" location="left">
    <template #prepend>
      <v-list-item
        class="pa-2"
        link
        v-for="link in links"
        :key="link.text"
        :class="{ 'active-link': selectedLink === link.route }"
        :to="link.route"
        :color="getLinkColor(link.route)"
      >
        <template v-slot:prepend>
          <v-icon :icon="link.icon"></v-icon>
        </template>

        <v-list-item-title v-text="link.text"></v-list-item-title>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
