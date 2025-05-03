<script lang="ts" setup>
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import WebsiteForm from "../website-form/WebsiteForm.vue";
import type Website from "@/models/website";
import { WebsiteService } from "@/services/website.service";

const websiteModel = defineModel("website", {
  type: Object as () => Website,
});

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const website = ref<Website>({} as Website);
const websiteFormRef = ref<InstanceType<typeof WebsiteForm> | null>(null);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();
const saving = ref<Boolean>(false);

const close = () => {
  open.value = false;
};

const save = async () => {
  const isValid = await websiteFormRef.value?.formRef?.validate();

  if (!isValid?.valid) return;

  saving.value = true;

  try {
    if (website.value.id) {
      await WebsiteService().updateWebsite(website.value.id, website.value);
      openSnackbar({ props: { text: " website updated" } });
    } else {
      await WebsiteService().createWebsite(website.value);
      openSnackbar({ props: { text: " website created" } });
    }
    websiteModel.value = JSON.parse(JSON.stringify(website.value));
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
  websiteModel,
  (newWebsite) => {
    website.value = JSON.parse(JSON.stringify(newWebsite));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <v-dialog v-model="open" max-width="500">
    <v-card :title="website?.id ? 'Edit Website' : 'Add Website'">
      <v-card-text>
        <website-form ref="websiteFormRef" v-model:website="website" />
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
          :text="website?.id ? 'Update' : 'Create'"
          :loading="!!saving"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
