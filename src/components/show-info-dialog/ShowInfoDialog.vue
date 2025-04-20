<script lang="ts" setup>
import type Show from "@/models/show";
import ShowFormDialog from "../show-form-dialog/ShowFormDialog.vue";

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    imageUrl: "",
  } as Show,
  type: Object as () => Show,
});

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const showFormDialogOpen = ref<boolean>(false);

const openShowFormDialog = () => {
  showFormDialogOpen.value = true;
  show.value = JSON.parse(JSON.stringify(show.value));
};

const close = () => {
  showFormDialogOpen.value = false;
  open.value = false;
};
</script>

<template>
  <v-dialog v-model="open">
    <template #default>
      <v-card :title="show.title">
        <v-card-text>
          {{ show.description }}
        </v-card-text>

        <v-card-actions>
          <v-btn prepend-icon="mdi-close" color="error" variant="outlined" text="Close" @click="close"></v-btn>
          <v-btn
            prepend-icon="mdi-pencil"
            color="primary"
            variant="elevated"
            text="Edit"
            @click="openShowFormDialog"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <show-form-dialog v-model:open="showFormDialogOpen" v-model:show="show" @update:show="close"></show-form-dialog>
</template>
