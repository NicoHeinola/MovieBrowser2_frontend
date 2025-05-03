<script lang="ts" setup>
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import ShowCard from "@/components/show-card/ShowCard.vue";
import ShowFormDialog from "@/components/show-form-dialog/ShowFormDialog.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import type Show from "@/models/show";
import { ShowService } from "@/services/show.service";
import { useAuthStore } from "@/stores/auth.store";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const search = ref<string>("");

const addShowDialogOpen = ref<boolean>(false);

const shows = ref<Show[]>([]);
const loadingShows = ref<boolean>(false);

const auth = useAuthStore();

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
  } catch (error) {
    errorSnackbar(error, openSnackbar);

    shows.value = [];
    return;
  }
  shows.value = data;

  loadingShows.value = false;
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
  await getShows();
});
</script>

<template>
  <v-container class="d-flex flex-column ga-6 pa-12">
    <h1 class="text-h4">Movies</h1>
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
          @click:search="getShows"
        ></search-filter-input>
        <v-btn prepend-icon="mdi-plus" color="primary" @click="addShowDialogOpen = true" v-if="auth.isAdmin">Add</v-btn>
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
