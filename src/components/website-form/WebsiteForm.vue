<script lang="ts" setup>
import type Website from "@/models/website";
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

const rules = computed(() => websiteRules(website.value));

const tagName = ref<string>("");
const isTagNameValid = computed(() => {
  if (!tagName.value) return false;

  return rules.value.tag.every((rule) => {
    const result = rule(tagName.value);

    if (result === true) return true;

    return false;
  });
});

const addTag = () => {
  if (!isTagNameValid.value) return;

  if (!website.value.tags) {
    website.value.tags = [];
  }

  const tag = { name: tagName.value };
  website.value.tags.push(tag);

  tagName.value = "";
};

const removeTag = (index: number) => {
  if (!website.value.tags) return;

  const tag = website.value.tags[index];

  if (!tag) return;

  website.value.tags = website.value.tags.filter((t) => t.name !== tag.name);
};
</script>

<template>
  <v-form flat ref="formRef">
    <v-text-field v-model="website.title" :rules="rules.title" label="Title*"></v-text-field>
    <v-text-field v-model="website.url" :rules="rules.url" label="URL*"></v-text-field>
    <v-textarea v-model="website.description" label="Description"></v-textarea>
    <icons-autocomplete v-model="website.icon"></icons-autocomplete>

    <v-text-field v-model="tagName" :rules="rules.tag" label="Tags">
      <template #append>
        <v-btn :disabled="!isTagNameValid" @click="addTag" icon="mdi-plus" size="small"> </v-btn>
      </template>
    </v-text-field>

    <div class="d-flex ga-2 flex-wrap">
      <v-chip
        closable
        color="secondary"
        @click:close="removeTag(index)"
        v-for="(tag, index) in website.tags"
        :key="tag.name"
      >
        {{ tag.name }}
      </v-chip>
    </div>
  </v-form>
</template>
