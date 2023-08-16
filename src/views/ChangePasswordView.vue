<template>
  <v-container class="full-size-centered">
    <v-row class="justify-center mt-5 no-growth">
      <v-col sm="10" md="7" lg="5" xl="4">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field
            v-model="oldPassword"
            :rules="fieldRules.password"
            autofocus
            label="Old Password"
            required
            :type="showOldPassword ? 'text' : 'password'"
            :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showOldPassword = !showOldPassword"
            @focusout="resetValidation"
          ></v-text-field>
          <v-text-field
            v-model="newPassword"
            :rules="fieldRules.password"
            label="New Password"
            required
            @focusout="resetValidation"
            :type="showNewPassword ? 'text' : 'password'"
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showNewPassword = !showNewPassword"
          ></v-text-field>
          <v-text-field
            v-model="repeatPassword"
            :rules="fieldRules.password"
            :type="showRepeatPassword ? 'text' : 'password'"
            label="Password confirmation"
            required
            @focusout="resetValidation"
            :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showRepeatPassword = !showRepeatPassword"
          ></v-text-field>
          <v-btn
            class="float-end"
            @click="validate"
            :disabled="!enablePasswordChange"
          >
            Change Password</v-btn
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fieldRules } from "@/mixins/fieldRules";
import state from "@/store";
import { changePassword } from "@/api/auth";

export default {
  name: "ChangePasswordView",
  data: () => ({
    valid: true,
    repeatPassword: "",
    newPassword: "",
    oldPassword: "",
    showNewPassword: false,
    showRepeatPassword: false,
    showOldPassword: false,
    fieldRules: [],
    enablePasswordChange: true,
  }),
  created() {
    this.fieldRules = fieldRules;
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.submitForm();
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async submitForm() {
      try {
        this.enablePasswordChange = false;
        let result = await changePassword({
          newPassword: this.newPassword,
          oldPassword: this.oldPassword,
          repeatPassword: this.repeatPassword,
        });
        await state.dispatch("showSnackbar", {
          text: result.message,
          color: "green",
        });
        this.resetValidation();
        this.newPassword = "";
        this.oldPassword = "";
        this.repeatPassword = "";
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
      this.enablePasswordChange = true;
    },
  },
  components: {},
};
</script>

<style>
.full-size-centered {
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
