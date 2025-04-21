<script lang="ts" setup>
import type Show from "@/models/show";
import ShowFormDialog from "../show-form-dialog/ShowFormDialog.vue";
import { ShowService } from "@/services/show.service";
import { useConfirm } from "../use-dialog/confirm/useConfirm";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import type Season from "@/models/season";

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    image: "",
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

const selectedSeason = ref<Season>();
const readMoreDescription = ref<boolean>(false);

const maxDescriptionLength = 200;
const description = computed(() => {
  if (!show.value.description) return "";

  if (readMoreDescription.value) return show.value.description;

  return show.value.description.length > maxDescriptionLength
    ? show.value.description.slice(0, maxDescriptionLength) + "..."
    : show.value.description;
});

const openShowFormDialog = () => {
  showFormDialogOpen.value = true;
};

const close = () => {
  showFormDialogOpen.value = false;

  setTimeout(() => {
    selectedSeason.value = undefined;
  }, 200);

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
        <v-card-text class="d-flex flex-column ga-2">
          <div class="d-flex ga-2">
            <v-icon>mdi-text</v-icon>
            <p>
              <span>{{ description }} </span>
              <span
                class="ml-2 text-secondary cursor-pointer"
                @click="readMoreDescription = !readMoreDescription"
                v-if="(show.description?.length || 0) > maxDescriptionLength"
              >
                {{ readMoreDescription ? "Read less" : "Read more" }}
              </span>
            </p>
          </div>

          <div class="d-flex align-center ga-2">
            <v-icon>mdi-movie</v-icon>
            <span>Seasons: {{ show.seasons?.length ?? 0 }}</span>
          </div>

          <div class="d-flex align-center ga-2">
            <v-icon>mdi-television-play</v-icon>
            <span>
              Episodes: {{ show.seasons?.reduce((acc, season) => acc + (season.episodes?.length ?? 0), 0) ?? 0 }}
            </span>
          </div>

          <v-divider :opacity="0.5"></v-divider>

          <b>Watch</b>

          <template v-if="show.seasons?.length">
            <p>Season</p>

            <div class="d-flex flex-row ga-2 flex-wrap">
              <v-btn
                v-for="season in show.seasons"
                :key="season.id"
                :variant="selectedSeason?.id !== season.id ? 'outlined' : undefined"
                @click="selectedSeason = season"
              >
                {{ season.title || `Season ${season.number}` }}
              </v-btn>
            </div>

            <template v-if="selectedSeason">
              <div class="d-flex align-center ga-2">
                <p>Episodes</p>
                <v-btn variant="text" class="align-center" size="small" append-icon="mdi-play" color="secondary"
                  >Watch all</v-btn
                >
              </div>

              <div class="d-flex flex-row ga-2 flex-wrap">
                <v-btn v-for="episode in selectedSeason.episodes" :key="episode.id" append-icon="mdi-play">
                  {{ episode.title || `Episode ${episode.number}` }}
                </v-btn>
              </div>
            </template>
          </template>
          <p v-else>No seasons</p>

          <div class="position-absolute w-100 h-100 darkened-overlay-image" v-if="show.image">
            <v-img :src="show.image" cover alt="Show Image" />
          </div>
        </v-card-text>

        <v-card-actions class="bg-surface">
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

<style scoped lang="scss">
.darkened-overlay-image {
  left: 0;
  top: 0;
  filter: brightness(0.35) blur(5px);
  pointer-events: none;
  z-index: -1;
}
</style>
