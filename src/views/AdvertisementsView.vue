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
          <v-spacer></v-spacer>
          <v-btn
            class="mb-2"
            color="primary"
            dark
            @click="createNewAdvertisement"
            >Add</v-btn
          >
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
          inset
          color="green"
          @click="toggleAdvertisementActiveStatus(item)"
        ></v-switch>
      </template>

      <template v-slot:item.actions="{ item }">
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
import { advertisementHeaders } from "@/mixins/tableHeaders";
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
  }),
  created() {
    this.loadAllAdvertisements();
    this.advertisementHeaders = advertisementHeaders;
  },
  computed: {
    upToDateAdvertisements() {
      return this.advertisements;
    },
  },
  methods: {
    async loadAllAdvertisements() {
      try {
        let response = await getAllAdvertisements();
        this.advertisements = response.data;
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
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
};
</script>
