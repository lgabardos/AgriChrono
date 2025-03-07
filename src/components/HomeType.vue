<script setup lang="ts">
import { useSettings } from '@/store/settings'
import type { DriverAssignments, PlotAssignments } from '@/utils/Assignment'
import { ref } from 'vue'

const props = defineProps<{
  driverPlotChooser: boolean
  values: { [index: string]: DriverAssignments[] }
  plotValues?: { [index: string]: PlotAssignments[] }
  taskValues?: { [index: string]: PlotAssignments[] }
}>()

const { drivers } = useSettings()
const byDrivers = ref(true)

const getDriverTotal = (idDriver: number) => {
  return (props.values[idDriver]?.reduce((acc, a) => acc + a.time, 0) ?? 0).toFixed(2)
}
const getPlotTotal = (plot: string) => {
  if (!props.plotValues) return '0'
  return (props.plotValues[plot]?.reduce((acc, p) => acc + p.time, 0) ?? 0).toFixed(2)
}
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
          <h5 class="card-title">{{ driver.name }} ({{ getDriverTotal(driver.id) }}h)</h5>
          <div v-if="driverPlotChooser" class="card-text">
            <ul>
              <li v-for="(assignment, i) of values[driver.id]" :key="driver.id + '-' + i">
                {{ assignment.name }}: {{ assignment.time.toFixed(2) }}h
                <span v-if="assignment.value"> / {{ assignment.value.toFixed(0) }} tours</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="plotValues" class="row">
    <div v-for="plot of Object.keys(plotValues)" :key="plot" class="col-md-4 col-sm-12 p-1">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ plot }} ({{ getPlotTotal(plot) }}h)</h5>
          <div class="card-text">
            <ul>
              <li v-for="(p, i) of plotValues[plot]" :key="plot + i">
                {{ p.name }}: {{ p.time.toFixed(2) }}h
                <span v-if="p.value"> / {{ p.value.toFixed(0) }} tours</span>
              </li>
            </ul>
            <hr v-if="taskValues" />
            <ul v-if="taskValues">
              <li v-for="(p, i) of taskValues[plot]" :key="plot + i">
                {{ p.name }}: {{ p.time.toFixed(2) }}h
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
