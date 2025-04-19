<script lang="ts" setup>
import type Show from "@/models/show";

const props = withDefaults(
  defineProps<{
    show: Show;
  }>(),
  {}
);

const open = defineModel("open", {
  default: false,
  type: Boolean,
});
</script>

<template>
  <v-dialog v-model="open">
    <template #default>
      <v-card :title="show.title">
        <v-card-text>
          {{ show.description }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn prepend-icon="mdi-close" text="Close" @click="open = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
