<template>
  <v-app>
    <v-app-bar app color="primary" dark></v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      v-model="snackbar.active"
      :color="snackbar.color"
      :timeout="2000"
      bottom
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar.active = false"
        >
          Zatvori
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",

  data: () => ({
    //
  }),
  computed: {
    ...mapState(["snackbar"]),
  },
  created() {
    this.snackbar.active = false
  },
};
</script>
