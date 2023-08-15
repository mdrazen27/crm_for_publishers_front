<template>
  <div :style="{ height: height + 'px' }">
    <Bar :data="dataChanger" :options="options" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  components: { Bar },
  props: ["labels", "chartData", "height"],
  created() {},
  computed: {
    dataChanger() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#4d92f5",
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
