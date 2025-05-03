<script lang="ts" setup>
import type TorrentWebsite from "@/models/torrentWebsite";
import TorrentWebsiteFormDialog from "../torrent-website-form-dialog/TorrentWebsiteFormDialog.vue";
import { useConfirm } from "../use-dialog/confirm/useConfirm";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { TorrentWebsiteService } from "@/services/torrentWebsite.service";
import { useAuthStore } from "@/stores/auth.store";

const torrentWebsite = defineModel("torrentWebsite", {
  type: Object as () => TorrentWebsite,
});

const emit = defineEmits<{
  (e: "delete:torrentWebsite", torrentWebsite: TorrentWebsite): void;
}>();

const openConfirm = useConfirm();
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const auth = useAuthStore();

const dialogOpen = ref<boolean>(false);
const deleting = ref<Boolean>(false);

const maxDescriptionLength = 150;
const parsedDescription = computed(() => {
  const description = torrentWebsite.value?.description;
  if (!description) {
    return "";
  }
  return description.length > maxDescriptionLength
    ? description.substring(0, maxDescriptionLength) + "..."
    : description;
});

const deleteTorrentWebsite = async () => {
  if (!torrentWebsite.value) return;

  const id = torrentWebsite.value.id;

  if (!id) return;

  const ok = await openConfirm({
    props: {
      title: "Delete Torrent Website",
      text: "Are you sure you want to delete this torrent website?",
    },
  });

  if (!ok) return;

  deleting.value = true;

  try {
    await TorrentWebsiteService().deleteTorrentWebsite(id);
    openSnackbar({ props: { text: "Torrent website deleted" } });
    emit("delete:torrentWebsite", torrentWebsite.value);
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  deleting.value = false;
};

const openWebsite = () => {
  window.open(torrentWebsite.value?.url, "_blank");
};
</script>

<template>
  <v-card width="300" height="200" class="d-flex flex-column">
    <v-card-text class="button-card-2 pb-0">
      <v-btn width="300" color="" variant="plain" class="flex-1-1-100 h-100" @click="openWebsite">
        <v-tooltip activator="parent" location="right">{{ torrentWebsite?.url }}</v-tooltip>
        <div class="d-flex ga-2 flex-column flex-wrap text-truncate">
          <div class="d-flex ga-2 align-center">
            <v-icon class="ma-0" size="20" color="secondary" v-if="torrentWebsite?.icon">
              {{ torrentWebsite?.icon }}
            </v-icon>
            <b>{{ torrentWebsite?.title }}</b>
          </div>
          <p class="text-subtitle-2 text-grey-lighten-1 text-wrap text-start">
            <v-tooltip
              max-width="500"
              activator="parent"
              location="bottom"
              v-if="(torrentWebsite?.description?.length ?? 0) > maxDescriptionLength"
            >
              <span>{{ torrentWebsite?.description }}</span>
            </v-tooltip>
            {{ parsedDescription }}
          </p>
        </div>
      </v-btn>
    </v-card-text>
    <v-card-actions class="d-flex justify-end" v-if="auth.isAdmin">
      <v-btn
        @click="deleteTorrentWebsite()"
        prepend-icon="mdi-delete"
        variant="outlined"
        color="error"
        :loading="!!deleting"
      >
        Delete</v-btn
      >
      <v-btn @click="dialogOpen = true" variant="elevated" color="primary" prepend-icon="mdi-pencil"> Edit</v-btn>
    </v-card-actions>
  </v-card>
  <torrent-website-form-dialog
    v-model:open="dialogOpen"
    v-model:torrent-website="torrentWebsite"
    @save="dialogOpen = false"
    @cancel="dialogOpen = false"
  />
</template>

<style lang="scss" scoped>
.button-card-2 {
  :deep(.v-btn) {
    display: flex;
    justify-content: flex-start;
    align-items: start;
    padding: 0;
    width: 100%;
    height: auto;

    :deep(.v-btn__content) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
