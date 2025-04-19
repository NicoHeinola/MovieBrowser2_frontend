<script lang="ts" setup>
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import ShowCard from "@/components/show-card/ShowCard.vue";

const search = ref<string>("");
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center ga-4">
    <div class="d-flex flex-column w-100 ga-4">
      <h1 class="text-h1 text-center">Movies</h1>
      <search-filter-input
        v-model:search="search"
        :text-field-props="{
          label: 'Search Movies',
          'hide-details': true,
        }"
        :search-button-props="{
          icon: 'mdi-magnify',
          variant: 'text',
        }"
      ></search-filter-input>
    </div>
    <v-row class="gx-4">
      <v-col cols="4" v-for="i in 10" :key="i">
        <show-card></show-card>
      </v-col>
    </v-row>
  </v-container>
</template>
