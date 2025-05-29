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
import { useDebounceFn } from "@vueuse/core";
import SearchFilterInput from "@/components/search-filter-input/SearchFilterInput.vue";
import type WebsiteTag from "@/models/websiteTag";

const websites = ref<website[]>([]);
const loading = ref(false);
const seeding = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();
const openConfirm = useConfirm();

const newWebsite = ref<website>({});
const dialogOpen = ref(false);
const auth = useAuthStore();

const filters = ref<Record<string, any>>({});

const allWebsiteTags = computed(() => {
  const tagsSet = new Set<string>();
  websites.value.forEach((website) => {
    if (website.tags && Array.isArray(website.tags)) {
      website.tags.forEach((tag: WebsiteTag) => tagsSet.add(tag.name || ""));
    }
  });
  return Array.from(tagsSet).sort();
});

const getWebsites = async () => {
  loading.value = true;
  try {
    websites.value = await WebsiteService().getWebsites({
      ...(filters.value.tags ? { tags: filters.value.tags.join(",") } : {}),
      ...(filters.value.title ? { title: filters.value.title } : {}),
    });
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    websites.value = [];
  }
  loading.value = false;
};

const resetNew = () => {
  newWebsite.value = {};
};

const getWebsitesDebounceFN = useDebounceFn(() => {
  loading.value = true;

  getWebsites();
}, 200);

const getWebsitesDebounce = () => {
  loading.value = true;
  getWebsitesDebounceFN();
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

watch(() => filters.value, getWebsitesDebounce, { deep: true });
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Websites</h1>
        <div class="d-flex ga-2">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true">Add Website</v-btn>
          <v-btn color="error" prepend-icon="mdi-seed" @click="seedWebsites" :loading="seeding">Seed Websites</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="auth.isAdmin"> </v-row>
    <v-row>
      <v-col cols="12">
        <search-filter-input
          v-model:search="filters.title"
          :text-field-props="{
            label: 'Search Websites',
            'hide-details': true,
          }"
          :search-button-props="{
            icon: 'mdi-magnify',
            variant: 'text',
          }"
          :filter-button-props="{}"
          @clear:filters="filters = {}"
        >
          <template #filters>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="filters.tags"
                  :items="allWebsiteTags"
                  multiple
                  chips
                  clearable
                  item-text="name"
                  item-value="name"
                  label="Select Tags"
                  hide-details
                />
              </v-col>
            </v-row>
          </template>
        </search-filter-input>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex flex-wrap justify-start ga-4">
        <div v-for="(website, i) in websites" :key="website.id">
          <website-card v-model:website="websites[i]" @delete:website="getWebsites"></website-card>
        </div>
      </v-col>
    </v-row>
    <website-form-dialog
      v-model:open="dialogOpen"
      v-model:website="newWebsite"
      @save="getWebsites"
      @cancel="dialogOpen = false"
    />
  </v-container>
</template>
