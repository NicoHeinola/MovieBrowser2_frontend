<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type website from "@/models/website";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { WebsiteService } from "@/services/website.service";
import WebsiteFormDialog from "@/components/website-form-dialog/WebsiteFormDialog.vue";
import WebsiteCard from "@/components/website-card/WebsiteCard.vue";
import { useAuthStore } from "@/stores/auth.store";

const websites = ref<website[]>([]);
const loading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

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

onMounted(getWebsites);

watch(dialogOpen, (val) => {
  if (!val) resetNew();
});
</script>

<template>
  <v-container class="pa-12">
    <h1 class="text-h4 mb-6">Websites</h1>
    <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true" v-if="auth.isAdmin">Add Website</v-btn>
    <div class="d-flex flex-wrap justify-start ga-4 mt-6">
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
