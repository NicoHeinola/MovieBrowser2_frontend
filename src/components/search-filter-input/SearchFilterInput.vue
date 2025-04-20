<script lang="ts" setup>
defineProps<{
  textFieldProps: Record<string, unknown>;
  searchButtonProps?: Record<string, unknown>;
  filterButtonProps?: Record<string, unknown>;
}>();

const emit = defineEmits<{
  (e: "click:search"): void;
}>();

const search = defineModel<string>("search", {
  default: "",
  type: String,
});

const filtersOpen = defineModel<boolean>("filtersOpen", {
  default: false,
  type: Boolean,
});
</script>

<template>
  <div class="d-flex align-center ga-2" v-bind="$attrs">
    <v-text-field v-model="search" v-bind="textFieldProps">
      <template #append-inner v-if="searchButtonProps">
        <v-btn v-bind="searchButtonProps" @click="emit('click:search')"></v-btn>
      </template>
    </v-text-field>
    <v-btn
      text="Filters"
      @click="() => (filtersOpen = true)"
      v-bind="filterButtonProps"
      v-if="filterButtonProps"
    ></v-btn>
  </div>
  <v-navigation-drawer
    v-model="filtersOpen"
    location="right"
    :overlay="true"
    :permanent="false"
    :temporary="true"
    v-if="filterButtonProps"
  >
    <v-container>
      <slot name="filters"></slot>
    </v-container>
  </v-navigation-drawer>
</template>

<style scoped></style>
