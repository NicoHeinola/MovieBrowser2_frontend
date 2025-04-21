<script lang="ts" setup>
import { computed } from "vue";
import type Setting from "@/models/setting";
import { SettingType } from "@/models/setting";
import { settingRules } from "./setting.rules";
import type { VForm } from "vuetify/components";

const props = defineProps<{
  modelValue: Setting;
}>();
const emit = defineEmits(["update:modelValue"]);

const showRef = ref<InstanceType<typeof VForm> | null>(null);

const typeOptions = [
  { title: "String", value: SettingType.String },
  { title: "Integer", value: SettingType.Int },
  { title: "Boolean", value: SettingType.Bool },
];

const setting = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

defineExpose({
  showRef,
});
</script>

<template>
  <v-form flat ref="showRef">
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
