<script lang="ts" setup>
import type Show from "@/models/show";
import ShowInfoDialog from "../show-info-dialog/ShowInfoDialog.vue";
import { useUserWatchSeasonStore } from "@/stores/userWatchSeason.store";
import type UserWatchSeason from "@/models/userWatchSeason";
import { ShowService } from "@/services/show.service";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useUserShowStatusStore } from "@/stores/userShowStatus.store";
import { userShowStatuses } from "@/models/userShowStatus";
import type UserShowStatus from "@/models/userShowStatus";
import { showCategories } from "@/models/showCategory";

const show = defineModel("show", {
  default: {
    title: "Show Title Example Long Text Example",
    image: "https://placehold.co/600x400",
    description:
      "dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release ",
  } as Show,
  type: Object as () => Show,
});

const emit = defineEmits<{
  (e: "delete:show", show: Show): void;
}>();

const snackbar = useSnackbar();

const userWatchSeasonStore = useUserWatchSeasonStore();
const userShowStatusStore = useUserShowStatusStore();

const infoDialogOpen = ref(false);

const userShowStatus = computed(() => {
  const status: UserShowStatus | null = userShowStatusStore.findUserShowStatusByShowId(show.value.id) ?? null;

  const notAllowedStatuses = ["unknown"];

  if (notAllowedStatuses.includes(status?.status as string)) {
    return null;
  }

  return userShowStatuses.find((s) => s.value === status?.status) || null;
});

const startWatching = async () => {
  if (!show.value.id) return;

  const userWatchSeason: UserWatchSeason | undefined = userWatchSeasonStore.findUserWatchSeasonByShowId(show.value.id);

  const seasonIdToWatch: number | undefined = userWatchSeason?.season_id ?? show.value.seasons?.[0]?.id;

  if (!seasonIdToWatch) {
    snackbar({ props: { text: "No seasons available to watch.", color: "error" } });
    return;
  }

  await ShowService().watchSeason(show.value.id, seasonIdToWatch);
  userWatchSeasonStore.loadUserWatchSeasons();
};
</script>

<template>
  <v-card width="300" height="200">
    <v-btn class="d-flex w-100 h-100 pa-0 button-card" color="" variant="plain" @click="startWatching">
      <v-img
        :src="show.image"
        cover
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
        class="d-flex align-end w-100 h-100"
      >
        <v-btn size="large" variant="text" class="d-flex w-100" @click.stop="infoDialogOpen = true">
          <p class="text-truncate text-start">
            {{ show.title }}
            <v-tooltip activator="parent">
              <template #default>
                <p>{{ show.title }}</p>
              </template>
            </v-tooltip>
          </p>
        </v-btn>
      </v-img>
      <div class="d-flex pa-4 position-absolute w-100 h-100" style="pointer-events: none" v-if="userShowStatus">
        <div
          class="d-flex align-center justify-center"
          style="border-radius: 50%; aspect-ratio: 1; height: 40px; background: rgb(0, 0, 0, 0.6)"
        >
          <v-icon size="x-large" :color="userShowStatus.color">
            {{ userShowStatus.icon }}
          </v-icon>
        </div>
      </div>
      <div
        class="d-flex flex-column align-end pa-4 ga-2 position-absolute w-100 h-100"
        style="pointer-events: none"
        v-if="show.categories"
      >
        <div
          class="d-flex align-center justify-center"
          style="border-radius: 50%; aspect-ratio: 1; height: 25px; background: rgb(0, 0, 0, 0.3)"
          v-for="category in show.categories.slice(0, 5)"
          :key="category.name"
        >
          <v-icon size="medium">
            {{ showCategories.find((c) => c.name === category.name)?.icon || "mdi-help" }}
          </v-icon>
        </div>
      </div>
      <div class="play-icon d-flex align-center justify-center position-absolute w-100 h-100">
        <v-icon size="50" class="opacity-30">mdi-play-circle-outline</v-icon>
      </div>
    </v-btn>
  </v-card>
  <show-info-dialog
    v-model:open="infoDialogOpen"
    v-model:show="show"
    @delete:show="(show:Show) => emit('delete:show', show)"
  ></show-info-dialog>
</template>

<style scoped lang="scss">
.button-card {
  :deep(.v-btn__content) {
    width: 100%;
    height: 100%;
    justify-content: start;
  }

  .play-icon {
    pointer-events: none;

    * {
      transition: all 0.3s;
    }
  }

  &:hover {
    .play-icon * {
      opacity: 100 !important;
    }
  }
}
</style>
