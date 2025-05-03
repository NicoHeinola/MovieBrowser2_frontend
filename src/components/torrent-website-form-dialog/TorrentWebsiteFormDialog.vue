<script lang="ts" setup>
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import TorrentWebsiteForm from "../torrent-website-form/TorrentWebsiteForm.vue";
import type TorrentWebsite from "@/models/torrentWebsite";
import { TorrentWebsiteService } from "@/services/torrentWebsite.service";

const torrentWebsiteModel = defineModel("torrentWebsite", {
  type: Object as () => TorrentWebsite,
});

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const torrentWebsite = ref<TorrentWebsite>({} as TorrentWebsite);
const torrentWebsiteFormRef = ref<InstanceType<typeof TorrentWebsiteForm> | null>(null);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();
const saving = ref<Boolean>(false);

const close = () => {
  open.value = false;
};

const save = async () => {
  const isValid = await torrentWebsiteFormRef.value?.formRef?.validate();

  if (!isValid?.valid) return;

  saving.value = true;

  try {
    if (torrentWebsite.value.id) {
      await TorrentWebsiteService().updateTorrentWebsite(torrentWebsite.value.id, torrentWebsite.value);
      openSnackbar({ props: { text: "Torrent website updated" } });
    } else {
      await TorrentWebsiteService().createTorrentWebsite(torrentWebsite.value);
      openSnackbar({ props: { text: "Torrent website created" } });
    }
    torrentWebsiteModel.value = JSON.parse(JSON.stringify(torrentWebsite.value));
    close();
    emit("save");
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  saving.value = false;
};

const emit = defineEmits(["save", "cancel"]);

const cancel = () => {
  close();
  emit("cancel");
};

watch(
  torrentWebsiteModel,
  (newTorrentWebsite) => {
    torrentWebsite.value = JSON.parse(JSON.stringify(newTorrentWebsite));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <v-dialog v-model="open" max-width="500">
    <v-card :title="torrentWebsite?.id ? 'Edit Torrent Website' : 'Add Torrent Website'">
      <v-card-text>
        <torrent-website-form ref="torrentWebsiteFormRef" v-model:torrentWebsite="torrentWebsite" />
      </v-card-text>
      <v-card-actions>
        <v-btn
          prepend-icon="mdi-close"
          color="error"
          variant="outlined"
          text="Cancel"
          @click="cancel"
          :loading="!!saving"
        ></v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          variant="elevated"
          form="torrentWebsite-form"
          :text="torrentWebsite?.id ? 'Update' : 'Create'"
          :loading="!!saving"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
