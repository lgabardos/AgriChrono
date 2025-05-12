<script setup lang="ts">
import { RouterView } from 'vue-router'
import BSNavbar from './components/BSNavbar.vue'
import { useConnectivity } from './store/connectivity'
import { App as CapacitorApp } from '@capacitor/app'
import { Network } from '@capacitor/network'
import { useSettings } from './store/settings'

CapacitorApp.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack) {
    CapacitorApp.exitApp()
  } else {
    window.history.back()
  }
})

window.addEventListener('hide.bs.modal', () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
})

Network.addListener('networkStatusChange', (status) => {
  useConnectivity().isOnline.value = status.connected
  syncIfConnected()
})
Network.getStatus().then((status) => {
  useConnectivity().isOnline.value = status.connected
  useSettings().loadAssignmentsToSync().then(() => {
    syncIfConnected()
  })
})

const syncIfConnected = () => {
  if (useConnectivity().isOnline.value && useSettings().assignmentsToSync.value.length > 0) {
    useConnectivity().sync()
  }
}
</script>

<template>
  <BSNavbar />

  <RouterView />
</template>
