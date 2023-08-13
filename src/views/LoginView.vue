<template>
  <v-container>
    <v-row class="justify-center mt-10">
      <v-col cols="6">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent
        >
          <v-text-field
            v-model="email"
            :rules="fieldRules.email"
            autofocus
            clearable
            counter="200"
            label="Email"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="fieldRules.required"
            clearable
            counter="200"
            label="Password"
            required
            type="password"
          ></v-text-field>

          <v-checkbox v-model="checkbox" label="Remember me"></v-checkbox>

          <v-btn class="info mr-4 white--text" type="submit" @click="validate">
            Prijavi se
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
    checkbox: true,
    user: null
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
        let response = await login({
          email: this.email,
          password: this.password
        });
        await state.dispatch("auth/setAuthToken", response.accessToken);
        await state.dispatch("auth/setUser", response.user);
        await state.dispatch("auth/setRole", response.user.role_id);
        const userRole = rolesMap.find(
          (e) => e.id === response.user.role_id
        );
        router.push({ name: userRole.redirect }).catch((err) => {
          // Ignore the vuex err regarding navigating to the page they are already on.
          if (err.name !== "NavigationDuplicated" && !err.message.includes("Avoided redundant navigation to current location")) {
            // But print any other errors to the console
            console.error(err);
          }
        });
      } catch (e) {
        await state.dispatch("errorHandler/errorHandler", e);
      }
    }
  },
  components: {}
};
</script>
