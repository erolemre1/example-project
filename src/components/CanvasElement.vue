<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBaseStore } from '../stores/index'
import type { TemplateElement } from '../types'
import { Maximize2 } from 'lucide-vue-next'

const props = defineProps<{
    element: TemplateElement
}>()

const store = useBaseStore()

const isSelected = computed(() => store.selectedElementId === props.element.id)

const isDragging = ref(false)
const isResizing = ref(false)

let dragOffset = { x: 0, y: 0 }
let startDragPos = { x: 0, y: 0 }
let startResizePos = { x: 0, y: 0 }
let startResizeSize = { width: 0, height: 0 }

function onMouseDown(e: MouseEvent): void {
    if (isResizing.value) return
    e.stopPropagation()

    store.selectElement(props.element.id)
    isDragging.value = true

    dragOffset = {
        x: e.clientX - props.element.position.x,
        y: e.clientY - props.element.position.y,
    }
    startDragPos = { ...props.element.position }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent): void {
    if (!isDragging.value) return
    const x = Math.max(0, e.clientX - dragOffset.x)
    const y = Math.max(0, e.clientY - dragOffset.y)
    store.moveElement(props.element.id, x, y)
}

function onMouseUp(): void {
    if (isDragging.value) {
        isDragging.value = false

        const el = props.element
        if (el.position.x !== startDragPos.x || el.position.y !== startDragPos.y) {
            store.saveMovement(el.id, el.position.x, el.position.y)
        }
    }
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}

function onResizeStart(e: MouseEvent): void {
    e.stopPropagation()
    e.preventDefault()

    isResizing.value = true

    startResizeSize = { width: props.element.size.width, height: props.element.size.height }
    startResizePos = { x: e.clientX, y: e.clientY }

    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent): void {
    if (!isResizing.value) return
    const dx = e.clientX - startResizePos.x
    const dy = e.clientY - startResizePos.y
    const width = Math.max(40, startResizeSize.width + dx)
    const height = Math.max(20, startResizeSize.height + dy)
    store.resizeElement(props.element.id, width, height)
}

function onResizeEnd(): void {
    if (isResizing.value) isResizing.value = false
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
}

const elementStyle = computed(() => ({
    position: 'absolute' as const,
    left: `${props.element.position.x}px`,
    top: `${props.element.position.y}px`,
    width: `${props.element.size.width}px`,
    height: `${props.element.size.height}px`,
    zIndex: props.element.zIndex,
}))
</script>

<template>
    <div class="canvas-element" :class="{ selected: isSelected }" :style="elementStyle" @mousedown="onMouseDown">
        <h2 v-if="element.type === 'heading'" class="el-heading" :style="{
            fontSize: element.fontSize + 'px',
            color: element.color,
            textAlign: element.alignment,
        }">
            {{ element.content }}
        </h2>

        <p v-else-if="element.type === 'text'" class="el-text" :style="{
            fontSize: element.fontSize + 'px',
            color: element.color,
            textAlign: element.alignment,
        }">
            {{ element.content }}
        </p>

        <div v-else-if="element.type === 'button'" class="el-button" :style="{
            backgroundColor: element.backgroundColor,
            color: element.textColor,
            borderRadius: element.borderRadius + 'px',
        }">
            {{ element.text }}
        </div>

        <div v-else-if="element.type === 'image'" class="el-image">
            <img v-if="element.url" :src="element.url" :alt="element.altText" class="el-image-img" />
            <div v-else class="el-image-placeholder">
                {{ element.size.width }} x {{ element.size.height }}
            </div>
        </div>

        <hr v-else-if="element.type === 'divider'" class="el-divider" :style="{
            borderColor: element.color,
            borderWidth: element.thickness + 'px',
        }" />

        <div v-if="isSelected" class="resize-handle" @mousedown="onResizeStart">
            <Maximize2 :size="20" class="resize-icon" />
        </div>
    </div>
</template>

<style scoped>
.canvas-element {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: grab;
}

.canvas-element:active,
.canvas-element.dragging {
    cursor: grabbing !important;
}

.canvas-element.selected {
    outline: 3px solid var(--color-indigo-500);
    outline-offset: 2px;
    background: rgba(79, 70, 229, 0.05);
}

.resize-handle {
    position: absolute;
    right: -10px;
    bottom: -10px;
    width: 24px;
    height: 24px;
    background: var(--color-indigo-500);
    border: 2px solid var(--color-white);
    border-radius: 50%;
    cursor: se-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    transform: rotate(90deg);
}

.resize-icon {
    color: var(--color-white);
}

.el-heading {
    margin: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 700;
}

.el-text {
    margin: 0;
    width: 100%;
    overflow: hidden;
}

.el-button {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    pointer-events: none;
}

.el-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-gray-100);
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;
    overflow: hidden;
}

.el-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.el-image-placeholder {
    font-size: 13px;
    color: var(--color-gray-500);
}

.el-divider {
    width: 100%;
    border: none;
    border-top-style: solid;
    margin: 0;
}
</style>
