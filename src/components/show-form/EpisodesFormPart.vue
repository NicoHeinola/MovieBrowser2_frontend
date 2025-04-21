<script lang="ts" setup>
import type Show from "@/models/show";
import { rules } from "./show.rules";
import SeasonFormDialog from "./season/SeasonFormDialog.vue";
import type Season from "@/models/season";
import { useConfirm } from "../use-dialog/confirm/useConfirm";

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

const currentSeason = ref<any>(null);
const showSeasonFormDialog = ref<boolean>(false);
const editedSeason = ref<Season>();

const openConfirm = useConfirm();

const formattedSeasons = computed(() => {
  if (!show.value?.seasons) return [];

  return show.value.seasons
    .map((season) => ({
      ...season,
      formattedTitle: season.title || `Season ${season.number}`,
    }))
    .sort((a: any, b: any) => a.number - b.number);
});

const clearEditedSeason = () => {
  const number = (show.value?.seasons || []).length + 1;

  editedSeason.value = {
    title: "",
    description: "",
    image: "",
    number,
    episodes: [],
  } as Season;
};

const openAddSeasonDialog = () => {
  showSeasonFormDialog.value = true;
  clearEditedSeason();
};

const openEditSeasonDialog = (season: Season) => {
  showSeasonFormDialog.value = true;
  editedSeason.value = season;
};

const removeSeason = async (season: Season) => {
  const confirmed = await openConfirm({
    props: { text: `Are you sure you want to delete season ${season.number}?` },
  });

  if (!confirmed) return;

  if (!show.value.seasons) return;

  const index = show.value.seasons.findIndex((s) => s.number === season.number);
  if (index !== -1) {
    show.value.seasons.splice(index, 1);
  }
};

const saveSeason = async (newSeason: Season, oldSeason: Season) => {
  if (!show.value.seasons) {
    show.value.seasons = [];
  }

  const index = show.value.seasons.findIndex((s) => s.number === oldSeason.number);

  if (index !== -1) {
    show.value.seasons[index] = newSeason;
  } else {
    show.value.seasons.push(newSeason);
  }

  show.value = JSON.parse(JSON.stringify(show.value));
};

onMounted(() => {
  clearEditedSeason();
});
</script>

<template>
  <v-select
    label="Season"
    v-model="currentSeason"
    item-key="number"
    item-title="formattedTitle"
    :items="formattedSeasons"
    clearable
    :rules="showRules.seasons"
  >
    <template #append>
      <v-btn prepend-icon="mdi-plus" @click="openAddSeasonDialog"> Add </v-btn>
    </template>
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <v-list-item-subtitle v-if="item.raw.title">Season {{ item.raw.number }}</v-list-item-subtitle>
        <template #append>
          <v-btn
            variant="text"
            color="secondary"
            size="small"
            icon="mdi-trash-can"
            @click.stop="removeSeason(item.raw)"
          ></v-btn>
          <v-btn
            variant="text"
            color="secondary"
            size="small"
            icon="mdi-pencil"
            @click.stop="openEditSeasonDialog(item.raw)"
          ></v-btn>
        </template>
      </v-list-item>
    </template>
  </v-select>
  <v-slide-x-transition>
    <v-select label="Episode" v-if="currentSeason">
      <template #append>
        <v-btn prepend-icon="mdi-plus">Add</v-btn>
      </template>
    </v-select>
  </v-slide-x-transition>
  <season-form-dialog
    v-model:open="showSeasonFormDialog"
    v-model:season="editedSeason"
    @save="saveSeason"
    :blacklisted-season-numbers="formattedSeasons.map((s) => Number(s.number))"
    v-if="editedSeason"
  ></season-form-dialog>
</template>
