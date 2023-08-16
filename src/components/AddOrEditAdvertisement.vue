<template>
  <v-dialog v-model="advertisementDialog" max-width="700px">
    <v-card>
      <v-card-title class="info title white--text font-weight-bold">
        {{ advertisementDialogTitle }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="advertisementForm" v-model="advertisementFormValid">
            <v-row>
              <v-col cols="12" hidden md="6" sm="12">
                <v-text-field
                  v-model="advertisementItem.id"
                  label="Id"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  v-model="advertisementItem.name"
                  :rules="fieldRules.required"
                  clearable
                  counter="255"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field
                  v-model="advertisementItem.url"
                  :rules="fieldRules.url"
                  clearable
                  counter="255"
                  label="Url"
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="!advertisementItem.id">
                <span>
                  Status: {{ advertisementItem.active ? "Active" : "Inactive" }}
                </span>
                <v-switch
                  v-model="advertisementItem.active"
                  inset
                  color="green"
                >
                </v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1 font-weight-bold"
          text
          @click="advertisementDialog = false"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="!enableAdvertisementSave"
          color="green darken-1 font-weight-bold"
          text
          @click="validateAdvertisementForm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { saveAdvertisement, updateAdvertisement } from "@/api/advertisements";
import state from "@/store";
import { fieldRules } from "@/mixins/fieldRules";
import { defaultAdvertisement } from "@/mixins/defaultItems";

export default {
  name: "AddOrEditAdvertisementComponent",
  props: ["advertisement", "showDialog"],
  data: () => ({
    advertisementDialogTitle: "Create new advertisement",
    advertisementDialog: false,
    advertisementFormValid: true,
    advertisementItem: {},
    fieldRules: null,
    enableAdvertisementSave: true,
  }),
  created() {
    this.fieldRules = fieldRules;
  },
  methods: {
    validateAdvertisementForm() {
      if (this.$refs.advertisementForm.validate()) this.saveAdvertisement();
    },
    async saveAdvertisement() {
      try {
        this.enableAdvertisementSave = false;
        if (this.advertisementItem.id) {
          let response = await updateAdvertisement(this.advertisementItem);
          await state.dispatch("showSnackbar", {
            color: "green",
            text: "Advertisement successfully updated",
          });
          this.$emit("updateAdvertisementData", response.data);
        } else {
          await saveAdvertisement(this.advertisementItem);
          await state.dispatch("showSnackbar", {
            color: "green",
            text: "Advertisement successfully created",
          });
          this.$emit("reloadAdvertisements");
        }
        this.closeDialog();
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
      this.enableAdvertisementSave = true;
    },
    closeDialog() {
      this.$emit("closeDialogEvent");
      this.$refs.advertisementForm.resetValidation();
      this.advertisementItem = Object.assign({}, defaultAdvertisement);
    },
    openDialog() {
      if (this.advertisement) {
        this.advertisementItem = Object.assign({}, this.advertisement);
        this.advertisementDialogTitle = "Edit " + this.advertisement.name;
      } else {
        this.advertisementDialogTitle = "Create new advertisement";
      }
    },
  },
  watch: {
    advertisementDialog(val) {
      val ? this.openDialog() : this.closeDialog();
    },
    showDialog: {
      handler() {
        this.advertisementDialog = this.showDialog;
      },
    },
  },
};
</script>
