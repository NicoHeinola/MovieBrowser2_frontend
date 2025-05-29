<script lang="ts" setup>
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import ShowCard from "@/components/show-card/ShowCard.vue";
import ShowFormDialog from "@/components/show-form-dialog/ShowFormDialog.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import type Show from "@/models/show";
import { ShowService } from "@/services/show.service";
import { useAuthStore } from "@/stores/auth.store";
import { useUserWatchSeasonStore } from "@/stores/userWatchSeason.store";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useDebounceFn } from "@vueuse/core";

const search = ref<string>("");

const addShowDialogOpen = ref<boolean>(false);

const shows = ref<Show[]>([]);
const loadingShows = ref<boolean>(false);

const auth = useAuthStore();
const userWatchSeasonStore = useUserWatchSeasonStore();

const showToAdd = ref<Show>({} as Show);

const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const getShows = async () => {
  loadingShows.value = true;

  let data: any;
  try {
    data = await ShowService().getShows({
      search: {
        search: search.value,
      },
    });

    if (!Array.isArray(data)) {
      console.error("Expected an array of shows, but received:", data);
      data = [];
    }
  } catch (error) {
    errorSnackbar(error, openSnackbar);

    shows.value = [];
    return;
  }

  shows.value = data;

  loadingShows.value = false;
};

const getShowsDebounceFN = useDebounceFn(() => {
  getShows();
}, 200);

const getShowsDebounce = (value: string) => {
  loadingShows.value = true;
  getShowsDebounceFN();
};

const resetShowToAdd = () => {
  showToAdd.value = {
    title: "",
    description: "",
    image: "",
  } as Show;
};

onMounted(async () => {
  resetShowToAdd();
  userWatchSeasonStore.loadUserWatchSeasons();
  await getShows();
});
</script>

<template>
  <v-container class="d-flex flex-column ga-6 pa-12">
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Movies</h1>
        <v-btn prepend-icon="mdi-plus" color="primary" @click="addShowDialogOpen = true" v-if="auth.isAdmin">Add</v-btn>
      </v-col>
    </v-row>
    <div class="d-flex flex-column w-100 ga-4">
      <div class="d-flex align-center ga-2">
        <search-filter-input
          v-model:search="search"
          :text-field-props="{
            label: 'Search Movies',
            'hide-details': true,
          }"
          :search-button-props="{
            icon: 'mdi-magnify',
            variant: 'text',
          }"
          class="flex-1-1-100"
          @update:search="getShowsDebounce"
        ></search-filter-input>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-start ga-4">
      <div v-for="(show, i) in shows" :key="show.id">
        <show-card v-model:show="shows[i]" @update:show="getShows" @delete:show="getShows"></show-card>
      </div>
    </div>
  </v-container>
  <show-form-dialog
    v-model:open="addShowDialogOpen"
    v-model:show="showToAdd"
    @update:open="resetShowToAdd"
    @update:show="
      resetShowToAdd();
      getShows();
    "
  ></show-form-dialog>
</template>
