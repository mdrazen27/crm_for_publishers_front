<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :footer-props="{
          pageText: '{0}-{1} od {2}',
          itemsPerPageText: 'Admins per page',
          itemsPerPageOptions: [10, 20],
        }"
        :headers="adminHeaders"
        :items="upToDateUsers"
        :search="searchAdminUsersString"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Admin users</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="searchAdminUsersString"
              append-icon="mdi-magnify"
              hide-details
              label="Pretraga"
              single-line
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="adminUserDialog" max-width="700px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mb-2"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Add
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="info title white--text font-weight-bold">
                  {{ AdminUserFormTitle }}
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-form ref="AdminUserForm" v-model="AdminUserFormValid">
                      <v-row>
                        <v-col cols="12" hidden md="6" sm="12">
                          <v-text-field
                            v-model="adminUserItem.id"
                            label="Id"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                          <v-text-field
                            v-model="adminUserItem.email"
                            :rules="fieldRules.email"
                            clearable
                            counter="200"
                            label="Email"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="12"
                          sm="12"
                          v-if="!adminUserItem.id"
                        >
                          <v-text-field
                            v-model="adminUserItem.password"
                            :rules="fieldRules.required"
                            clearable
                            counter="200"
                            label="Password"
                            required
                          ></v-text-field>
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
                    @click="closeAdminUserEdit"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    :disabled="!enableAdminUserSave"
                    color="green darken-1 font-weight-bold"
                    text
                    @click="validateAdminUserForm"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                class="mr-2"
                small
                v-bind="attrs"
                @click="editAdminUserItem(item)"
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
                @click="deleteItem(item)"
                v-on="on"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { adminHeaders } from "@/mixins/tableHeaders";
import { fieldRules } from "@/mixins/fieldRules";
import { defaultAdmin } from "@/mixins/defaultItems";
import {
  deleteAdminUser,
  getAllAdminUsers,
  saveAdminUser,
  updateAdminUser,
} from "@/api/adminUsers";
import state from "@/store";

export default {
  name: "AdminUsersView",
  components: {},
  data: () => ({
    searchAdminUsersString: "",
    adminUserDialog: false,
    adminHeaders: [],
    adminUsers: [],
    AdminUserFormTitle: "Create new admin",
    AdminUserFormValid: true,
    adminUserItem: {},
    fieldRules: null,
    enableAdminUserSave: true,
  }),
  created() {
    this.adminHeaders = adminHeaders;
    this.fieldRules = fieldRules;
    this.adminUserItem = Object.assign({}, defaultAdmin);
    this.loadAllAdminUsers();
  },
  computed: {
    upToDateUsers() {
      return this.adminUsers;
    },
  },
  methods: {
    async loadAllAdminUsers() {
      try {
        let response = await getAllAdminUsers();
        this.adminUsers = response.data;
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
    },

    editAdminUserItem(item) {
      this.adminUserItem = this.adminUsers.indexOf(item);
      this.adminUserItem = Object.assign({}, item);
      this.AdminUserFormTitle = item.email;
      this.adminUserDialog = true;
    },

    validateAdminUserForm() {
      if (this.$refs.AdminUserForm.validate()) {
        this.saveAdminUser();
      }
    },
    async saveAdminUser() {
      this.enableAdminUserSave = false;
      try {
        if (this.adminUserItem.id) {
          let response = await updateAdminUser(this.adminUserItem);
          console.log(response.data);
          await state.dispatch("showSnackbar", {
            text: "Admin successfully updated",
            color: "green",
          });
          this.updateAdminUserData(response.data);
        } else {
          await saveAdminUser(this.adminUserItem);
          await state.dispatch("showSnackbar", {
            text: "Admin successfully created",
            color: "green",
          });
          await this.loadAllAdminUsers();
        }
        this.closeAdminUserEdit();
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
      this.enableAdminUserSave = true;
    },

    async deleteItem(item) {
      try {
        await deleteAdminUser(item);
        await state.dispatch("showSnackbar", {
          text: "Admin successfully deleted!",
          color: "green",
        });
        await this.loadAllAdminUsers();
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
    },
    updateAdminUserData(data) {
      let userIndex = this.adminUsers.findIndex((e) => e.id === data.id);
      if (userIndex !== -1) {
        this.adminUsers[userIndex].email = data.email;
      }
    },

    closeAdminUserEdit() {
      this.adminUserDialog = false;
      this.adminUserItem = Object.assign({}, defaultAdmin);
      this.$refs.AdminUserForm.resetValidation();
      this.AdminUserFormTitle = "Create new admin";
    },
  },

  watch: {
    adminUserDialog(val) {
      val || this.closeAdminUserEdit();
    },
  },
};
</script>
