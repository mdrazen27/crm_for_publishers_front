<template>
  <div>
    <v-navigation-drawer v-model="drawer" app :width="400">
      <v-list>
        <v-list-item @click="redirectToAdvertisementsPage" link>
          <v-list-item-content>
            <v-list-item-title class="text-h5">
              {{ navigationDrawerMainTitle }}
            </v-list-item-title>
            <template v-if="this.user.role_id === 2">
              <v-list-item-subtitle class="mt-3 text-h6">
                {{ user?.email }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-right mt-2">
                Joined: {{ joinDate }}
              </v-list-item-subtitle>
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense nav>
        <template v-if="this.user.role_id === 1">
          <side-menu-item
            class_name="ml-4"
            route_name="publishers"
            icon="mdi mdi-domain"
            title="Publishers"
            tooltip="Publishers administration"
          />
          <side-menu-item
            class_name="ml-4"
            route_name="admins"
            icon="mdi mdi-account-edit"
            title="Admins"
            tooltip="Admin users"
          />
        </template>
        <side-menu-item
          class_name="ml-4"
          route_name="advertisements"
          icon="mdi mdi-advertisements"
          title="Advertisements"
          tooltip="Advertisements"
        />
        <side-menu-item
          class_name="ml-4"
          route_name="changePassword"
          icon="mdi mdi-lock-reset"
          title="Change Password"
          tooltip="Change password"
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
      publisherName: "",
      created_at: "",
    },
    drawer: false,
    preview: true,
    menu: false,
  }),
  components: {
    SideMenuItem,
  },
  computed: {
    navigationDrawerMainTitle() {
      return this.user?.publisherName || this.user?.email;
    },
    joinDate() {
      let date = new Date(this.user.created_at);
      console.log(date);
      return this.user.created_at.split(" ")[0];
    },
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
    },

    redirectToAdvertisementsPage() {
      if (router.currentRoute.name !== "advertisements") {
        router.push({ name: "advertisements" });
      }
    },
  },
};
</script>
