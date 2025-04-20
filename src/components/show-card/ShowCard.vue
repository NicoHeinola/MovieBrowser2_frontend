<script lang="ts" setup>
import type Show from "@/models/show";
import ShowInfoDialog from "../show-info-dialog/ShowInfoDialog.vue";

const show = defineModel("show", {
  default: {
    title: "Show Title Example Long Text Example",
    image: "https://placehold.co/600x400",
    description:
      "dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release ",
  } as Show,
  type: Object as () => Show,
});

const emit = defineEmits<{
  (e: "delete:show", show: Show): void;
}>();

const infoDialogOpen = ref(false);
</script>

<template>
  <v-card width="300" height="200">
    <v-btn class="d-flex w-100 h-100 pa-0 button-card" @click="console.log('Watch')">
      <v-img
        :src="show.image"
        cover
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
        class="d-flex align-end w-100 h-100"
      >
        <v-btn size="large" variant="text" class="d-flex w-100" @click.stop="infoDialogOpen = true">
          <p class="text-truncate text-start">
            {{ show.title }}
            <v-tooltip activator="parent">
              <template #default>
                <p>{{ show.title }}</p>
              </template>
            </v-tooltip>
          </p>
        </v-btn>
      </v-img>
      <div class="play-icon d-flex align-center justify-center position-absolute w-100 h-100">
        <v-icon size="50" class="opacity-30">mdi-play-circle-outline</v-icon>
      </div>
    </v-btn>
  </v-card>
  <show-info-dialog
    v-model:open="infoDialogOpen"
    v-model:show="show"
    @delete:show="(show:Show) => emit('delete:show', show)"
  ></show-info-dialog>
</template>

<style scoped lang="scss">
.button-card {
  :deep(.v-btn__content) {
    width: 100%;
    height: 100%;
    justify-content: start;
  }

  .play-icon {
    pointer-events: none;

    * {
      transition: all 0.3s;
    }
  }

  &:hover {
    .play-icon * {
      opacity: 100 !important;
    }
  }
}
</style>
