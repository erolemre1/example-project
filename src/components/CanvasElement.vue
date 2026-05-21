<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBaseStore } from '../stores/index'
import type { TemplateElement } from '../types'

const props = defineProps<{
    element: TemplateElement
}>()

const store = useBaseStore()

const isSelected = computed(() => store.selectedElementId === props.element.id)

const isDragging = ref(false)
const isResizing = ref(false)
const dragHasMoved = ref(false)
const resizeHasChanged = ref(false)

let dragOffset = { x: 0, y: 0 }
let currentResizeHandle = ''

let startResizePos = { x: 0, y: 0 }
let startResizeSize = { width: 0, height: 0 }
let startResizeElemPos = { x: 0, y: 0 }

function onMouseDown(e: MouseEvent): void {
    if (isResizing.value) return
    e.stopPropagation()

    store.selectElement(props.element.id)
    isDragging.value = true
    dragHasMoved.value = false

    dragOffset = {
        x: e.clientX - props.element.position.x,
        y: e.clientY - props.element.position.y,
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent): void {
    if (!isDragging.value) return
    if (!dragHasMoved.value) {
        store.pushHistory()
        dragHasMoved.value = true
    }

    const x = Math.max(0, e.clientX - dragOffset.x)
    const y = Math.max(0, e.clientY - dragOffset.y)
    store.moveElement(props.element.id, x, y)
}

function onMouseUp(): void {
    if (isDragging.value) isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}

function onResizeStart(e: MouseEvent, handle: string): void {
    e.stopPropagation()
    e.preventDefault()

    isResizing.value = true
    resizeHasChanged.value = false
    currentResizeHandle = handle

    startResizeSize = { width: props.element.size.width, height: props.element.size.height }
    startResizePos = { x: e.clientX, y: e.clientY }
    startResizeElemPos = { x: props.element.position.x, y: props.element.position.y }

    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
}

function onResizeMove(e: MouseEvent): void {
    if (!isResizing.value) return
    if (!resizeHasChanged.value) {
        store.pushHistory()
        resizeHasChanged.value = true
    }

    const dx = e.clientX - startResizePos.x
    const dy = e.clientY - startResizePos.y

    let newWidth = startResizeSize.width
    let newHeight = startResizeSize.height
    let newX = startResizeElemPos.x
    let newY = startResizeElemPos.y

    const minWidth = 40
    const minHeight = 20

    if (currentResizeHandle.includes('right')) {
        newWidth = Math.max(minWidth, startResizeSize.width + dx)
    } else if (currentResizeHandle.includes('left')) {
        const potentialWidth = startResizeSize.width - dx
        if (potentialWidth >= minWidth) {
            newWidth = potentialWidth
            newX = startResizeElemPos.x + dx
        }
    }

    if (currentResizeHandle.includes('bottom')) {
        newHeight = Math.max(minHeight, startResizeSize.height + dy)
    } else if (currentResizeHandle.includes('top')) {
        const potentialHeight = startResizeSize.height - dy
        if (potentialHeight >= minHeight) {
            newHeight = potentialHeight
            newY = startResizeElemPos.y + dy
        }
    }

    store.resizeElement(props.element.id, newWidth, newHeight)
    store.moveElement(props.element.id, newX, newY)
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
    <div class="canvas-element" :class="{ selected: isSelected, dragging: isDragging }" :style="elementStyle"
        @mousedown="onMouseDown">
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

        <template v-if="isSelected">
            <div class="selection-border"></div>

            <div class="handle top-left" @mousedown="onResizeStart($event, 'top-left')"></div>
            <div class="handle top-right" @mousedown="onResizeStart($event, 'top-right')"></div>
            <div class="handle bottom-left" @mousedown="onResizeStart($event, 'bottom-left')"></div>
            <div class="handle bottom-right" @mousedown="onResizeStart($event, 'bottom-right')"></div>

            <div class="handle top-center" @mousedown="onResizeStart($event, 'top-center')"></div>
            <div class="handle bottom-center" @mousedown="onResizeStart($event, 'bottom-center')"></div>
            <div class="handle left-center" @mousedown="onResizeStart($event, 'left-center')"></div>
            <div class="handle right-center" @mousedown="onResizeStart($event, 'right-center')"></div>
        </template>
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
    position: absolute;
    background: rgba(79, 70, 229, 0.02);
}

.selection-border {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 1.5px dashed var(--color-indigo-500);
    border-radius: 8px;
    pointer-events: none;
    z-index: 10;
}

.handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: var(--color-white);
    border: 2px solid var(--color-indigo-500);
    border-radius: 1px;
    z-index: 11;
    box-sizing: border-box;
}

.top-left {
    top: -8px;
    left: -8px;
    cursor: nwse-resize;
}

.top-right {
    top: -8px;
    right: -8px;
    cursor: nesw-resize;
}

.bottom-left {
    bottom: -8px;
    left: -8px;
    cursor: nesw-resize;
}

.bottom-right {
    bottom: -8px;
    right: -8px;
    cursor: se-resize;
}

.top-center {
    top: -8px;
    left: calc(50% - 4px);
    cursor: ns-resize;
}

.bottom-center {
    bottom: -8px;
    left: calc(50% - 4px);
    cursor: ns-resize;
}

.left-center {
    top: calc(50% - 4px);
    left: -8px;
    cursor: ew-resize;
}

.right-center {
    top: calc(50% - 4px);
    right: -8px;
    cursor: ew-resize;
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
