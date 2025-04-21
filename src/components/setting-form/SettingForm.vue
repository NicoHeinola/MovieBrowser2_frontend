<script lang="ts" setup>
import type Setting from "@/models/setting";
import { SettingType } from "@/models/setting";
import { settingRules } from "./setting.rules";
import type { VForm } from "vuetify/components";

const setting = defineModel("setting", {
  default: {
    key: "",
    value: "",
    type: SettingType.String,
  } as Setting,
  type: Object as () => Setting,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

const typeOptions = [
  { title: "String", value: SettingType.String },
  { title: "Integer", value: SettingType.Int },
  { title: "Boolean", value: SettingType.Bool },
];

defineExpose({
  formRef,
});
</script>

<template>
  <v-form flat ref="formRef">
    <v-text-field v-model="setting.key" label="Key*" :rules="settingRules.key" required />
    <v-text-field v-model="setting.value" label="Value" :rules="settingRules.value" required />
    <v-select
      v-model="setting.type"
      :items="typeOptions"
      label="Type*"
      item-title="title"
      item-value="value"
      required
      :value="setting.type || SettingType.String"
    />
  </v-form>
</template>
