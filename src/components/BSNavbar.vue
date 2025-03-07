<script setup lang="ts">
import { useAuth } from '@/store/auth'
import { useConnectivity } from '@/store/connectivity'
import { useSettings } from '@/store/settings'
import { BIconCloudSlash, BIconCloudArrowUp, BIconCloudCheck } from 'bootstrap-icons-vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const path = computed(() => route.path)
watch(path, () => {
  setActiveItem()
})

const isOnline = computed(() => useConnectivity().isOnline.value)
const syncing = computed(() => useConnectivity().syncing.value)
const synced = computed(() => useConnectivity().synced.value)
const assignmentsToSync = computed(() => useSettings().assignmentsToSync.value)
const isAdmin = computed(() => useAuth().currentMode.value === 'admin')
const modeSelected = computed(() => useAuth().currentMode.value)

const setActiveItem = () => {
  const items = document.querySelectorAll('.nav-link')
  items.forEach((item) => {
    item.classList.remove('active')
    if (item.getAttribute('href') === path.value) {
      item.classList.add('active')
    }
  })
}
const selectMenu = () => {
  const button = document.querySelector('#navbar-toggler:not(.collapsed)') as HTMLButtonElement
  if (button) {
    button.click()
  }
}

const exit = () => {
  useAuth().exit()
  selectMenu()
}

setActiveItem()
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
    <div class="container-fluid">
      <RouterLink
        to="/"
        class="navbar-brand"
        active-class="active"
        exact-active-class=""
        @click="selectMenu"
        >Agri Chrono</RouterLink
      >
      <div class="position-relative">
        <BIconCloudSlash v-if="!isOnline && !syncing && !synced" style="color: white" />
        <BIconCloudArrowUp v-else-if="syncing" style="color: white" />
        <BIconCloudCheck v-else-if="synced" style="color: white" />
        <span
          v-if="assignmentsToSync.length > 0"
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >{{ assignmentsToSync.length }}</span
        >
      </div>
      <button
        v-if="modeSelected !== ''"
        id="navbar-toggler"
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="isAdmin" class="nav-item">
            <RouterLink
              to="/"
              class="nav-link"
              active-class="active"
              exact-active-class=""
              @click="selectMenu"
              >Home</RouterLink
            >
          </li>
          <li v-if="isAdmin" class="nav-item">
            <RouterLink
              to="/assignments"
              class="nav-link"
              active-class="active"
              exact-active-class=""
              @click="selectMenu"
              >Affectations</RouterLink
            >
          </li>
          <li v-if="modeSelected === 'assignments'" class="nav-item">
            <RouterLink
              to="/simple"
              class="nav-link"
              active-class="active"
              exact-active-class=""
              @click="selectMenu"
              >Affectations</RouterLink
            >
          </li>
          <li v-if="isAdmin" class="nav-item">
            <RouterLink
              to="/settings"
              class="nav-link"
              active-class="active"
              exact-active-class=""
              @click="selectMenu"
              >Paramètres</RouterLink
            >
          </li>
          <li v-if="modeSelected !== ''" class="nav-item">
            <RouterLink
              to="/selectMode"
              class="nav-link"
              active-class="active"
              exact-active-class=""
              @click="exit"
              >Quitter</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
