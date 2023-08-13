<template>
  <v-container fluid>
    <v-data-table
      :footer-props="{
        pageText: '{0}-{1} of {2}',
        itemsPerPageText: 'Publishers per page',
        itemsPerPageOptions: [10, 20],
      }"
      :headers="publisherHeaders"
      :items="upToDatePublishers"
      :search="searchPublisherString"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Publishers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="searchPublisherString"
            append-icon="mdi-magnify"
            hide-details
            label="Search (name)"
            single-line
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="mb-2" color="primary" dark @click="createNewPublisher"
            >Add</v-btn
          >
          <add-or-edit-publisher-component
            @reloadPublishers="loadAllPublishers"
            @updatePublisherData="updatePublisherData"
            @closeDialogEvent="showDialog = false"
            :showDialog="showDialog"
            :publisher="publisher"
          />
        </v-toolbar>
      </template>
      <template v-slot:item.active="{ item }">
        <v-switch
          v-model="item.active"
          inset
          color="green"
          :label="item.active ? `Yes` : `No`"
          @click="togglePublisherActiveStatus(item)"
        ></v-switch>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              small
              v-bind="attrs"
              @click="editPublisher(item)"
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
              @click="deleteSelectedPublisher(item)"
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
  deletePublisher,
  getAllPublishers,
  togglePublisherStatus,
} from "@/api/publishers";
import state from "@/store";
import { publisherHeaders } from "@/mixins/tableHeaders";
import AddOrEditPublisherComponent from "@/components/AddOrEditPublisherComponent";

export default {
  name: "PublishersView",
  components: { AddOrEditPublisherComponent },
  data: () => ({
    searchPublisherString: "",
    publisherHeaders: [],
    itms: [10, 20],
    publishers: [],
    showDialog: false,
    publisher: null,
  }),
  created() {
    this.loadAllPublishers();
    this.publisherHeaders = publisherHeaders;
  },
  computed: {
    upToDatePublishers() {
      return this.publishers;
    },
  },
  methods: {
    async loadAllPublishers() {
      try {
        let response = await getAllPublishers();
        this.publishers = response.data;
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
    },
    async editPublisher(item) {
      this.publisher = item;
      this.showDialog = true;
    },
    async deleteSelectedPublisher(item) {
      try {
        await deletePublisher(item);
        this.showSuccessSnackbar("Publisher successfully deleted");
        await this.loadAllPublishers();
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
    },
    async togglePublisherActiveStatus(item) {
      try {
        await togglePublisherStatus(item);
        this.showSuccessSnackbar("Publisher status changed");
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
    createNewPublisher() {
      this.publisher = null;
      this.showDialog = true;
    },
    updatePublisherData(item) {
      let original = this.publishers.findIndex((e) => e.id === item.id);
      if (original !== -1) {
        this.publishers[original].name = item.name;
        this.publishers[original].email = item.email;
        this.publishers[original].updated_at = item.updated_at;
      }
    },
  },
};
</script>
