<template>
  <v-container fluid>
    <v-data-table
      :footer-props="{
        pageText: '{0}-{1} of {2}',
        itemsPerPageText: 'Advertisements per page',
        itemsPerPageOptions: itemsPerPage,
      }"
      :headers="advertisementHeaders"
      :items="upToDateAdvertisements"
      :search="searchAdvertisementString"
      :options.sync="options"
      :server-items-length="totalAdvertisements"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Advertisements</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="searchAdvertisementString"
            append-icon="mdi-magnify"
            hide-details
            label="Search"
            single-line
          ></v-text-field>
          <v-checkbox
            class="mt-5"
            label="Deleted"
            v-model="onlyDeleted"
            @change="loadAllAdvertisements"
          ></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn
            v-if="userRole !== 1"
            class="mb-2"
            color="primary"
            dark
            @click="createNewAdvertisement"
          >
            Add
          </v-btn>
          <add-or-edit-advertisement
            @reloadAdvertisements="loadAllAdvertisements"
            @updateAdvertisementData="updateAdvertisementData"
            @closeDialogEvent="showDialog = false"
            :showDialog="showDialog"
            :advertisement="advertisement"
          />
        </v-toolbar>
      </template>
      <template v-slot:item.active="{ item }">
        <v-switch
          v-model="item.active"
          :disabled="userRole === 1 || onlyDeleted"
          inset
          color="green"
          @click="toggleAdvertisementActiveStatus(item)"
        ></v-switch>
      </template>

      <template v-slot:item.actions="{ item }" v-if="!onlyDeleted">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              small
              v-bind="attrs"
              @click="editAdvertisement(item)"
              v-on="on"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              color="red darken-3"
              small
              v-bind="attrs"
              @click="deleteSelectedAdvertisement(item)"
              v-on="on"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {
  deleteAdvertisement,
  getAllAdvertisements,
  toggleAdvertisementStatus,
} from "@/api/advertisements";
import state from "@/store";
import {
  advertisementHeaders,
  adminAdvertisementHeaders,
} from "@/mixins/tableHeaders";
import AddOrEditAdvertisement from "@/components/AddOrEditAdvertisement";

export default {
  name: "AdvertisementsView",
  components: { AddOrEditAdvertisement },
  data: () => ({
    searchAdvertisementString: "",
    advertisementHeaders: [],
    itemsPerPage: [10, 20],
    advertisements: [],
    showDialog: false,
    advertisement: null,
    totalAdvertisements: 0,
    onlyDeleted: false,
    loading: true,
    options: {},
    callApi: true,
    userRole: null,
  }),
  created() {
    this.userRole = state.getters["auth/role"];
    if (this.userRole === 1) {
      this.advertisementHeaders = adminAdvertisementHeaders;
    } else {
      this.advertisementHeaders = advertisementHeaders;
    }
  },
  computed: {
    upToDateAdvertisements() {
      return this.advertisements;
    },
  },
  methods: {
    async loadAllAdvertisements() {
      try {
        this.loading = true;
        let response = await getAllAdvertisements(
          this.options,
          this.searchAdvertisementString,
          this.onlyDeleted
        );
        this.advertisements = response.data;
        this.totalAdvertisements = response.meta.total;
        if (this.options.page > response.meta.last_page) {
          this.callApi = false;
          this.options.page = 1;
        }
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
      this.loading = false;
    },
    async editAdvertisement(item) {
      this.advertisement = item;
      this.showDialog = true;
    },
    async deleteSelectedAdvertisement(item) {
      try {
        await deleteAdvertisement(item);
        this.showSuccessSnackbar("Advertisement successfully deleted");
        await this.loadAllAdvertisements();
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
    },
    async toggleAdvertisementActiveStatus(item) {
      try {
        await toggleAdvertisementStatus(item);
        this.showSuccessSnackbar("Advertisement status changed");
      } catch (e) {
        item.active = !item.active;
        await state.dispatch("errorHandler/errorHandler", e);
      }
    },
    showSuccessSnackbar(message) {
      state.dispatch("showSnackbar", {
        color: "green",
        text: message,
      });
    },
    createNewAdvertisement() {
      this.advertisement = null;
      this.showDialog = true;
    },
    updateAdvertisementData(item) {
      let original = this.advertisements.findIndex((e) => e.id === item.id);
      if (original !== -1) {
        this.advertisements[original].name = item.name;
        this.advertisements[original].email = item.email;
        this.advertisements[original].updated_at = item.updated_at;
      }
    },
  },
  watch: {
    options: {
      handler() {
        if (this.callApi) {
          this.loadAllAdvertisements();
        }
        this.callApi = true;
      },
      deep: true,
    },
    searchAdvertisementString: {
      handler() {
        if (!this.loading) {
          this.loadAllAdvertisements();
        }
      },
      deep: true,
    },
  },
};
</script>
