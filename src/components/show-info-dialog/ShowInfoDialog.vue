<script lang="ts" setup>
import type Show from "@/models/show";
import ShowFormDialog from "../show-form-dialog/ShowFormDialog.vue";
import { ShowService } from "@/services/show.service";
import { useConfirm } from "../use-dialog/confirm/useConfirm";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import type Season from "@/models/season";
import { EpisodeType, episodeTypeItems } from "@/models/episode";
import { useAuthStore } from "@/stores/auth.store";
import { useUserWatchSeasonStore } from "@/stores/userWatchSeason.store";
import type UserWatchSeason from "@/models/userWatchSeason";
import { VCardTitle } from "vuetify/components";
import { userShowStatuses } from "@/models/userShowStatus";
import { useUserShowStatusStore } from "@/stores/userShowStatus.store";

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

const status = ref<string | null>(null);
const userShowStatusStore = useUserShowStatusStore();

const showFormDialogOpen = ref<boolean>(false);
const openConfirm = useConfirm();
const openSnackbar = useSnackbar();
const userWatchSeasonStore = useUserWatchSeasonStore();

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

const auth = useAuthStore();

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

const watchEpisode = async (episodeId?: number) => {
  if (!show.value.id || episodeId === undefined) return;

  try {
    await ShowService().watchEpisode(show.value.id, episodeId);

    openSnackbar({
      props: {
        text: `Started watching episode successfully!.`,
      },
    });
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }
};

const watchSeason = async () => {
  if (!show.value.id || !selectedSeason.value?.id) return;

  try {
    await ShowService().watchSeason(show.value.id, selectedSeason.value?.id);
    userWatchSeasonStore.loadUserWatchSeasons();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }
};

const getSeasonIcon = (season: Season) => {
  const seasonId = season.id;
  return userWatchSeasonStore.userWatchSeasons.find((s: UserWatchSeason) => s.season_id === seasonId)
    ? "mdi-rotate-right"
    : "";
};

// Helper to get icon for episode type
const getEpisodeTypeIcon = (type?: EpisodeType) => {
  return episodeTypeItems.find((item) => item.value === type)?.icon || "";
};

watch(
  () => status.value,
  (newValue: any) => {
    console.log("Status changed:", newValue);
    userShowStatusStore.createOrUpdateUserShowStatus({
      show_id: show.value.id,
      status: newValue,
    });
  }
);

onMounted(() => {
  status.value = userShowStatusStore.findUserShowStatusByShowId(show.value.id)?.status || null;
});
</script>

<template>
  <v-dialog v-model="open">
    <template #default>
      <v-card>
        <v-card-title class="bg-primary d-flex align-center ga-4">
          <span class="text-h6">{{ show.title }}</span>
          <v-select
            hide-details
            label="Status"
            item-value="value"
            item-title="text"
            :items="userShowStatuses"
            v-model="status"
          >
            <template v-slot:item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :title="''">
                <v-list-item-title class="d-flex align-center ga-2">
                  <v-icon>{{ item.raw.icon }}</v-icon>
                  <p>{{ item.raw.text }}</p>
                </v-list-item-title>
              </v-list-item>
            </template>
            <template #selection="{ item }">
              <div class="d-flex align-center ga-2">
                <v-icon>{{ item.raw.icon }}</v-icon>
                <p>{{ item.raw.text }}</p>
              </div>
            </template>
          </v-select>
        </v-card-title>
        <v-card-text class="d-flex flex-column ga-2">
          <div class="d-flex ga-2" v-if="show.description">
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

          <template v-if="show.seasons?.length">
            <p>Season</p>

            <div class="d-flex flex-row ga-2 flex-wrap">
              <v-btn
                v-for="season in show.seasons"
                :key="season.id"
                :variant="selectedSeason?.id !== season.id ? 'outlined' : undefined"
                @click="selectedSeason = season"
                :prepend-icon="getSeasonIcon(season)"
              >
                {{ season.title ? `${season.title} (Season ${season.number})` : `Season ${season.number}` }}
              </v-btn>
            </div>

            <template v-if="selectedSeason">
              <div class="d-flex align-center ga-2">
                <p>Episodes</p>
                <v-btn variant="text" size="small" append-icon="mdi-play" color="secondary" @click="watchSeason">
                  Watch all
                </v-btn>
              </div>

              <div class="d-flex flex-row ga-2 flex-wrap">
                <v-btn
                  v-for="episode in selectedSeason.episodes"
                  :key="episode.id"
                  append-icon="mdi-play"
                  @click="watchEpisode(episode.id)"
                >
                  <template #prepend>
                    <v-icon v-if="getEpisodeTypeIcon(episode.type)" class="mr-1">
                      {{ getEpisodeTypeIcon(episode.type) }}
                    </v-icon>
                  </template>
                  {{ episode.title ? `${episode.title} (Episode ${episode.number})` : `Episode ${episode.number}` }}
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
            v-if="auth.isAdmin"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn prepend-icon="mdi-close" color="error" variant="outlined" text="Close" @click="close"></v-btn>
          <v-btn
            prepend-icon="mdi-pencil"
            color="primary"
            variant="elevated"
            text="Edit"
            @click="openShowFormDialog"
            v-if="auth.isAdmin"
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
