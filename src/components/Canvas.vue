<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ElementType } from '../types'
import CanvasElement from './CanvasElement.vue'
import { useBaseStore } from '../stores/index'

const store = useBaseStore()
const elements = computed(() =>
    [...store.elements].sort((a, b) => a.zIndex - b.zIndex)
)

const canvasRef = ref<HTMLElement | null>(null)
function onDrop(e: DragEvent): void {
    e.preventDefault()
    if (!e.dataTransfer || !canvasRef.value) return
    const type = e.dataTransfer.getData('element-type') as ElementType

    const rect = canvasRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left - 75
    const y = e.clientY - rect.top - 20
    store.addElement(type, Math.max(0, x), Math.max(0, y))
}


</script>

<template>
    <div ref="canvasRef" class="canvas" @dragover.prevent @drop.prevent="onDrop">
        <CanvasElement v-for="element in elements" :key="element.id" :element="element" />
    </div>
</template>

<style scoped>
.canvas {
    position: relative;
    width: 400px;
    height: 500px;
    background: var(--color-white);
    border: 2px solid var(--color-athen-gray);
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    flex-shrink: 0;
}
</style>
