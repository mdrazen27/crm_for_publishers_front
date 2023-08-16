<template>
  <v-container class="full-size-centered">
    <v-row class="no-growth">
      <v-col cols="12">
        <v-img
          :src="require('@/assets/logo.svg')"
          class="my-3"
          contain
          height="120"
        />
      </v-col>
    </v-row>
    <v-row class="justify-center mt-5 no-growth">
      <v-col sm="10" md="7" lg="5" xl="4">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-text-field
            v-model="email"
            :rules="fieldRules.email"
            autofocus
            label="Email"
            required
            @focusout="resetValidation"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="fieldRules.password"
            label="Password"
            required
            @focusout="resetValidation"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-btn
            class="info mr-4 white--text"
            type="submit"
            @click="validate"
            :disabled="!enableLogin"
          >
            Log in
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { login } from "@/api/auth";

import { fieldRules } from "@/mixins/fieldRules";
import router, { rolesMap } from "@/router";
import state from "@/store";

export default {
  name: "LoginView",
  data: () => ({
    valid: true,
    email: "",
    password: "",
    fieldRules: [],
    user: null,
    enableLogin: true,
    showPassword: false,
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
        this.enableLogin = false;
        let response = await login({
          email: this.email,
          password: this.password,
        });
        await state.dispatch("auth/setUser", response.user);
        await state.dispatch("auth/setRole", response.user.role_id);
        await state.dispatch("auth/setAuthToken", response.accessToken);
        const userRole = rolesMap.find((e) => e.id === response.user.role_id);
        router.push({ name: userRole.redirect }).catch((err) => {
          // Ignore the vuex err regarding navigating to the page they are already on.
          if (
            err.name !== "NavigationDuplicated" &&
            !err.message.includes(
              "Avoided redundant navigation to current location"
            )
          ) {
            // But print any other errors to the console
            console.error(err);
          }
        });
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
      this.enableLogin = true;
    },
  },
  components: {},
};
</script>

<style>
.full-size-centered {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.no-growth {
  flex: 0;
}
</style>
