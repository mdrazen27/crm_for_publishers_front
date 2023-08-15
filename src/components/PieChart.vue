<template>
  <Pie :data="dataChanger" :options="options" />
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  components: { Pie },
  props: ["labels", "chartData", "height"],
  created() {},
  computed: {
    dataChanger() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: "Data One",
            backgroundColor: [
              "#E3F2FD",
              "#BBDEFB",
              "#90CAF9",
              "#64B5F6",
              "#42A5F5",
              "#1E88E5",
              "#1976D2",
              "#1565C0",
              "#0D47A1",
              "#E3F2FD",
              "#BBDEFB",
              "#90CAF9",
              "#64B5F6",
              "#42A5F5",
              "#1E88E5",
              "#1976D2",
              "#1565C0",
              "#0D47A1",
            ],
            data: this.chartData,
          },
        ],
      };
    },
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
};
</script>
