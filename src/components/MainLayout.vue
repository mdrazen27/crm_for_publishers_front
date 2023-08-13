<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item :to="'s' + '/profile'" link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user?.email }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <side-menu-item
          v-if="this.user.role_id === 1"
          class_name="ml-4"
          route_name="publishers"
          icon="mdi mdi-domain"
          title="Publishers"
          tooltip="Publishers administration"
        />
        <side-menu-item
          class_name="ml-4"
          route_name="home"
          icon="mdi mdi-advertisements"
          title="Advertisements"
          tooltip="Advertisements"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn text v-on="{ ...tooltip }" @click="logout">
            <v-icon> mdi-logout </v-icon>
          </v-btn>
        </template>
        <span>Log out</span>
      </v-tooltip>
    </v-app-bar>
  </div>
</template>

<script>
import SideMenuItem from "@/components/SideMenuItem";
import state from "@/store";
import router from "@/router";

export default {
  name: "MainLayout",
  data: () => ({
    user: {
      name: "",
      email: "",
      role_id: null,
    },
    drawer: false,
    preview: true,
    menu: false,
  }),
  components: {
    SideMenuItem,
  },
  created() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      this.user = await state.getters["auth/user"];
    },

    logout() {
      state.dispatch("auth/logout");
      router.push({ name: "login" });
    },

    redirectToHomePage() {
      router.push({ name: "advertisements" });
    },
  },
};
</script>
