<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type website from "@/models/website";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { WebsiteService } from "@/services/website.service";
import WebsiteFormDialog from "@/components/website-form-dialog/WebsiteFormDialog.vue";
import WebsiteCard from "@/components/website-card/WebsiteCard.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";

const websites = ref<website[]>([]);
const loading = ref(false);
const seeding = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();
const openConfirm = useConfirm();

const newWebsite = ref<website>({});

const dialogOpen = ref(false);

const auth = useAuthStore();

const getWebsites = async () => {
  loading.value = true;
  try {
    websites.value = await WebsiteService().getWebsites();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    websites.value = [];
  }
  loading.value = false;
};

const resetNew = () => {
  newWebsite.value = {};
};

const seedWebsites = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed Websites",
      text: "Are you sure you want to seed websites? This may overwrite existing websites.",
    },
  });

  if (!ok) return;

  seeding.value = true;
  try {
    await WebsiteService().seedWebsites();
    openSnackbar({ props: { text: "Websites seeded successfully" } });
    await getWebsites();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }
  seeding.value = false;
};

onMounted(getWebsites);

watch(dialogOpen, (val) => {
  if (!val) resetNew();
});
</script>

<template>
  <v-container class="pa-12">
    <h1 class="text-h4 mb-6">Websites</h1>
    <div class="d-flex ga-2 mb-6" v-if="auth.isAdmin">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true">Add Website</v-btn>
      <v-btn color="error" prepend-icon="mdi-seed" @click="seedWebsites" :loading="seeding">Seed Websites</v-btn>
    </div>
    <div class="d-flex flex-wrap justify-start ga-4">
      <div v-for="(website, i) in websites" :key="website.id">
        <website-card v-model:website="websites[i]" @delete:website="getWebsites"></website-card>
      </div>
    </div>
    <website-form-dialog
      v-model:open="dialogOpen"
      v-model:website="newWebsite"
      @save="getWebsites"
      @cancel="dialogOpen = false"
    />
  </v-container>
</template>
