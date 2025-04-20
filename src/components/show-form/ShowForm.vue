<script lang="ts" setup>
import type Show from "@/models/show";
import { rules } from "./rules";
import type { VForm } from "vuetify/components";

const props = defineProps<{}>();

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    imageUrl: "",
  } as Show,
  type: Object as () => Show,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);
const showRules = rules();

defineExpose({
  formRef,
});
</script>

<template>
  <v-form ref="formRef">
    <v-text-field label="Title*" v-model="show.title" :rules="showRules.title"></v-text-field>
    <v-textarea label="Description" v-model="show.description" :rules="showRules.description"></v-textarea>
    <v-text-field label="Image (url)" v-model="show.image" :rules="showRules.image"></v-text-field>
  </v-form>
</template>
