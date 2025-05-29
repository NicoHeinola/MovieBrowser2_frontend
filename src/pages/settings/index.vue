<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type Setting from "@/models/setting";
import { SettingType } from "@/models/setting";
import { SettingService } from "@/services/setting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";
import SettingFormDialog from "@/components/setting-form-dialog/SettingFormDialog.vue";
import { useConfirm } from "@/components/use-dialog/confirm/useConfirm";
import { ShowService } from "@/services/show.service";

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

const seeding = ref<Boolean>(false);
const cleaningShowsUp = ref<Boolean>(false);
const deleting = ref<Boolean>(false);

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

  deleting.value = true;

  try {
    await SettingService().deleteSetting(id);
    openSnackbar({ props: { text: "Setting deleted" } });
    await getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  deleting.value = false;
};

const resetNewSetting = () => {
  newSetting.value = { key: "", value: "", type: SettingType.String };
};

const seedSettings = async () => {
  const ok = await openConfirm({
    props: {
      title: "Seed Settings",
      text: "Are you sure you want to seed settings? This will overwrite existing settings.",
    },
  });

  if (!ok) return;

  seeding.value = true;

  try {
    await SettingService().seedSettings();
    openSnackbar({ props: { text: "Settings seeded" } });
    await getSettings();
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  seeding.value = false;
};

const cleanupShows = async () => {
  const ok = await openConfirm({
    props: {
      title: "Cleanup Shows",
      text: "Are you sure you want to cleanup shows? This will remove unused videos. Note: this action is PERMANENT!",
    },
  });

  if (!ok) return;

  cleaningShowsUp.value = true;

  try {
    await ShowService().cleanupShows();
    openSnackbar({ props: { text: "Shows cleaned up" } });
  } catch (error) {
    errorSnackbar(error, openSnackbar);
  }

  cleaningShowsUp.value = false;
};

onMounted(getSettings);

watch(dialogOpen, (val) => {
  if (!val) resetNewSetting();
});
</script>

<template>
  <v-container class="pa-12">
    <v-row>
      <v-col class="d-flex align-center justify-space-between">
        <h1 class="text-h4">Settings</h1>
        <div class="d-flex align-center ga-2">
          <v-btn color="primary" prepend-icon="mdi-plus" @click="dialogOpen = true">Add Setting</v-btn>
          <v-btn color="error" prepend-icon="mdi-seed" @click="seedSettings" :loading="!!seeding">Seed Settings</v-btn>
          <v-btn color="error" prepend-icon="mdi-vacuum" @click="cleanupShows" :loading="!!cleaningShowsUp">
            Cleanup Shows
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-table :loading="loading">
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
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  color="secondary"
                  @click="editSetting(setting)"
                  :disabled="!!deleting"
                />
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  @click="deleteSetting(setting.id!)"
                  :disabled="!!deleting"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
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
