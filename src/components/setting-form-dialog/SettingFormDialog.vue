<script lang="ts" setup>
import type Setting from "@/models/setting";
import SettingForm from "@/components/setting-form/SettingForm.vue";
import { SettingService } from "@/services/setting.service";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const settingModel = defineModel("setting", {
  type: Object as () => Setting,
});
const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const setting = ref<Setting>({} as Setting);
const settingFormRef = ref<InstanceType<typeof SettingForm> | null>(null);
const openSnackbar = useSnackbar();
const { errorSnackbar } = useErrorSnackbar();
const saving = ref<Boolean>(false);

const close = () => {
  open.value = false;
};

const save = async () => {
  const isValid = await settingFormRef.value?.formRef?.validate();

  if (!isValid?.valid) return;

  saving.value = true;

  try {
    if (setting.value.id) {
      await SettingService().updateSetting(setting.value.id, setting.value);
      openSnackbar({ props: { text: "Setting updated" } });
    } else {
      await SettingService().createSetting(setting.value);
      openSnackbar({ props: { text: "Setting created" } });
    }
    settingModel.value = JSON.parse(JSON.stringify(setting.value));
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
  settingModel,
  (newSetting) => {
    setting.value = JSON.parse(JSON.stringify(newSetting));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <v-dialog v-model="open" max-width="500">
    <v-card :title="setting?.id ? 'Edit Setting' : 'Add Setting'">
      <v-card-text>
        <setting-form ref="settingFormRef" v-model:setting="setting" />
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
          form="setting-form"
          :text="setting?.id ? 'Update' : 'Create'"
          :loading="!!saving"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
