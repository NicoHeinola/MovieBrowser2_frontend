<script lang="ts" setup>
import type Show from "@/models/show";
import ShowFormDialog from "../show-form-dialog/ShowFormDialog.vue";
import { ShowService } from "@/services/show.service";
import { useConfirm } from "../use-dialog/confirm/useConfirm";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    imageUrl: "",
  } as Show,
  type: Object as () => Show,
});

const emit = defineEmits<{
  (e: "delete:show", show: Show): void;
}>();

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const showFormDialogOpen = ref<boolean>(false);
const openConfirm = useConfirm();
const openSnackbar = useSnackbar();

const { errorSnackbar } = useErrorSnackbar();

const openShowFormDialog = () => {
  showFormDialogOpen.value = true;
  show.value = JSON.parse(JSON.stringify(show.value));
};

const close = () => {
  showFormDialogOpen.value = false;
  open.value = false;
};

const deleteShow = async () => {
  if (!show.value.id) return;

  const confirmed = await openConfirm({
    props: { title: "Delete Show", text: `Are you sure you want to delete the show "${show.value.title}"?` },
  });

  if (!confirmed) return;

  try {
    await ShowService().deleteShow(show.value.id);

    openSnackbar({
      props: {
        text: `Show "${show.value.title}" deleted successfully.`,
      },
    });

    emit("delete:show", show.value);
    close();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }
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
          <v-btn
            prepend-icon="mdi-trash-can"
            color="error"
            variant="elevated"
            text="Delete"
            @click="deleteShow"
          ></v-btn>
          <v-spacer></v-spacer>
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
