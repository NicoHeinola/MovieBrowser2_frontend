<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type TorrentWebsite from "@/models/torrentWebsite";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { TorrentWebsiteService } from "@/services/torrentWebsite.service";
import TorrentWebsiteFormDialog from "@/components/torrent-website-form-dialog/TorrentWebsiteFormDialog.vue";
import TorrentWebsiteCard from "@/components/torrent-website-card/TorrentWebsiteCard.vue";
import { useAuthStore } from "@/stores/auth.store";

const torrentWebsites = ref<TorrentWebsite[]>([]);
const loading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const newTorrentWebsite = ref<TorrentWebsite>({});

const dialogOpen = ref(false);

const auth = useAuthStore();

const getTorrentWebsites = async () => {
  loading.value = true;
  try {
    torrentWebsites.value = await TorrentWebsiteService().getTorrentWebsites();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    torrentWebsites.value = [];
  }
  loading.value = false;
};

const resetNewTorrent = () => {
  newTorrentWebsite.value = {};
};

onMounted(getTorrentWebsites);

watch(dialogOpen, (val) => {
  if (!val) resetNewTorrent();
});
</script>

<template>
  <v-container class="pa-12">
    <h1 class="text-h4 mb-6">Torrent Website Websites</h1>
    <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true" v-if="auth.isAdmin"
      >Add Torrent Website</v-btn
    >
    <div class="d-flex flex-wrap justify-start ga-4 mt-6">
      <div v-for="(torrentWebsite, i) in torrentWebsites" :key="torrentWebsite.id">
        <torrent-website-card
          v-model:torrent-website="torrentWebsites[i]"
          @delete:torrentWebsite="getTorrentWebsites"
        ></torrent-website-card>
      </div>
    </div>
    <torrent-website-form-dialog
      v-model:open="dialogOpen"
      v-model:torrent-website="newTorrentWebsite"
      @save="getTorrentWebsites"
      @cancel="dialogOpen = false"
    />
  </v-container>
</template>
