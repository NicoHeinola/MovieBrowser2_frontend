<script lang="ts" setup>
import type Show from "@/models/show";
import type { VForm } from "vuetify/components";
import BasicInformationFormPart from "./BasicInformationFormPart.vue";
import EpisodesFormPart from "./EpisodesFormPart.vue";

const show = defineModel("show", {
  default: {
    title: "",
    description: "",
    image: "",
  } as Show,
  type: Object as () => Show,
});

const formRef = ref<InstanceType<typeof VForm> | null>(null);

const formParts = ref<Array<string>>(["Basic information", "Episodes"]);

defineExpose({
  formRef,
});
</script>

<template>
  <v-form ref="formRef" flat>
    <v-stepper :items="formParts" editable>
      <template v-slot:item.1>
        <div class="py-2">
          <basic-information-form-part v-model:show="show" />
        </div>
      </template>
      <template v-slot:item.2>
        <div class="py-2">
          <episodes-form-part v-model:show="show" />
        </div>
      </template>
      <template #actions="{ next, prev }">
        <v-stepper-actions color="primary" @click:next="next" @click:prev="prev"></v-stepper-actions>
      </template>
    </v-stepper>
  </v-form>
</template>
