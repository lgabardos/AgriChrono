<script setup lang="ts">
import { useSettings } from '@/store/settings'
import type { DriverAssignments, PlotAssignments } from '@/utils/Assignment'
import { computed, ref } from 'vue'

const props = defineProps<{
  driverPlotChooser: boolean
  values: { [index: string]: DriverAssignments[] }
  plotValues?: { [index: string]: PlotAssignments[] }
  taskValues?: { [index: string]: PlotAssignments[] }
  roundValues?: boolean
}>()

const { drivers } = useSettings()
const byDrivers = ref(true)

const getDriverTotal = (idDriver: number) => {
  return (
    props.values[idDriver]?.reduce((acc, a) => acc + (props.roundValues ? a.value! : a.time), 0) ??
    0
  ).toFixed(props.roundValues ? 0 : 2)
}
const getPlotTotal = (plot: string) => {
  if (!props.plotValues) return '0'
  return (
    props.plotValues[plot]?.reduce((acc, p) => acc + (props.roundValues ? p.value! : p.time), 0) ??
    0
  ).toFixed(props.roundValues ? 0 : 2)
}
const unit = computed(() => {
  return props.roundValues ? ' tours' : 'h'
})
</script>
<template>
  <div v-if="driverPlotChooser" class="btn-group mb-2">
    <a href="#" :class="'btn btn-primary ' + (byDrivers ? 'active' : '')" @click="byDrivers = true"
      >Par chauffeurs</a
    >
    <a
      href="#"
      :class="'btn btn-primary ' + (!byDrivers ? 'active' : '')"
      @click="byDrivers = false"
      >Par parcelles</a
    >
  </div>
  <div v-if="byDrivers" class="row">
    <div v-for="driver of drivers" :key="driver.id" class="col-md-4 col-sm-12 p-1">
      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th class="fw-bold" scope="col">{{ driver.name }}</th>
                <th class="fw-bold" scope="col">{{ getDriverTotal(driver.id) }}{{ unit }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(assignment, i) of values[driver.id]" :key="driver.id + '-' + i">
                <th scope="row">{{ assignment.name }}</th>
                <td v-if="assignment.value">{{ assignment.value.toFixed(0) }}</td>
                <td v-else>{{ assignment.time.toFixed(2) }}h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="plotValues" class="row">
    <div v-for="plot of Object.keys(plotValues)" :key="plot" class="col-md-4 col-sm-12 p-1">
      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th class="fw-bold" scope="col">{{ plot }}</th>
                <th class="fw-bold" scope="col">{{ getPlotTotal(plot) }}{{ unit }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) of plotValues[plot]" :key="plot + i">
                <th scope="row">{{ p.name }}</th>
                <td v-if="p.value">{{ p.value.toFixed(0) }}</td>
                <td v-else>{{ p.time.toFixed(2) }}h</td>
              </tr>
              <template v-if="taskValues">
                <tr v-for="(p, i) of taskValues[plot]" :key="plot + i" class="table-info">
                  <th scope="row">{{ p.name }}</th>
                  <td>{{ p.time.toFixed(2) }}h</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
