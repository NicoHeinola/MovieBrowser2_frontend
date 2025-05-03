<script lang="ts" setup>
import type Website from "@/models/Website";
import WebsiteFormDialog from "../website-form-dialog/WebsiteFormDialog.vue";
import { useConfirm } from "../use-dialog/confirm/useConfirm";
import { useSnackbar } from "../use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import { WebsiteService } from "@/services/website.service";
import { useAuthStore } from "@/stores/auth.store";

const website = defineModel("website", {
  type: Object as () => Website,
});

const emit = defineEmits<{
  (e: "delete:website", website: Website): void;
}>();

const openConfirm = useConfirm();
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const auth = useAuthStore();

const dialogOpen = ref<boolean>(false);
const deleting = ref<Boolean>(false);

const maxDescriptionLength = 150;
const parsedDescription = computed(() => {
  const description = website.value?.description;
  if (!description) {
    return "";
  }
  return description.length > maxDescriptionLength
    ? description.substring(0, maxDescriptionLength) + "..."
    : description;
});

const deleteWebsite = async () => {
  if (!website.value) return;

  const id = website.value.id;

  if (!id) return;

  const ok = await openConfirm({
    props: {
      title: "Delete Website",
      text: "Are you sure you want to delete this website?",
    },
  });

  if (!ok) return;

  deleting.value = true;

  try {
    await WebsiteService().deleteWebsite(id);
    openSnackbar({ props: { text: "Website deleted" } });
    emit("delete:website", website.value);
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  deleting.value = false;
};

const openWebsite = () => {
  window.open(website.value?.url, "_blank");
};
</script>

<template>
  <v-card width="300" height="200" class="d-flex flex-column">
    <v-card-text class="button-card-2 pb-0">
      <v-btn width="300" color="" variant="plain" class="flex-1-1-100 h-100" @click="openWebsite">
        <v-tooltip activator="parent" location="right">{{ website?.url }}</v-tooltip>
        <div class="d-flex ga-2 flex-column flex-wrap text-truncate">
          <div class="d-flex ga-2 align-center">
            <v-icon class="ma-0" size="20" color="secondary" v-if="website?.icon">
              {{ website?.icon }}
            </v-icon>
            <b>{{ website?.title }}</b>
          </div>
          <p class="text-subtitle-2 text-grey-lighten-1 text-wrap text-start">
            <v-tooltip
              max-width="500"
              activator="parent"
              location="bottom"
              v-if="(website?.description?.length ?? 0) > maxDescriptionLength"
            >
              <span>{{ website?.description }}</span>
            </v-tooltip>
            {{ parsedDescription }}
          </p>
        </div>
      </v-btn>
    </v-card-text>
    <v-card-actions class="d-flex justify-end" v-if="auth.isAdmin">
      <v-btn @click="deleteWebsite()" prepend-icon="mdi-delete" variant="outlined" color="error" :loading="!!deleting">
        Delete
      </v-btn>
      <v-btn @click="dialogOpen = true" variant="elevated" color="primary" prepend-icon="mdi-pencil">Edit</v-btn>
    </v-card-actions>
  </v-card>
  <website-form-dialog
    v-model:open="dialogOpen"
    v-model:website="website"
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
