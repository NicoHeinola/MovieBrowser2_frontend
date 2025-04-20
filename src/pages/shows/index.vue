<script lang="ts" setup>
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import ShowCard from "@/components/show-card/ShowCard.vue";
import ShowFormDialog from "@/components/show-form-dialog/ShowFormDialog.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import type Show from "@/models/show";
import { ShowService } from "@/services/show.service";

const search = ref<string>("");

const addShowDialogOpen = ref<boolean>(false);

const shows = ref<Show[]>([]);
const loadingShows = ref<boolean>(false);

const showToAdd = ref<Show>({} as Show);

const getShows = async () => {
  loadingShows.value = true;

  let data: any;
  try {
    data = await ShowService().getShows();
  } catch (error) {
    console.error("Error fetching shows:", error);
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
    imageUrl: "",
  } as Show;
};

const openSnackbar = useSnackbar();
const openConfirm = useConfirm();

const openD = async () => {
  await openSnackbar({
    props: { text: "Hello World" },
  });
};

const openD2 = async () => {
  const result = await openConfirm({
    props: {
      title: "Are you sure?",
      text: "This action cannot be undone.",
    },
  });

  if (result) {
    await openSnackbar({
      props: { text: "Confirmed" },
    });
  } else {
    await openSnackbar({
      props: { text: "Cancelled" },
    });
  }
};

onMounted(async () => {
  resetShowToAdd();
  await getShows();
});
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center ga-12 pa-12">
    <div class="d-flex flex-column w-100 ga-4">
      <h1 class="text-h2 text-center">Movies</h1>
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
        <v-btn prepend-icon="mdi-plus" color="primary" @click="addShowDialogOpen = true">Add</v-btn>
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
  <v-btn prepend-icon="mdi-plus" color="primary" @click="openD">1</v-btn>
  <v-btn prepend-icon="mdi-plus" color="primary" @click="openD2">2</v-btn>
</template>
