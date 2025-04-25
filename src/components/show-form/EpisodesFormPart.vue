<script lang="ts" setup>
import { rules } from "./show.rules";
import SeasonFormDialog from "./season/SeasonFormDialog.vue";
import { useConfirm } from "../use-dialog/confirm/useConfirm";
import EpisodeFormDialog from "./episode/EpisodeFormDialog.vue";

import type Episode from "@/models/episode";
import type Show from "@/models/show";
import type Season from "@/models/season";
import { EpisodeType, episodeTypeItems } from "@/models/episode";

const props = defineProps<{}>();

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    image: "",
  } as Show,
  type: Object as () => Show,
});

const showRules = computed(() => rules(show.value));

const currentSeasonNumber = ref<number>();
const currentSeason = computed<Season | null>({
  get() {
    if (!show.value?.seasons) return null;

    const seasonIndex = findSeasonByNumber(currentSeasonNumber.value);
    return seasonIndex !== -1 ? show.value.seasons[seasonIndex] : null;
  },
  set(season: Season | null) {
    if (season === null || season.number === undefined) return;

    currentSeasonNumber.value = season.number;

    const seasonIndex = findSeasonByNumber(currentSeasonNumber.value);
    if (seasonIndex !== -1 && show.value?.seasons) {
      show.value.seasons[seasonIndex] = season;
    }
  },
});

const showSeasonFormDialog = ref<boolean>(false);
const editedSeason = ref<Season>();

const currentEpisodeNumber = ref<number>();
const currentEpisode = computed<Episode | null>({
  get() {
    if (!currentSeason.value?.episodes) return null;

    const episodeIndex = currentSeason.value.episodes.findIndex(
      (e: Episode) => e.number === currentEpisodeNumber.value
    );
    return episodeIndex !== -1 ? currentSeason.value.episodes[episodeIndex] : null;
  },
  set(episode: Episode | null) {
    if (episode === null || episode.number === undefined) return;

    currentEpisodeNumber.value = episode.number;
  },
});

const showEpisodeFormDialog = ref<boolean>(false);
const editedEpisode = ref<Episode>();

const openConfirm = useConfirm();

const formattedSeasons = computed(() => {
  if (!show.value?.seasons) return [];

  return show.value.seasons
    .map((season) => ({
      ...season,
      formattedTitle: `Season ${season.number} (${season.episodes?.length ?? 0} episodes)`,
    }))
    .sort((a: any, b: any) => a.number - b.number);
});

const formattedEpisodes = computed(() => {
  if (!show.value?.seasons || !currentSeasonNumber.value) return [];

  const seasonIndex = findSeasonByNumber(currentSeasonNumber.value);

  if (seasonIndex === -1) return [];

  const season = show.value.seasons[seasonIndex];

  if (!season?.episodes) return [];

  return season.episodes
    .map((episode: Episode) => ({
      ...episode,
      formattedTitle: `Episode ${episode.number}`,
    }))
    .sort((a: any, b: any) => a.number - b.number);
});

const clearEditedSeason = () => {
  const seasons = show.value.seasons || [];
  const biggestNumber = Math.max(0, ...seasons.map((s: Season) => s.number ?? 0));
  const nextNumber = biggestNumber + 1;

  editedSeason.value = {
    title: "",
    description: "",
    image: "",
    number: nextNumber,
    episodes: [],
  } as Season;
};

const clearEditedEpisode = () => {
  const episodes = currentSeason.value?.episodes || [];
  const biggestNumber = Math.max(0, ...episodes.map((e: Episode) => e.number ?? 0));
  const nextNumber = biggestNumber + 1;

  editedEpisode.value = {
    title: "",
    description: "",
    type: EpisodeType.Episode,
    number: nextNumber,
  } as Episode;
};

const openAddSeasonDialog = () => {
  showSeasonFormDialog.value = true;
  clearEditedSeason();
};

const openAddEpisodeDialog = () => {
  showEpisodeFormDialog.value = true;
  clearEditedEpisode();
};

const openEditSeasonDialog = (season: Season | null) => {
  if (!season) return;

  showSeasonFormDialog.value = true;
  editedSeason.value = season;
};

const openEditEpisodeDialog = (episode: Episode | null) => {
  if (!episode) return;

  showEpisodeFormDialog.value = true;
  editedEpisode.value = episode;
};

const findSeasonByNumber = (number?: number): number => {
  if (!show.value.seasons) return -1;
  return show.value.seasons.findIndex((s) => s.number === number);
};

const removeSeason = async (season: Season) => {
  const confirmed = await openConfirm({
    props: { text: `Are you sure you want to delete season ${season.number}?` },
  });

  if (!confirmed) return;

  if (!show.value.seasons) return;

  const index = findSeasonByNumber(season.number);
  if (index !== -1) {
    show.value.seasons.splice(index, 1);
  }

  if (currentSeasonNumber.value === season.number) {
    currentSeasonNumber.value = undefined;
  }
};

