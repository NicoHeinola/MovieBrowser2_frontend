<script lang="ts" setup>
import type Show from "@/models/show";
import { rules } from "./show.rules";
import type { VForm } from "vuetify/components";
import { showCategories } from "@/models/showCategory";
import ShowCategoriesAutocomplete from "@/components/show-categories-autocomplete/ShowCategoriesAutocomplete.vue";

const props = defineProps<{}>();

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    image: "",
    categories: [],
  } as Show,
  type: Object as () => Show,
});

const showRules = rules();

const imageSearchUrl = computed(() => {
  const title = `high resolution Cover image for ${show.value.title} show`;

  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(title)}`;
});

const descriptionSearchUrl = computed(() => {
  const title = `simplified description for ${show.value.title} anime show`;

  return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
});

onMounted(() => {
  show.value.categories =
    show.value.categories?.map((c) => {
      return showCategories.find((category) => category.name === c.name) || c;
    }) || [];
});
</script>

<template>
  <v-text-field label="Title*" v-model="show.title" :rules="showRules.title"></v-text-field>
  <v-textarea label="Description" v-model="show.description" :rules="showRules.description"> </v-textarea>
  <v-btn
    class="mb-5 w-100"
    color="primary"
    prepend-icon="mdi-google"
    append-icon="mdi-arrow-right"
    :href="descriptionSearchUrl"
    target="_blank"
    :disabled="!show.title"
  >
    Description Search
  </v-btn>
  <v-text-field label="Image (url)" v-model="show.image" :rules="showRules.image">
    <template #append>
      <v-btn
        color="primary"
        prepend-icon="mdi-google"
        append-icon="mdi-arrow-right"
        :href="imageSearchUrl"
        target="_blank"
        :disabled="!show.title"
      >
        Image Search
      </v-btn>
    </template>
  </v-text-field>
  <show-categories-autocomplete
    v-model="show.categories"
    :items="showCategories"
    item-value="name"
    item-title="title"
    label="Categories"
    multiple
    chips
    clearable
    return-object
  ></show-categories-autocomplete>
</template>
