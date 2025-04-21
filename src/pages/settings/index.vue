<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type Setting from "@/models/setting";
import { SettingType } from "@/models/setting";
import { SettingService } from "@/services/setting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import SettingFormDialog from "@/components/setting-form-dialog/SettingFormDialog.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";

const settings = ref<Setting[]>([]);
const loading = ref(false);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();

const newSetting = ref<Setting>({
  key: "",
  value: "",
  type: SettingType.String,
});

const dialogOpen = ref(false);

const openConfirm = useConfirm();

const getSettings = async () => {
  loading.value = true;
  try {
    settings.value = await SettingService().getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
    settings.value = [];
  }
  loading.value = false;
};

const editSetting = (setting: Setting) => {
  newSetting.value = { ...setting };
  dialogOpen.value = true;
};

const deleteSetting = async (id: number) => {
  const ok = await openConfirm({
    props: {
      title: "Delete Setting",
      text: "Are you sure you want to delete this setting?",
    },
  });

  if (!ok) return;

  try {
    await SettingService().deleteSetting(id);
    openSnackbar({ props: { text: "Setting deleted" } });
    await getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }
};

const resetNewSetting = () => {
  newSetting.value = { key: "", value: "", type: SettingType.String };
};

onMounted(getSettings);

watch(dialogOpen, (val) => {
  if (!val) resetNewSetting();
});
</script>

<template>
  <v-container class="pa-8">
    <h1 class="text-h4 mb-6">Settings</h1>
    <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true">Add Setting</v-btn>
    <v-table class="mt-6" :loading="loading">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="setting in settings" :key="setting.id">
          <td>{{ setting.key }}</td>
          <td>{{ setting.value }}</td>
          <td>{{ setting.type }}</td>
          <td>
            <v-btn icon="mdi-pencil" variant="text" color="secondary" @click="editSetting(setting)" />
            <v-btn icon="mdi-delete" variant="text" color="error" @click="deleteSetting(setting.id!)" />
          </td>
        </tr>
      </tbody>
    </v-table>
    <setting-form-dialog
      v-model:open="dialogOpen"
      v-model:setting="newSetting"
      @save="
        () => {
          dialogOpen = false;
          getSettings();
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
