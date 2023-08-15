<template>
  <div :style="{ height: height + 'px' }">
    <LineAlias :data="dataChanger" :options="options" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line as LineAlias } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  components: { LineAlias },
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
