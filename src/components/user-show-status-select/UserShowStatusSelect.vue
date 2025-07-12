<script setup lang="ts"></script>

<template>
  <v-select v-bind="$attrs">
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" :title="''">
        <v-list-item-title class="d-flex align-center ga-2">
          <v-icon>{{ item.raw.icon }}</v-icon>
          <p>{{ item.raw.text }}</p>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <div class="d-flex align-center ga-2">
        <v-icon>{{ item.raw.icon }}</v-icon>
        <p>{{ item.raw.text }}</p>
      </div>
    </template>
  </v-select>
</template>
