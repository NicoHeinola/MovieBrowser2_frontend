<script lang="ts" setup>
import type Website from "@/models/Website";
import type { VForm } from "vuetify/components";
import { websiteRules } from "./website.rules";
import IconsAutocomplete from "../icons-autocomplete/IconsAutocomplete.vue";

const website = defineModel("website", {
  default: {} as Website,
  type: Object as () => Website,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

defineExpose({
  formRef,
});

const rules = websiteRules;
</script>

<template>
  <v-form flat ref="formRef">
    <v-text-field v-model="website.title" :rules="rules.title" label="Title*"></v-text-field>
    <v-text-field v-model="website.url" :rules="rules.url" label="URL*"></v-text-field>
    <v-textarea v-model="website.description" label="Description"></v-textarea>
    <icons-autocomplete v-model="website.icon"></icons-autocomplete>
  </v-form>
</template>
