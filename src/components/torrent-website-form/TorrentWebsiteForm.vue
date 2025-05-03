<script lang="ts" setup>
import type TorrentWebsite from "@/models/torrentWebsite";
import type { VForm } from "vuetify/components";
import { torrentWebsiteRules } from "./torrentWebsite.rules";
import IconsAutocomplete from "../icons-autocomplete/IconsAutocomplete.vue";

const torrentWebsite = defineModel("torrentWebsite", {
  default: {} as TorrentWebsite,
  type: Object as () => TorrentWebsite,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

defineExpose({
  formRef,
});

const rules = torrentWebsiteRules;
</script>

<template>
  <v-form flat ref="formRef">
    <v-text-field v-model="torrentWebsite.title" :rules="rules.title" label="Title*"></v-text-field>
    <v-text-field v-model="torrentWebsite.url" :rules="rules.url" label="URL*"></v-text-field>
    <v-textarea v-model="torrentWebsite.description" label="Description"></v-textarea>
    <icons-autocomplete v-model="torrentWebsite.icon"></icons-autocomplete>
  </v-form>
</template>
