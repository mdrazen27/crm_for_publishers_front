<template>
  <v-container fluid>
    <v-row>
      <v-col lg="4" md="6" sm="8" v-if="isAdmin">
        <v-autocomplete
          v-model="publisher"
          :items="publishers"
          :loading="isLoading"
          :search-input.sync="search"
          hide-no-data
          hide-selected
          item-text="name"
          item-value="id"
          label="Select publisher"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
          return-object
          clearable
          @change="loadStatistics"
        ></v-autocomplete>
      </v-col>
      <v-col class="mb-5" cols="12" md="12" sm="12">
        <v-card class="text-center">
          <v-card-title> Views per month for current year </v-card-title>
          <v-card-text>
            <bar-chart
              :chartData="viewsPerMonthChartData"
              :labels="viewsPerMonthLabels"
              :height="400"
            ></bar-chart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="mb-5" cols="12" md="12" sm="12">
        <v-card class="text-center">
          <v-card-title> Views per month for current year </v-card-title>
          <v-card-text>
            <line-chart
              :chartData="viewsPerDayChartData"
              :labels="viewsPerDayLabels"
              :height="400"
            ></line-chart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="mb-5" cols="12" lg="6" md="12" sm="12">
        <v-card class="text-center">
          <v-card-title> Top 10 countries by views </v-card-title>
          <v-card-text>
            <pie-chart
              :chartData="topTenCountriesChartData"
              :labels="topTenCountriesLabels"
              :height="400"
            ></pie-chart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="mb-5" cols="12" lg="6" md="12" sm="12">
        <v-card class="text-center">
          <v-card-title> Top 5 Advertisements by views </v-card-title>
          <v-card-text>
            <pie-chart
              :chartData="topFiveActiveAdvertisementsChartData"
              :labels="topFiveActiveAdvertisementsLabels"
              :height="400"
            ></pie-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  statisticsPerMonth,
  statisticsPerDay,
  topTenCountries,
  topFiveActiveAdvertisements,
} from "@/api/statistics";
import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
import PieChart from "@/components/PieChart";
import state from "@/store";
import { searchForPublisher } from "@/api/publishers";

export default {
  name: "StatisticsView",
  components: { BarChart, LineChart, PieChart },
  data: () => ({
    viewsPerMonthLabels: [],
    viewsPerMonthChartData: [],
    viewsPerDayChartData: [],
    topTenCountriesChartData: [],
    topFiveActiveAdvertisementsChartData: [],
    viewsPerDayLabels: [],
    topTenCountriesLabels: [],
    topFiveActiveAdvertisementsLabels: [],
    publishers: [],
    publisher: null,
    search: null,
    isLoading: false,
    isAdmin: false,
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  }),

  created() {
    this.isAdmin = state.getters["auth/role"] === 1;
    this.loadStatistics();
  },

  methods: {
    async loadStatisticsPerMonth() {
      let response = await statisticsPerMonth(this.publisher?.id);
      this.viewsPerMonthLabels = [...this.months];
      response.forEach((e) => {
        this.viewsPerMonthChartData[e.month] = e.count;
      });
    },

    async loadStatisticsPerDay() {
      let response = await statisticsPerDay(this.publisher?.id);
      this.viewsPerDayChartData = [];
      this.viewsPerDayLabels = [];
      response.forEach((e) => {
        this.viewsPerDayChartData.push(e.count);
        this.viewsPerDayLabels.push(e.date);
      });
    },

    async loadTopTenCountries() {
      let response = await topTenCountries(this.publisher?.id);

      this.topTenCountriesChartData = [];
      this.topTenCountriesLabels = [];
      response.forEach((e) => {
        this.topTenCountriesChartData.push(e.count);
        this.topTenCountriesLabels.push(e.country);
      });
    },

    async loadTopFiveActiveAdvertisements() {
      let response = await topFiveActiveAdvertisements(this.publisher?.id);
      this.topFiveActiveAdvertisementsChartData = [];
      this.topFiveActiveAdvertisementsLabels = [];
      response.forEach((e) => {
        this.topFiveActiveAdvertisementsChartData.push(e.count);
        this.topFiveActiveAdvertisementsLabels.push(e.advertisement?.name);
      });
    },

    loadStatistics() {
      try {
        this.loadStatisticsPerMonth();
        this.loadStatisticsPerDay();
        this.loadTopTenCountries();
        this.loadTopFiveActiveAdvertisements();
      } catch (e) {
        state.dispatch("errorHandler/errorHandler", e);
      }
    },
  },
  watch: {
    search: {
      async handler() {
        if (this.isLoading) return;
        this.isLoading = true;
        try {
          let response = await searchForPublisher(this.search);
          this.publishers = response.data;
        } catch (e) {
          await state.dispatch("errorHandler/errorHandler", e);
        }
        this.isLoading = false;
      },
    },
  },
};
</script>
