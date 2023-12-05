<script setup>
import Chart from '@/components/ChartComponent.vue'
import moment from 'moment'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'


const endTime = ref(moment().unix())
const startTime = ref(moment().subtract(1, 'days').unix())
const startDate = ref()
const endDate = ref()
const symbol = ref('BTCUSDT')

function changePeriod(days) {
  endTime.value = moment().unix()
  startTime.value = moment().subtract(days, 'days').unix()
}

function searchByDates() {
  if (!startDate.value || !endDate.value) {
    return;
  }

  endTime.value = moment(endDate.value).unix()
  startTime.value = moment(startDate.value).unix()
}
</script>

<template>
  <div class="container">
    <div class="buttons">
      <div
        class="button"
        @click="changePeriod(1)"
      >1 день</div>
      <div
        class="button"
        @click="changePeriod(7)"
      >7 дней</div>
      <div
        class="button"
        @click="changePeriod(30)"
      >30 дней</div>
      <div
        class="button"
        @click="changePeriod(365)"
      >365 дней</div>

      <VueDatePicker
        v-model="startDate"
        placeholder="Дата начала"
        :enable-time-picker="false"
        :max-date="new Date()"
        format="dd/MM/yyyy"
        locale="ru"
        :dark="true"
      />

      <VueDatePicker
        v-model="endDate"
        placeholder="Дата окончания"
        :enable-time-picker="false"
        :max-date="new Date()"
        format="dd/MM/yyyy"
        locale="ru"
        :dark="true"
      />

      <div
        class="button"
        @click="searchByDates()"
      >Поиск по датам</div>
    </div>

    <Chart
      :symbol="symbol"
      :startTime="startTime"
      :endTime="endTime"
    />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container .chart {
  display: block;
  justify-content: center;
}

.container .buttons {
  margin: 2rem 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.container .buttons .button {
  white-space: nowrap;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: #333;
  color: #FFF;
  transition: background-color 0.15s linear;
}

.container .buttons .button:hover {
  background-color: #3f3f3f;
}
</style>
