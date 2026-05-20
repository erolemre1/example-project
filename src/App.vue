<script setup lang="ts">
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

import { useBaseStore } from './stores/index'
const store = useBaseStore()

</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">{{ $t('app.title') }}</h1>
      <div class="header-actions">
        <button class="btn-icon">
          <Undo2 :size="16" /> {{ $t('action.undo') }}
        </button>
        <button class="btn-icon">
          <Redo2 :size="16" /> {{ $t('action.redo') }}
        </button>
      </div>
    </header>
    <div class="app-body">
      <Elements />
      <main class="canvas-container">
        <Canvas />
        <div class="canvas-actions">
          <button class="btn-icon">
            <ArrowUp :size="16" /> {{ $t('action.bringForward') }}
          </button>
          <button class="btn-icon">
            <ArrowDown :size="16" /> {{ $t('action.sendBackward') }}
          </button>
        </div>
      </main>
      <Properties />
    </div>
    <footer class="app-footer">
      <Management />
      <div class="template-info">
        {{ $t('footer.templateInfo') }}: {{ store.templateName }}
      </div>
    </footer>
  </div>
</template>

<style scoped>
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
  transition: background 0.15s;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
  justify-content: center;
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
  transition: background 0.15s;
}



.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-white);
}
</style>
