<script lang="ts" setup>
import type Show from "@/models/show";
import { rules } from "./show.rules";
import type { VForm } from "vuetify/components";

const props = defineProps<{}>();

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    image: "",
  } as Show,
  type: Object as () => Show,
});

const showRules = rules();

const imageSearchUrl = computed(() => {
  const title = `high resolution Cover image for ${show.value.title} show`;

  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(title)}`;
});
</script>

<template>
  <v-text-field label="Title*" v-model="show.title" :rules="showRules.title"></v-text-field>
  <v-textarea label="Description" v-model="show.description" :rules="showRules.description"></v-textarea>
  <v-text-field label="Image (url)" v-model="show.image" :rules="showRules.image">
    <template #append>
      <v-btn
        color="secondary"
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
</template>
