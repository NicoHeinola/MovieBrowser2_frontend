<script lang="ts" setup>
import { ref, computed } from "vue";
import allMdiIcons from "@/assets/mdi-icons.json";

const selectedIcon = defineModel("default", {
  type: String,
  default: "",
});

const availableIcons = computed(() => allMdiIcons);

const search = ref("");

const filteredItems = computed(() => {
  const searchTerm = search.value?.toLowerCase() || "";
  if (!searchTerm) {
    return availableIcons.value.slice(0, 100);
  }

  return availableIcons.value.filter((icon) => icon.toLowerCase().includes(searchTerm)).slice(0, 100);
});
</script>

<template>
  <v-autocomplete
    v-model="selectedIcon"
    :items="filteredItems"
    :search="search"
    @update:search="search = $event"
    item-title="toString()"
    item-value="toString()"
    clearable
    variant="outlined"
    density="compact"
    label="Select Icon"
    placeholder="Search for an icon..."
    v-bind="$attrs"
    no-filter
  >
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" :title="item.raw" density="compact">
        <template v-slot:prepend>
          <v-icon :icon="item.raw" class="mr-2"></v-icon>
        </template>
      </v-list-item>
    </template>

    <template v-slot:selection="{ item }">
      <v-icon :icon="item.raw" start size="small"></v-icon>
      <span class="ml-1 text-body-2">{{ item.raw }}</span>
    </template>

    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No icons matching
          <strong>{{ search }}</strong>
          .
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
