<template>
  <v-container fluid class="pa-0">
    <v-sheet
      height="100vh"
      color="primary"
      dark
      class="d-flex align-center justify-center"
    >
      <v-row class="fill-height d-flex align-center justify-center">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <h1 class="display-2 font-weight-bold mb-4">
            Bienvenue sur mon application
          </h1>
          <p class="subtitle-1 mb-6">
            Gérez vos tâches quotidiennes de manière efficace et organisée
          </p>
          <v-btn
            color="secondary"
            large
            elevation="2"
            @click="$router.push('/todo-list')"
            class="mr-4"
          >
            <v-icon left>mdi-format-list-checkbox</v-icon>
            Accéder à la Liste des Tâches
          </v-btn>
          <v-btn
            outlined
            color="secondary"
            large
            elevation="2"
            href="https://github.com/YounesEssl/niveau-0"
            target="_blank"
          >
            <v-icon left>mdi-github</v-icon>
            Voir le Code Source
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
});
</script>
