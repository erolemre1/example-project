<script setup lang="ts">
import type { TemplateElement } from '../types'

const props = defineProps<{
    element: TemplateElement
}>()


</script>

<template>
    <div class="canvas-element">
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

    </div>
</template>

<style scoped>
.canvas-element {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.resize-handle {
    position: absolute;
    right: -5px;
    bottom: -5px;
    width: 10px;
    height: 10px;
    background: var(--color-indigo-500);
    border-radius: 50%;
    cursor: se-resize;
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
    border: 1px solid var(--color-athen-gray);
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
