<script lang="ts" setup>
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import ShowCard from "@/components/show-card/ShowCard.vue";
import ShowFormDialog from "@/components/show-form-dialog/ShowFormDialog.vue";
import ShowCategoriesAutocomplete from "@/components/show-categories-autocomplete/ShowCategoriesAutocomplete.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import UserShowStatusSelect from "@/components/user-show-status-select/UserShowStatusSelect.vue";
import type Show from "@/models/show";
import { showCategories } from "@/models/showCategory";
import { userShowStatuses } from "@/models/userShowStatus";
import { ShowService } from "@/services/show.service";
import { useAuthStore } from "@/stores/auth.store";
import { useUserShowStatusStore } from "@/stores/userShowStatus.store";
import { useUserWatchSeasonStore } from "@/stores/userWatchSeason.store";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useDebounceFn } from "@vueuse/core";

const search = ref<string>("");
const filters = ref<Record<string, unknown>>({
  "userShowStatus:notIn": ["completed"],
});

const addShowDialogOpen = ref<boolean>(false);

const shows = ref<Show[]>([]);

const defaultPagination = {
  page: 1,
  pages: 0,
  limit: 30,
};
const pagination = ref({ ...defaultPagination });
const loadingShows = ref<boolean>(false);

const auth = useAuthStore();
const userWatchSeasonStore = useUserWatchSeasonStore();
const userShowStatusStore = useUserShowStatusStore();

const showToAdd = ref<Show>({} as Show);

const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const getShows = async (loadMore: boolean = false) => {
  loadingShows.value = true;

  if (!loadMore) {
    pagination.value = {
      ...defaultPagination,
    };
  }

  let response: any;
  try {
    response = await ShowService().getShows({
      search: {
        search: search.value,
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value,
      },
    });

    if (!Array.isArray(response.data)) {
      console.error("Expected an array of shows, but received:", response.data);
      response.data = [];
    }
  } catch (error) {
    errorSnackbar(error, openSnackbar);

    shows.value = [];
    pagination.value = {
      ...defaultPagination,
    };
    return;
  }

  if (!loadMore) {
    shows.value = response.data;
  } else {
    shows.value.push(...response.data);
  }

  pagination.value = response?.pagination;
  pagination.value.page += 1;

  loadingShows.value = false;
};

const getShowsDebounceFN = useDebounceFn(() => {
  getShows();
}, 200);

const getShowsDebounce = () => {
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
  userShowStatusStore.loadUserShowStatuses();
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
          :filter-count="Object.keys(filters).length"
          @update:search="getShowsDebounce"
          @clear:filters="(filters = {}), getShows()"
        >
          <template #filters>
            <v-row>
              <v-col cols="12">
                <user-show-status-select
                  v-model="filters['userShowStatus:in']"
                  :items="userShowStatuses"
                  label="Any status in"
                  hide-details
                  variant="outlined"
                  multiple
                  clearable
                  @update:model-value="getShowsDebounce"
                  @click:clear="() => delete filters['userShowStatus:in']"
                ></user-show-status-select>
              </v-col>
              <v-col cols="12">
                <user-show-status-select
                  v-model="filters['userShowStatus:notIn']"
                  :items="userShowStatuses"
                  label="Status not in"
                  hide-details
                  variant="outlined"
                  multiple
                  clearable
                  @update:model-value="getShowsDebounce"
                  @click:clear="() => delete filters['userShowStatus:notIn']"
                ></user-show-status-select>
              </v-col>
              <v-col cols="12">
                <show-categories-autocomplete
                  v-model="filters['categories:anyIn']"
                  :items="showCategories"
                  item-value="name"
                  item-title="title"
                  label="Any categories in"
                  multiple
                  chips
                  clearable
                  @update:model-value="getShowsDebounce"
                  @click:clear="() => delete filters['categories:anyIn']"
                ></show-categories-autocomplete>
              </v-col>
            </v-row>
          </template>
        </search-filter-input>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-start ga-4">
      <div v-for="(show, i) in shows" :key="show.id">
        <show-card v-model:show="shows[i]" @update:show="getShows()" @delete:show="getShows()"></show-card>
      </div>
    </div>
    <div class="d-flex justify-center align-center" v-if="pagination.page <= pagination.pages">
      <v-btn :disabled="loadingShows" @click="getShows(true)">Load more shows</v-btn>
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
