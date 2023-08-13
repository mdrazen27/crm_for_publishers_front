<template>
  <v-container fluid>
    <v-data-table
      :footer-props="{
        pageText: '{0}-{1} od {2}',
        itemsPerPageText: 'Publishers per page',
      }"
      :headers="publisherHeaders"
      :items="publishers"
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
  getAllPublishers,
  deletePublisher,
  togglePublisherStatus,
} from "@/api/publishers";
import state from "@/store";
import { publisherHeaders } from "@/mixins/tableHeaders";

export default {
  name: "PublishersView",
  data: () => ({
    searchPublisherString: "",
    publisherHeaders: [],
    publishers: [],
  }),
  created() {
    this.loadAllPublishers();
    this.publisherHeaders = publisherHeaders;
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
      console.log(item);
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
  },
};
</script>
