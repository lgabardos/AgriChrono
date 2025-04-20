<script setup lang="ts">
import EnterCodeModal from '@/components/EnterCodeModal.vue'
import LoadingModal from '@/components/LoadingModal.vue'
import router from '@/router'
import { useAuth } from '@/store/auth'
import { useConnectivity } from '@/store/connectivity'
import { useSettings } from '@/store/settings'
import { Modal, Toast } from 'bootstrap'
import { computed, onMounted, ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { version as packageVersion } from '../../package.json'
import { androidVersionChecker } from '@/composables/androidVersionChecker'
import { InAppBrowser } from '@capacitor/inappbrowser'

const isOnline = computed(() => useConnectivity().isOnline.value)

const version = ref('')
const downloadUrl = ref('')

onMounted(() => {
  if (Capacitor.isNativePlatform()) {
    CapacitorApp.getInfo().then((info) => {
      version.value = `${info.version}`
    })
    androidVersionChecker()
      .check()
      .then((hasUpdate) => {
        if (hasUpdate) {
          androidVersionChecker()
            .getLatestAPK()
            .then((url) => {
              downloadUrl.value = url
              const versionToast = document.getElementById('versionToast')
              const toastBootstrap = Toast.getOrCreateInstance(versionToast!)
              toastBootstrap.show()
            })
        }
      })
  } else {
    version.value = packageVersion
  }
})

let codeModal: Modal
const goToAdmin = () => {
  codeModal = new Modal('#codeModal', { keyboard: false })
  codeModal.show()
}

const gotToAffectation = () => {
  useAuth().currentMode.value = 'assignments'
  useSettings()
    .loadSettings()
    .then(() => {
      router.push('/assignments')
    })
    .catch(() => {
      document.getElementById('error_message')!.innerText = 'Impossible de charger les paramètres.'
      const errorToast = document.getElementById('errorToast')
      const toastBootstrap = Toast.getOrCreateInstance(errorToast!)
      toastBootstrap.show()
    })
}

const checkCode = async (code: string) => {
  codeModal.hide()
  const myModal = new Modal('#loadingModal', { keyboard: false })
  myModal.show()
  useAuth()
    .checkCode(code)
    .then((response) => {
      if (response) {
        useSettings()
          .loadSettings()
          .then(() => {
            router.push('/')
          })
      } else {
        document.getElementById('error_message')!.innerText = 'Code is incorrect.'
        const errorToast = document.getElementById('errorToast')
        const toastBootstrap = Toast.getOrCreateInstance(errorToast!)
        toastBootstrap.show()
      }
      myModal.hide()
    })
}

const openDownloadUrl = () => {
  InAppBrowser.openInExternalBrowser({
    url: downloadUrl.value,
  })
}
</script>
<template>
  <LoadingModal />
  <EnterCodeModal @confirm="checkCode" />
  <div class="flex-grow-1 container p-4">
    <div class="row">
      <div class="col-md-4 col-sm-0 p-1"></div>
      <div class="col-md-4 col-sm-12 p-1 text-center">
        <button
          type="button"
          class="btn btn-primary btn-lg"
          @click="goToAdmin"
          :disabled="!isOnline"
        >
          ADMIN
        </button>
      </div>
      <div class="col-md-4 col-sm-0 p-1"></div>
      <div class="col-md-4 col-sm-0 p-1"></div>
      <div class="col-md-4 col-sm-12 p-1 text-center">
        <button type="button" class="btn btn-primary btn-lg" @click="gotToAffectation">
          SAISIES
        </button>
      </div>
    </div>
  </div>
  <p class="fs-6 text-muted text-center">
    {{ version }}
  </p>

  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      id="errorToast"
      class="toast align-items-center text-bg-danger border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div id="error_message" class="toast-body">Code is incorrect.</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
  <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
    <div
      id="versionToast"
      class="toast align-items-center text-white bg-primary border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          Une nouvelle version est disponible,
          <u @click="openDownloadUrl()">cliquez ici pour la télécharger.</u>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>
