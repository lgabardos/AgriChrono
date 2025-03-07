<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'confirm', code: string): void
  (e: 'close'): void
}>()

const code = ref('')
watch(code, (value) => {
  document.querySelectorAll('.code-number').forEach((el, i) => {
    el.classList.toggle('empty', i >= value.length)
  })
})
const code1 = ref('0')
const code2 = ref('0')
const code3 = ref('0')
const code4 = ref('0')

const close = () => {
  emit('close')
  code.value = ''
  code1.value = '0'
  code2.value = '0'
  code3.value = '0'
  code4.value = '0'
}

const confirm = () => {
  emit('confirm', code.value)
  code.value = ''
  code1.value = '0'
  code2.value = '0'
  code3.value = '0'
  code4.value = '0'
}

onMounted(() => {
  const myModalEl = document.getElementById('codeModal')
  myModalEl?.addEventListener('shown.bs.modal', () => {
    const input = myModalEl?.querySelector('#fake-input') as HTMLInputElement
    input.focus()
  })
  window.addEventListener('keydown', (e) => {
    if (!myModalEl?.classList.contains('show')) {
      return
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key)) {
      code.value += e.key
    } else if ('Backspace' === e.key) {
      code.value = code.value.slice(0, -1)
    }

    code1.value = code.value[0] ?? '0'
    code2.value = code.value[1] ?? '0'
    code3.value = code.value[2] ?? '0'
    code4.value = code.value[3] ?? '0'

    if (code.value.length === 4) {
      confirm()
    }
  })
})
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="codeModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="codeModalLabel">
            Veuillez saisir le code administrateur
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="close"
          ></button>
        </div>
        <div class="modal-body">
          <input type="number" id="fake-input" class="position-absolute" style="top: -70px" />
          <div class="d-flex justify-content-center">
            <div class="code-number empty">
              {{ code1 }}
            </div>
            <div class="code-number empty">
              {{ code2 }}
            </div>
            <div class="code-number empty">
              {{ code3 }}
            </div>
            <div class="code-number empty">
              {{ code4 }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">
            Annuler
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirm">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.code-number {
  border-radius: 5px;
  font-size: 80px;
  width: 70px;
  text-align: center;
  color: #333;
}
.code-number.empty {
  color: #999;
}
</style>
