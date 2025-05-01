<script lang="ts" setup>
import AuthForm from "@/components/auth-form/AuthForm.vue";
import { useSnackbar } from "@/components/use-snackbar/useSnackbar";
import type User from "@/models/user";
import { AuthService } from "@/services/auth.service";
import { useErrorSnackbar } from "@/utils/errorSnackbar";

const user = ref<User>({
  username: "",
  password: "",
});

const authFormRef = ref<InstanceType<typeof AuthForm> | null>(null);
const { errorSnackbar } = useErrorSnackbar();
const openSnackbar = useSnackbar();
const router = useRouter();

const register = async () => {
  const isValid = await authFormRef.value?.formRef?.validate();

  if (!isValid?.valid) return;

  const { username, password } = user.value;

  if (!username || !password) {
    return;
  }

  try {
    await AuthService().register({ username, password });

    openSnackbar({
      props: {
        text: "Registered successfully",
      },
    });

    router.push("/auth/login");
  } catch (error) {
    errorSnackbar("Registeration failed", openSnackbar, true);
  }
};
</script>

<template>
  <v-container class="pa-12 d-flex justify-center align-center h-100">
    <v-card width="800">
      <v-card-text>
        <v-row>
          <v-col>
            <h1>Register</h1>
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
        <v-btn color="primary" variant="elevated" @click="register">Register</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
