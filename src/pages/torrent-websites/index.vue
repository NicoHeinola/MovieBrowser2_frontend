<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type TorrentWebsite from "@/models/torrentWebsite";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { TorrentWebsiteService } from "@/services/torrentWebsite.service";
import TorrentWebsiteFormDialog from "@/components/torrent-website-form-dialog/TorrentWebsiteFormDialog.vue";

const torrentWebsites = ref<TorrentWebsite[]>([]);
const loading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const newTorrentWebsite = ref<TorrentWebsite>({});

const dialogOpen = ref(false);

const openConfirm = useConfirm();

const deleting = ref<Boolean>(false);

const gettorrentWebsites = async () => {
  loading.value = true;
  try {
    torrentWebsites.value = await TorrentWebsiteService().getTorrentWebsites();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    torrentWebsites.value = [];
  }
  loading.value = false;
};

const editTorrent = (torrent: TorrentWebsite) => {
  newTorrentWebsite.value = { ...torrent };
  dialogOpen.value = true;
};

const deleteTorrent = async (id: number) => {
  const ok = await openConfirm({
    props: {
      title: "Delete TorrentWebsite",
      text: "Are you sure you want to delete this torrent?",
    },
  });

  if (!ok) return;

  deleting.value = true;

  try {
    await TorrentWebsiteService().deleteTorrentWebsite(id);
    openSnackbar({ props: { text: "Torrent website deleted" } });
    await gettorrentWebsites();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  deleting.value = false;
};

const resetNewTorrent = () => {
  newTorrentWebsite.value = {};
};

onMounted(gettorrentWebsites);

watch(dialogOpen, (val) => {
  if (!val) resetNewTorrent();
});
</script>

<template>
  <v-container class="pa-12">
    <h1 class="text-h4 mb-6">Torrent Website Websites</h1>
    <div class="d-flex ga-2">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true">Add Torrent Website</v-btn>
    </div>
    <v-table class="mt-6" :loading="loading">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Title</th>
          <th>URL</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="torrent in torrentWebsites" :key="torrent.id">
          <td>{{ torrent.icon }}</td>
          <td>{{ torrent.title }}</td>
          <td>{{ torrent.url }}</td>
          <td>{{ torrent.description }}</td>
          <td>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              color="secondary"
              @click="editTorrent(torrent)"
              :disabled="!!deleting"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              @click="deleteTorrent(torrent.id!)"
              :disabled="!!deleting"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
    <torrent-website-form-dialog
      v-model:open="dialogOpen"
      v-model:torrent-website="newTorrentWebsite"
      @save="
        () => {
          dialogOpen = false;
          gettorrentWebsites();
        }
      "
      @cancel="
        () => {
          dialogOpen = false;
        }
      "
    />
  </v-container>
</template>
