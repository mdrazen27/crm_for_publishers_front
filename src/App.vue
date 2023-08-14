<template>
  <v-app>
    <v-layout fill-height>
      <MainLayout v-if="$store.state.auth.authenticated" />
      <v-main>
        <router-view :key="$route.fullPath" class="pr-5 mb-5" />
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
    </v-layout>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import MainLayout from "@/components/MainLayout";

export default {
  name: "App",

  data: () => ({
    //
  }),
  components: { MainLayout },
  computed: {
    ...mapState(["snackbar"]),
  },
  created() {
    this.snackbar.active = false;
  },
};
</script>
