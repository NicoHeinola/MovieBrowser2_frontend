<script lang="ts" setup>
import { rules } from "./season.rules";
import type { VForm } from "vuetify/components";
import type Season from "@/models/season";

const props = defineProps<{
  blacklistedSeasonNumbers: number[];
}>();

const season = defineModel("season", {
  default: {
    title: "",
    description: "",
    image: "",
  } as Season,
  type: Object as () => Season,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

const seasonRules = computed(() => rules(undefined, props.blacklistedSeasonNumbers));

const imageSearchUrl = computed(() => {
  const title = `high resolution Cover image for ${season.value.title} show`;

  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(title)}`;
});

defineExpose({
  formRef,
});
</script>

<template>
  <v-form ref="formRef" flat>
    <v-text-field label="Title" v-model="season.title" :rules="seasonRules.title"></v-text-field>
    <v-text-field label="Number*" v-model="season.number" :rules="seasonRules.number" type="number"></v-text-field>
    <v-textarea label="Description" v-model="season.description" :rules="seasonRules.description"></v-textarea>
    <v-text-field label="Image (url)" v-model="season.image" :rules="seasonRules.image">
      <template #append>
        <v-btn
          color="secondary"
          prepend-icon="mdi-google"
          append-icon="mdi-arrow-right"
          :href="imageSearchUrl"
          target="_blank"
          :disabled="!season.title"
        >
          Image Search
        </v-btn>
      </template>
    </v-text-field>
  </v-form>
</template>
