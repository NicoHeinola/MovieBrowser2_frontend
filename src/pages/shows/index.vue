<script lang="ts" setup>
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import ShowCard from "@/components/show-card/ShowCard.vue";
import ShowFormDialog from "@/components/show-form-dialog/ShowFormDialog.vue";

const search = ref<string>("");

const addShowDialogOpen = ref<boolean>(false);
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center ga-12 pa-12">
    <div class="d-flex flex-column w-100 ga-4">
      <h1 class="text-h2 text-center">Movies</h1>
      <div class="d-flex align-center ga-2">
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
          class="flex-1-1-100"
        ></search-filter-input>
        <v-btn prepend-icon="mdi-plus" color="primary" @click="addShowDialogOpen = true">Add</v-btn>
      </div>
    </div>
    <v-row>
      <v-col cols="4" v-for="i in 10" :key="i" class="d-flex align-center justify-center">
        <show-card></show-card>
      </v-col>
    </v-row>
  </v-container>
  <show-form-dialog v-model:open="addShowDialogOpen"></show-form-dialog>
</template>
