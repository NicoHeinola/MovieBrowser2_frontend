<script lang="ts" setup>
import AuthForm from "@/components/auth-form/AuthForm.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import type User from "@/models/user";
import { useAuthStore } from "@/stores/auth";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const user = ref<User>({
  username: "",
  password: "",
});

const authFormRef = ref<InstanceType<typeof AuthForm> | null>(null);
const auth = useAuthStore();
const router = useRouter();
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();

const login = async () => {
  const isValid = await authFormRef.value?.formRef?.validate();

  if (!isValid?.valid) return;

  const { username, password } = user.value;

  if (!username || !password) {
    return;
  }

  const success = await auth.login(username, password);

  if (success) {
    openSnackbar({
      props: {
        text: "Login successful",
      },
    });

    router.push("/shows");
  } else {
    errorSnackbar("Login failed", openSnackbar, true);
  }
};
</script>

<template>
  <v-container class="pa-12 d-flex justify-center align-center h-100">
    <v-card width="800">
      <v-card-text>
        <v-row>
          <v-col>
            <h1>Login</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <auth-form ref="authFormRef" v-model:user="user"></auth-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
