<script lang="ts" setup>
withDefaults(
  defineProps<{
    textFieldProps: Record<string, unknown>;
    searchButtonProps?: Record<string, unknown>;
    filterButtonProps?: Record<string, unknown>;
    clearFiltersButtonProps?: Record<string, unknown>;
    filterCount?: number;
  }>(),
  {
    filterCount: 0,
  }
);

const emit = defineEmits<{
  (e: "click:search"): void;
  (e: "clear:filters"): void;
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
        <v-btn v-bind="searchButtonProps" size="small" color="secondary" @click="emit('click:search')"></v-btn>
      </template>
    </v-text-field>
    <v-badge size="x-small" :content="filterCount">
      <v-btn
        prepend-icon="mdi-filter"
        @click="() => (filtersOpen = true)"
        v-bind="filterButtonProps"
        v-if="filterButtonProps || $slots.filters"
      >
        Filters
      </v-btn>
    </v-badge>
    <v-btn
      prepend-icon="mdi-close"
      color="error"
      @click="
        () => {
          search = '';
          emit('clear:filters');
        }
      "
      v-bind="clearFiltersButtonProps"
      v-if="clearFiltersButtonProps || filterButtonProps || $slots.filters"
    >
      Clear
    </v-btn>
  </div>
  <v-navigation-drawer
    v-model="filtersOpen"
    location="right"
    :overlay="true"
    :permanent="false"
    :temporary="true"
    :width="350"
    v-if="filterButtonProps || $slots.filters"
  >
    <v-container>
      <v-row>
        <v-col>
          <h2 class="text-h5">Filters</h2>
        </v-col>
      </v-row>
      <slot name="filters"></slot>
    </v-container>
  </v-navigation-drawer>
</template>

<style scoped></style>
