<template>
  <v-dialog v-model="publisherDialog" max-width="700px">
    <v-card>
      <v-card-title class="info title white--text font-weight-bold">
        {{ publisherDialogTitle }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="publisherForm" v-model="publisherFormValid">
            <v-row>
              <v-col cols="12" hidden md="6" sm="12">
                <v-text-field
                  v-model="publisherItem.id"
                  label="Id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  v-model="publisherItem.name"
                  :rules="fieldRules.required"
                  clearable
                  counter="255"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  v-model="publisherItem.email"
                  :rules="fieldRules.email"
                  clearable
                  counter="255"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <template v-if="!publisherItem.id">
                <v-col cols="12" md="12" sm="12">
                  <v-text-field
                    v-model="publisherItem.password"
                    :rules="fieldRules.required"
                    clearable
                    counter="255"
                    label="Password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <span>
                    Status: {{ publisherItem.active ? "Active" : "Inactive" }}
                  </span>
                  <v-switch v-model="publisherItem.active" inset color="green">
                  </v-switch>
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1 font-weight-bold"
          text
          @click="publisherDialog = false"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="!enablePublisherSave"
          color="green darken-1 font-weight-bold"
          text
          @click="validatePublisherForm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { savePublisher, updatePublisher } from "@/api/publishers";
import state from "@/store";
import { fieldRules } from "@/mixins/fieldRules";
import { defaultPublisher } from "@/mixins/defaultItems";

export default {
  name: "AddOrEditPublisher",
  props: ["publisher", "showDialog"],
  data: () => ({
    publisherDialogTitle: "Create new publisher",
    publisherDialog: false,
    publisherFormValid: true,
    publisherItem: {},
    fieldRules: null,
    enablePublisherSave: true,
  }),
  created() {
    this.fieldRules = fieldRules;
  },
  methods: {
    validatePublisherForm() {
      if (this.$refs.publisherForm.validate()) this.savePublisher();
    },
    async savePublisher() {
      try {
        this.enablePublisherSave = false;
        if (this.publisherItem.id) {
          let response = await updatePublisher(this.publisherItem);
          await state.dispatch("showSnackbar", {
            color: "green",
            text: "Publisher successfully updated",
          });
          this.$emit("updatePublisherData", response.data);
        } else {
          await savePublisher(this.publisherItem);
          await state.dispatch("showSnackbar", {
            color: "green",
            text: "Publisher successfully created",
          });
          this.$emit("reloadPublishers");
        }
        this.closeDialog();
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
      this.enablePublisherSave = true;
    },
    closeDialog() {
      this.$emit("closeDialogEvent");
      this.$refs.publisherForm.resetValidation();
      this.publisherItem = Object.assign({}, defaultPublisher);
    },
    openDialog() {
      if (this.publisher) {
        this.publisherItem = Object.assign({}, this.publisher);
        this.publisherDialogTitle = "Edit " + this.publisher.name;
      } else {
        this.publisherDialogTitle = "Create new publisher";
      }
    },
  },
  watch: {
    publisherDialog(val) {
      val ? this.openDialog() : this.closeDialog();
    },
    showDialog: {
      handler() {
        this.publisherDialog = this.showDialog;
      },
    },
  },
};
</script>
