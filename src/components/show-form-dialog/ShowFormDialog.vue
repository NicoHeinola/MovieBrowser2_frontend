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
const { errorSnackbar } = useErrorSnackbar();

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const close = () => {
  open.value = false;
};

const cancel = () => {
  show.value = JSON.parse(JSON.stringify(showModel.value));
  close();
};

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

  // Attach files to the episodes (only newly added ones)
  const seasons = createdShow.seasons || [];
  let totalEpisodes = 0;
  let processedEpisodes = 0;

  // Count total episodes that have files (newly added)
  for (const season of seasons) {
    const episodes = season.episodes || [];
    for (const episode of episodes) {
      const file = show.value.seasons
        ?.find((s) => s.number === season.number)
        ?.episodes?.find((e) => e.number === episode.number)?.file;

      if (file) {
        totalEpisodes++;
      }
    }
  }

  for (const season of seasons) {
    const episodes = season.episodes || [];

    for (const episode of episodes) {
      const file = show.value.seasons
        ?.find((s) => s.number === season.number)
        ?.episodes?.find((e) => e.number === episode.number)?.file;

      if (!file) {
        continue;
      }

      try {
        await ShowService().uploadEpisodeFile(createdShow.id, episode.id, file);
        processedEpisodes++;

        const remainingEpisodes = totalEpisodes - processedEpisodes;

        openSnackbar({
          props: {
            text: `Successfully uploaded: ${episode.title} (${episode.number}). ${remainingEpisodes} episodes left.`,
          },
        });
      } catch (error) {
        errorSnackbar(error, openSnackbar);
        saving.value = false;
        return;
      }
    }
  }

  if (totalEpisodes > 0) {
    openSnackbar({
      props: {
        text: `All episode files uploaded successfully.`,
      },
    });
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
          text="Cancel"
          @click="cancel"
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
