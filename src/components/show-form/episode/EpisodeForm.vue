<script lang="ts" setup>
import type { VForm } from "vuetify/components";
import { rules } from "./episode.rules";

const props = defineProps<{
  blacklistedEpisodeNumbers: number[];
}>();

const episode = defineModel("episode", {
  default: {
    title: "",
    description: "",
    number: undefined,
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
    <v-textarea label="Description" v-model="episode.description" :rules="episodeRules.description"></v-textarea>
  </v-form>
</template>
