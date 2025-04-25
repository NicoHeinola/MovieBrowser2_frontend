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

const saving = ref<Boolean>(false);

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

  let createdShow: any;

  saving.value = true;

  try {
    if (!show.value.id) {
      createdShow = await ShowService().createShow(show.value); // Backend must accept multipart/form-data
      openSnackbar({
        props: {
          text: `Show "${show.value.title}" created successfully.`,
        },
      });
    } else {
      createdShow = await ShowService().updateShow(show.value.id, show.value);
      openSnackbar({
        props: {
          text: `Show "${show.value.title}" updated successfully.`,
        },
      });
    }
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    saving.value = false;
    return;
  }

  // Attach files to the episodes
  const seasons = createdShow.seasons || [];
  let uploadPromises: Promise<any>[] = [];
  for (const season of seasons) {
    const episodes = season.episodes || [];
    for (const episode of episodes) {
      const file = show.value.seasons
        ?.find((s) => s.number === season.number)
        ?.episodes?.find((e) => e.number === episode.number)?.file;

      if (!file) {
        continue;
      }

      const promise = ShowService().uploadEpisodeFile(createdShow.id, episode.id, file);
      uploadPromises.push(promise);
    }

    try {
      await Promise.all(uploadPromises);
      openSnackbar({
        props: {
          text: `Episode files uploaded successfully.`,
        },
      });
    } catch (error) {
      errorSnackbar(error, openSnackbar);
      saving.value = false;
      return;
    }
  }

  saving.value = false;

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
    <v-card :title="show.id ? 'Edit Show' : 'Add Show'">
      <v-card-text>
        <show-form ref="showFormRef" id="show-form" v-model:show="show"></show-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          prepend-icon="mdi-close"
          color="error"
          variant="outlined"
          text="Close"
          @click="close"
          :loading="!!saving"
        ></v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          variant="elevated"
          form="show-form"
          :text="'Save'"
          :loading="!!saving"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
