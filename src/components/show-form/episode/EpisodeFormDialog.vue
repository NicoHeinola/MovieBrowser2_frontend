<script lang="ts" setup>
import EpisodeForm from "./EpisodeForm.vue";

const props = defineProps<{
  blacklistedEpisodeNumbers: number[];
}>();

const episodeModel = defineModel("episode", {
  type: Object as () => any,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", newEpisode: any, oldEpisode: any): void;
}>();

const episode = ref<any>({});
const episodeFormRef = ref<InstanceType<typeof EpisodeForm> | null>(null);

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const close = () => {
  open.value = false;
  emit("close");
};

const save = async () => {
  if (!episodeFormRef.value) return;

  const response = await episodeFormRef.value.formRef?.validate();
  const isValid = response?.valid;

  if (!isValid) return;

  emit("save", episode.value, episodeModel.value ?? episode.value);

  episodeModel.value = JSON.parse(JSON.stringify(episode.value));
  close();
};

watch(
  episodeModel,
  (newEpisode) => {
    episode.value = JSON.parse(JSON.stringify(newEpisode));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <v-dialog v-model="open" persistent>
    <v-card title="Add Episode">
      <v-card-text>
        <episode-form
          ref="episodeFormRef"
          id="episode-form"
          v-model:episode="episode"
          :blacklisted-episode-numbers="blacklistedEpisodeNumbers"
        ></episode-form>
      </v-card-text>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" color="error" variant="outlined" text="Close" @click="close"></v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          variant="elevated"
          form="episode-form"
          text="Save"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
