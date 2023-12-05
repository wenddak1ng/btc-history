<script setup>
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment'
import LoaderIcon from './LoaderIcon.vue';

let chartId = String(Math.random() * 1000000 + 10000000);
let chart = null

const props = defineProps(['startTime', 'endTime', 'symbol'])

const loading = ref(false)
const data = {
  datasets: []
}

function fetchData(symbol, startTime, endTime) {
  loading.value = true

  fetch(`//localhost:8080/data?symbol=${symbol}&startTime=${startTime}&endTime=${endTime}`)
    .then((res) => res.json()
    .then((ohlcv) => {
      data.datasets = [{
        data: ohlcv
      }]
      loading.value = false
      updateChart()
    }))
}

function updateChart() {
  if (!chart) return;

  const timeFormat = 'DD.MM.YYYY HH:mm'

  chart.options = {
    scales: {
      x: {
        grid: {
          color: (ctx) => {
            const { tick, index } = ctx;
            if (tick && index === 0) {
              return '#1b1b1b';
            }
            return '#272726';
          },
        },
        type: 'time',
        stacked: true,
        time: {
          parser: timeFormat,
          unit: 'second',
          displayFormats: {
            second: timeFormat,
            hour: timeFormat,
          },
          tooltipFormat: timeFormat,
        },

        ticks: {
          color: '#757370',
          autoSkip: true,
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0,
          stepSize: 360,
        },
      },
      y: {
        grid: {
          color: (ctx) => {
            const { tick, index, scale } = ctx;
            if (tick && index === scale.ticks.length - 1) {
              return 'transparent';
            }
            return '#272726';
          },
        },
        ticks: {
          color: '#757370',
          maxTicksLimit: 8,
          callback: (value) => {
            const valueNumber = Number(value);
            return `$${valueNumber}`
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  }

  chart.update()
}

function initChart() {
  const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
  };

  const ctxElement = document.getElementById(chartId);
  if (!ctxElement) return;
  const ctx = ctxElement.getContext('2d');
  if (!ctx) return;

  const corsair = {
    id: 'corsair',
    defaults: {
      width: 1.5,
      color: '#757370',
      dash: [1.5, 3],
    },

    afterInit: (chart, _args, _opts) => {
      chart.corsair = {
        x: 0,
        y: 0,
      };
    },

    afterEvent: (chart, args) => {
      const { inChartArea } = args;
      const { _type, x, y } = args.event;

      chart.corsair = { x, y, draw: inChartArea };
      chart.draw();
    },

    beforeDatasetsDraw: (chart, args, opts) => {
      if (!chart.corsair) {
        return;
      }
      const { ctx } = chart;
      const { top, bottom, left, right } = chart.chartArea;
      const { x, y, draw } = chart.corsair;

      if (!draw) return;

      ctx.save();

      ctx.beginPath();
      ctx.lineWidth = opts.width;
      ctx.strokeStyle = opts.color;
      ctx.setLineDash(opts.dash);
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top);
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();

      ctx.restore();
    },
  };

  const customCanvasBackgroundColor = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#1b1b1b';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  chart = Object.seal(
    new Chart(ctx, {
      type: 'line',
      data: data,
      options: chartOptions,
      plugins: [corsair, customCanvasBackgroundColor],
    }),
  );

  chart.update()
}

onMounted(() => {
  initChart()
  fetchData(props.symbol, props.startTime, props.endTime)
})

watch(() => props, (newValue) => {
  fetchData(newValue.symbol, newValue.startTime, newValue.endTime)
}, {
  deep: true
})
</script>

<template>
  <div class="container">
    <div v-if="loading" class="loader-container">
      <LoaderIcon class="loader" />
    </div>
    <canvas
      :id="chartId"
      class="cursor-pointer canvas relative"
      width="100%"
      height="40%"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: max-content;
}

.loader-container {
  background-color: #00000020;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-container .loader {
  width: 4rem;
  height: 4rem;
}
</style>
