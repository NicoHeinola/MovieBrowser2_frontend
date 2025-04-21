<script lang="ts" setup>
import type Season from "@/models/season";
import SeasonForm from "./SeasonForm.vue";

const props = defineProps<{
  blacklistedSeasonNumbers: number[];
}>();

const seasonModel = defineModel("season", {
  type: Object as () => Season,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", newSeason: Season, oldSeason: Season): void;
}>();

const season = ref<Season>({} as Season);
const seasonFormRef = ref<InstanceType<typeof SeasonForm> | null>(null);

const open = defineModel("open", {
  default: false,
  type: Boolean,
});

const close = () => {
  open.value = false;
  emit("close");
};

const save = async () => {
  if (!seasonFormRef.value) return;

  const response = await seasonFormRef.value.formRef?.validate();
  const isValid = response?.valid;

  if (!isValid) return;

  emit("save", season.value, seasonModel.value ?? season.value);

  seasonModel.value = JSON.parse(JSON.stringify(season.value));
  close();
};

watch(
  seasonModel,
  (newSeason) => {
    season.value = JSON.parse(JSON.stringify(newSeason));
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <v-dialog v-model="open" persistent>
    <v-card title="Add Season">
      <v-card-text>
        <season-form
          ref="seasonFormRef"
          id="season-form"
          v-model:season="season"
          :blacklisted-season-numbers="blacklistedSeasonNumbers"
        ></season-form>
      </v-card-text>

      <v-card-actions>
        <v-btn prepend-icon="mdi-close" color="error" variant="outlined" text="Close" @click="close"></v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          variant="elevated"
          form="season-form"
          text="Save"
          @click="save"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