const removeEpisode = async (episode: Episode) => {
  const confirmed = await openConfirm({
    props: { text: `Are you sure you want to delete episode ${episode.number}?` },
  });

  if (!confirmed) return;
  if (!currentSeason.value?.episodes) return;

  const index = currentSeason.value.episodes.findIndex((e: Episode) => e.number === episode.number);
  if (index !== -1) {
    currentSeason.value.episodes.splice(index, 1);
  }

  if (currentEpisodeNumber.value === episode.number) {
    currentEpisodeNumber.value = undefined;
  }
};

const saveSeason = async (newSeason: Season, oldSeason: Season) => {
  if (!show.value.seasons) {
    show.value.seasons = [];
  }

  const index = findSeasonByNumber(oldSeason.number);

  if (index !== -1) {
    show.value.seasons[index] = newSeason;
  } else {
    show.value.seasons.push(newSeason);
  }

  currentSeasonNumber.value = newSeason.number;
};

const saveEpisode = async (newEpisode: Episode, oldEpisode: Episode) => {
  if (!show.value.seasons) {
    show.value.seasons = [];
  }

  if (!currentSeason.value) return;

  if (!currentSeason.value.episodes) {
    currentSeason.value.episodes = [];
  }

  const index = currentSeason.value.episodes.findIndex((e: Episode) => e.number === oldEpisode.number);

  if (index !== -1) {
    currentSeason.value.episodes[index] = newEpisode;
  } else {
    currentSeason.value.episodes.push(newEpisode);
  }

  currentEpisodeNumber.value = newEpisode.number;
};

watch(
  () => currentSeasonNumber.value,
  (_?: number) => {
    currentEpisodeNumber.value = undefined;
  }
);

onMounted(() => {
  clearEditedSeason();
});
</script>

<template>
  <v-select
    label="Season"
    v-model="currentSeasonNumber"
    item-value="number"
    item-title="formattedTitle"
    :items="formattedSeasons"
    clearable
    :rules="showRules.seasons"
  >
    <template #append>
      <div class="d-flex ga-2">
        <v-btn prepend-icon="mdi-pencil" :disabled="!currentSeason" @click.stop="openEditSeasonDialog(currentSeason)">
          Edit
        </v-btn>
        <v-btn prepend-icon="mdi-plus" @click="openAddSeasonDialog">Add</v-btn>
      </div>
    </template>
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <v-list-item-subtitle v-if="item.raw.title">
          {{ item.raw.title }}
        </v-list-item-subtitle>
        <template #append>
          <v-btn
            variant="text"
            color="error"
            size="small"
            icon="mdi-trash-can"
            @click.stop="removeSeason(item.raw)"
          ></v-btn>
        </template>
      </v-list-item>
    </template>
  </v-select>
  <v-slide-x-transition>
    <v-select
      label="Episode"
      v-if="currentSeasonNumber"
      v-model="currentEpisodeNumber"
      item-value="number"
      item-title="formattedTitle"
      :items="formattedEpisodes"
      clearable
    >
      <template #append>
        <div class="d-flex ga-2">
          <v-btn
            prepend-icon="mdi-pencil"
            :disabled="!currentEpisode"
            @click.stop="openEditEpisodeDialog(currentEpisode)"
          >
            Edit
          </v-btn>
          <v-btn prepend-icon="mdi-plus" @click="openAddEpisodeDialog">Add</v-btn>
        </div>
      </template>
      <template #selection="{ item }">
        <v-icon
          size="15"
          :icon="episodeTypeItems.find((type: any) => type.value === item.raw.type)?.icon"
          class="me-2"
        ></v-icon>
        {{ item.raw.formattedTitle }}
      </template>
      <template #item="{ item, props: itemProps }">
        <v-list-item v-bind="itemProps" title="">
          <v-list-item-title>
            <v-icon
              size="15"
              :icon="episodeTypeItems.find((type: any) => type.value === item.raw.type)?.icon"
              class="me-2"
            ></v-icon>
            {{ item.raw.formattedTitle }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="item.raw.title">{{ item.raw.title }}</v-list-item-subtitle>
          <template #append>
            <v-btn
              variant="text"
              color="error"
              size="small"
              icon="mdi-trash-can"
              @click.stop="removeEpisode(item.raw)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </v-slide-x-transition>
  <season-form-dialog
    v-model:open="showSeasonFormDialog"
    v-model:season="editedSeason"
    @save="saveSeason"
    :blacklisted-season-numbers="
      formattedSeasons.map((s) => Number(s.number)).filter((n) => n !== Number(currentSeasonNumber))
    "
    v-if="editedSeason"
  ></season-form-dialog>
  <episode-form-dialog
    v-model:open="showEpisodeFormDialog"
    v-model:episode="editedEpisode"
    @save="saveEpisode"
    :blacklisted-episode-numbers="
      formattedEpisodes.map((e) => Number(e.number)).filter((n) => n !== Number(currentEpisodeNumber))
    "
    v-if="editedEpisode"
  ></episode-form-dialog>
</template>
