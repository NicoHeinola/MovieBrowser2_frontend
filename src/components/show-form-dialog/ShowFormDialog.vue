<script lang="ts" setup>
import type Show from "@/models/show";
import ShowForm from "../show-form/ShowForm.vue";
import { ShowService } from "@/services/show.service";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const showModel = defineModel("show", {
  type: Object as () => Show,
});

const show = ref<Show>({} as Show);
const showFormRef = ref<InstanceType<typeof ShowForm> | null>(null);
const openSnackbar = useSnackbar();

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const close = () => {
  open.value = false;
};

const { errorSnackbar } = useErrorSnackbar();

const save = async () => {
  if (!showFormRef.value) return;

  const response = await showFormRef.value.formRef?.validate();
  const isValid = response?.valid;

  if (!isValid) return;

  // Save show
  try {
    if (!show.value.id) {
      await ShowService().createShow(show.value);

      openSnackbar({
        props: {
          text: `Show "${show.value.title}" created successfully.`,
        },
      });
    } else {
      await ShowService().updateShow(show.value.id, show.value);

      openSnackbar({
        props: {
          text: `Show "${show.value.title}" updated successfully.`,
        },
      });
    }
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    return;
  }

  showModel.value = JSON.parse(JSON.stringify(show.value));
  close();
};

watch(
  showModel,
  (newShow) => {
    show.value = JSON.parse(JSON.stringify(newShow));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <v-dialog v-model="open" persistent>
    <v-card title="Add Show">
      <v-card-text>
        <show-form ref="showFormRef" id="show-form" v-model:show="show"></show-form>
      </v-card-text>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" color="error" variant="outlined" text="Close" @click="close"></v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          variant="elevated"
          form="show-form"
          :text="'Save'"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
