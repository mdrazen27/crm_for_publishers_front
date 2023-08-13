<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item
        :class="class_name"
        :to="{ name: route_name }"
        v-bind="attrs"
        v-on="on"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="text-left">
          <v-list-item-title>{{ title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <span>{{ tooltip === "" ? title : tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "SideMenuItem",
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    route_name: {
      type: String,
      default: "",
    },
    class_name: {
      type: String,
      default: "",
    },
    tooltip: {
      type: String,
      default: "",
    },
  },
};
</script>
