<script lang="ts" setup>
import type { VForm } from "vuetify/components";
import { rules } from "./episode.rules";
import { EpisodeType, episodeTypeItems } from "@/models/episode"; // import enum

const props = defineProps<{
  blacklistedEpisodeNumbers: number[];
}>();

const episode = defineModel("episode", {
  default: {
    title: "",
    description: "",
    number: undefined,
    type: EpisodeType.Episode,
  },
  type: Object as () => any,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

const episodeRules = computed(() => rules(undefined, props.blacklistedEpisodeNumbers));

defineExpose({
  formRef,
});
</script>

<template>
  <v-form ref="formRef" flat>
    <v-text-field label="Title" v-model="episode.title" :rules="episodeRules.title"></v-text-field>
    <v-text-field label="Number*" v-model="episode.number" :rules="episodeRules.number" type="number"></v-text-field>
    <v-select label="Type" v-model="episode.type" :items="episodeTypeItems" item-value="value" required>
      <template #item="{ item, props }">
        <v-list-item v-bind="props" title="">
          <v-list-item-title class="d-flex align-center ga-2">
            <v-icon size="15" :icon="item.raw.icon"></v-icon>
            {{ item.raw.title }}
          </v-list-item-title>
        </v-list-item>
      </template>
      <template #selection="{ item }">
        <v-icon size="15" :icon="item.raw.icon" class="me-2"></v-icon>
        {{ item.raw.title }}
      </template>
    </v-select>
    <v-textarea label="Description" v-model="episode.description" :rules="episodeRules.description"></v-textarea>
  </v-form>
</template>
