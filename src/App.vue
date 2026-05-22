<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
  Undo2,
  Redo2,
  ArrowUp,
  ArrowDown
} from 'lucide-vue-next'
import Elements from './components/Elements.vue'
import Management from './components/Management.vue'
import Properties from './components/Properties.vue'
import Canvas from './components/Canvas.vue'
import Notification from './components/Notification.vue'

import { useBaseStore } from './stores/index'
import { cloneElements } from './utils/store-utils'
import type { TemplateElement } from './types'

const store = useBaseStore()
const clipboard = ref<TemplateElement | null>(null)

function isEditable(target: EventTarget | null): boolean {
  if (!target) return false
  const el = target as HTMLElement
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable
}

function onKeyDown(e: KeyboardEvent): void {
  if (isEditable(e.target)) return

  const ctrl = e.ctrlKey || e.metaKey

  if (ctrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault()
    store.undo()
    return
  }
  if (ctrl && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
    e.preventDefault()
    store.redo()
    return
  }
  if (ctrl && e.key.toLowerCase() === 'c') {
    if (!store.selectedElement) return
    e.preventDefault()
    clipboard.value = cloneElements([store.selectedElement])[0]
    return
  }
  if (ctrl && e.key.toLowerCase() === 'v') {
    if (!clipboard.value) return
    e.preventDefault()
    store.duplicateElement(clipboard.value)
    return
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (!store.selectedElementId) return
    e.preventDefault()
    store.deleteSelectedElement()
    return
  }

  if (!store.selectedElementId) return
  const step = e.shiftKey ? store.GRID_SIZE * 2 : store.GRID_SIZE

  if (e.key === 'ArrowUp') { e.preventDefault(); store.nudgeSelectedElement(0, -step) }
  else if (e.key === 'ArrowDown') { e.preventDefault(); store.nudgeSelectedElement(0, step) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); store.nudgeSelectedElement(-step, 0) }
  else if (e.key === 'ArrowRight') { e.preventDefault(); store.nudgeSelectedElement(step, 0) }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">{{ $t('app.title') }}</h1>
      <div class="header-actions">
        <button class="btn-icon" @click="store.undo()">
          <Undo2 :size="16" /> {{ $t('action.undo') }}
        </button>
        <button class="btn-icon" @click="store.redo()">
          <Redo2 :size="16" /> {{ $t('action.redo') }}
        </button>
      </div>
    </header>
    <div class="app-body">
      <Elements />
      <main class="canvas-container">
        <Canvas />
        <div class="canvas-actions" v-if="store.selectedElementId">
          <button class="btn-icon" @click="store.bringForward(store.selectedElementId)">
            <ArrowUp :size="16" /> {{ $t('action.bringForward') }}
          </button>
          <button class="btn-icon" @click="store.sendBackward(store.selectedElementId)">
            <ArrowDown :size="16" /> {{ $t('action.sendBackward') }}
          </button>
        </div>
      </main>
      <Properties />
    </div>
    <footer class="app-footer">
      <Management />
      <div class="template-info">
        <label>
          {{ $t('footer.templateInfo') }}:
          <input class="template-name-input" type="text" v-model="store.templateName" />
        </label>
      </div>
    </footer>
    <Notification />
  </div>
</template>

<style>
body {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  font-family: 'Inter', sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-white);
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 12px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background: var(--color-white);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-gray-700);
  display: flex;
}

.btn-icon svg {
  margin-right: 8px;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background: var(--color-gray-100);
  overflow: auto;
  gap: 12px;
  padding: 20px;
}

.canvas-actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 14px;
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  background: var(--color-white);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-gray-700);
  display: flex;
}



.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-white);
}

.template-info {
  background: var(--color-gray-100);
  padding: 6px 12px;
  border-radius: 8px;
}

.template-info label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-gray-700);
}

.template-name-input {
  padding: 6px 10px;
  border: none;
  background: var(--color-gray-100);
  color: var(--color-gray-800);
  font-weight: 600;
  width: 130px;
}

.template-name-input:active,
.template-name-input:focus,
.template-name-input:focus-visible {
  outline: none;
}
</style>
