<script lang="ts" setup>
import type { VForm } from "vuetify/components";
import { allowedFileTypes, rules } from "./episode.rules";
import { EpisodeType, episodeTypeItems } from "@/models/episode"; // import enum
import type Episode from "@/models/episode";

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
  type: Object as () => Episode,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

const episodeRules = computed(() => rules(undefined, props.blacklistedEpisodeNumbers));

const handleFileInput = (files: File[] | File | null) => {
  if (Array.isArray(files)) {
    episode.value.file = files.length > 0 ? files[0] : null;
  } else {
    episode.value.file = files;
  }

  episode.value.filename = episode.value.file.name;
};

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
    <v-file-input
      label="Video file"
      :model-value="episode.file"
      @update:model-value="handleFileInput"
      :rules="episodeRules.file"
      chips
      clearable
      :accept="Object.values(allowedFileTypes).join(',')"
      show-size
      persistent-hint
      :hint="'Filename: ' + (episode.filename || 'No file has been uploaded')"
    >
      <template #selection> {{ episode.filename }} </template>
    </v-file-input>
    <v-textarea label="Description" v-model="episode.description" :rules="episodeRules.description"></v-textarea>
  </v-form>
</template>
