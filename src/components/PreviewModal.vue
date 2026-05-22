<script setup lang="ts">
import { computed } from 'vue'
import { useBaseStore } from '../stores/index'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useBaseStore()
const previewElements = computed(() =>
    [...store.elements].sort((a, b) => a.zIndex - b.zIndex)
)
</script>

<template>
    <teleport to="body">
        <div v-if="visible" class="preview-overlay" @click.self="emit('close')">
            <div class="preview-modal" role="dialog" aria-modal="true">
                <div class="preview-header">
                    <h3>{{ $t('management.previewTitle') }}</h3>
                    <button class="btn-close" @click="emit('close')">✕</button>
                </div>
                <div class="preview-canvas" :style="{
                    width: store.canvasSize.width + 'px',
                    height: store.canvasSize.height + 'px',
                    background: store.backgroundColor,
                }">
                    <div v-for="el in previewElements" :key="el.id" class="preview-el" :style="{
                        left: el.position.x + 'px',
                        top: el.position.y + 'px',
                        width: el.size.width + 'px',
                        height: el.size.height + 'px',
                        zIndex: el.zIndex,
                    }">
                        <h2 v-if="el.type === 'heading'" class="preview-heading" :style="{
                            fontSize: el.fontSize + 'px', color: el.color, textAlign: el.alignment
                        }">{{ el.content }}</h2>
                        <p v-else-if="el.type === 'text'" class="preview-text" :style="{
                            fontSize: el.fontSize + 'px', color: el.color, textAlign: el.alignment
                        }">{{ el.content }}</p>
                        <div v-else-if="el.type === 'button'" class="preview-button" :style="{
                            backgroundColor: el.backgroundColor, color: el.textColor,
                            borderRadius: el.borderRadius + 'px'
                        }">{{ el.text }}</div>
                        <div v-else-if="el.type === 'image'" class="preview-image">
                            <img v-if="el.url" :src="el.url" :alt="el.altText" />
                            <span v-else>{{ el.size.width }}×{{ el.size.height }}</span>
                        </div>
                        <hr v-else-if="el.type === 'divider'" class="preview-divider" :style="{
                            borderColor: el.color, borderWidth: el.thickness + 'px'
                        }" />
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.preview-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
}

.preview-modal {
    background: var(--color-white);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
    padding: 16px;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.preview-header h3 {
    margin: 0;
    font-size: 14px;
    color: var(--color-gray-700);
}

.btn-close {
    padding: 3px 8px;
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;
    background: var(--color-white);
    cursor: pointer;
    font-size: 13px;
    color: var(--color-gray-700);
}

.btn-close:hover {
    background: var(--color-gray-100);
}

.preview-canvas {
    position: relative;
    border: 1px solid var(--color-gray-200);
    border-radius: 8px;
    overflow: hidden;
}

.preview-el {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-heading,
.preview-text {
    margin: 0;
    width: 100%;
}

.preview-heading {
    font-weight: 700;
}

.preview-button {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
}

.preview-image {
    width: 100%;
    height: 100%;
    background: var(--color-gray-100);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-image span {
    color: var(--color-gray-400);
    font-size: 12px;
}

.preview-divider {
    width: 100%;
    margin: 0;
    border-style: solid;
    border-left: none;
    border-right: none;
    border-bottom: none;
}
</style>
