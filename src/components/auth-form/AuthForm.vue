<script lang="ts" setup>
import type User from "@/models/user";
import { rules } from "./auth.rules";
import type { VForm } from "vuetify/components";

const user = defineModel<User>("user", {
  default: {
    username: "",
    password: "",
  },
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

const authRules = computed(() => rules());

defineExpose({
  formRef,
});
</script>

<template>
  <v-form ref="formRef">
    <v-text-field v-model="user.username" label="Username*" :rules="authRules.username"></v-text-field>
    <v-text-field v-model="user.password" type="password" label="Password*" :rules="authRules.password"></v-text-field>
  </v-form>
</template>
