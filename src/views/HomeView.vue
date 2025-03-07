<script setup lang="ts">
import Assignment from '@/utils/Assignment'
import { useSettings } from '../store/settings'
import HomeType from '@/components/HomeType.vue'

const { assignments } = useSettings()

const { culture, metha, other, slurry } = Assignment.buildDrivers(assignments.value)
const { culture: culturePlot, slurry: slurryPlot } = Assignment.buildPlots(assignments.value)
</script>

<template>
  <div class="container p-4">
    <div class="accordion" id="homeAccordion">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseCulture"
            aria-expanded="true"
            aria-controls="collapseCulture"
          >
            Culture
          </button>
        </h2>
        <div
          id="collapseCulture"
          class="accordion-collapse collapse show"
          data-bs-parent="#homeAccordion"
        >
          <div class="accordion-body">
            <HomeType
              :driverPlotChooser="true"
              :values="culture"
              :plotValues="culturePlot.plotsAssignmentsDrivers"
              :taskValues="culturePlot.plotsAssignmentsTasks"
            />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseMetha"
            aria-expanded="false"
            aria-controls="collapseMetha"
          >
            Méthanisation
          </button>
        </h2>
        <div id="collapseMetha" class="accordion-collapse collapse" data-bs-parent="#homeAccordion">
          <div class="accordion-body">
            <HomeType :driverPlotChooser="false" :values="metha" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOther"
            aria-expanded="false"
            aria-controls="collapseOther"
          >
            Autres
          </button>
        </h2>
        <div id="collapseOther" class="accordion-collapse collapse" data-bs-parent="#homeAccordion">
          <div class="accordion-body">
            <HomeType :driverPlotChooser="false" :values="other" />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseSlurry"
            aria-expanded="false"
            aria-controls="collapseSlurry"
          >
            Lisier / Digestat
          </button>
        </h2>
        <div
          id="collapseSlurry"
          class="accordion-collapse collapse"
          data-bs-parent="#homeAccordion"
        >
          <div class="accordion-body">
            <HomeType
              :driverPlotChooser="true"
              :values="slurry"
              :plotValues="slurryPlot.plotsAssignmentsDrivers"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
