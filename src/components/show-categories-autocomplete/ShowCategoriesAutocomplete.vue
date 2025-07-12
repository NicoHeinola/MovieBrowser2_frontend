<script setup lang="ts"></script>

<template>
  <v-autocomplete v-bind="$attrs">
    <template v-slot:item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps" :title="''">
        <v-list-item-title class="d-flex align-center ga-2">
          <v-icon>{{ item.raw.icon }}</v-icon>
          <p>{{ item.raw.name }}</p>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <v-chip class="d-flex align-center ga-2">
        <v-icon>{{ item.raw.icon }}</v-icon>
        <span>{{ item.raw.name }}</span>
      </v-chip>
    </template>
  </v-autocomplete>
</template>
