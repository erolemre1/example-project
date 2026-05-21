<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBaseStore, useNotificationStore } from '../stores/index'
import { NOTIF_ERROR, NOTIF_SUCCESS } from '../constants/notifications'
import { fetchTemplates, saveTemplate, deleteTemplate } from '../services/api'
import type { Template } from '../types'

const store = useBaseStore()
const notificationStore = useNotificationStore()
const { t } = useI18n()
const savedTemplates = ref<Template[]>([])
const showList = ref(false)

async function handleSave(): Promise<void> {
    try {
        const template = store.getTemplate()
        await saveTemplate(template)
        notificationStore.notify(t('management.templateSavedSuccess'), NOTIF_SUCCESS)
    } catch {
        notificationStore.notify(t('management.failedSave'), NOTIF_ERROR)
    }
}

async function handleLoadList(): Promise<void> {
    try {
        savedTemplates.value = await fetchTemplates()
        showList.value = !showList.value
    } catch {
        notificationStore.notify(t('management.failedLoad'), NOTIF_ERROR)
    }
}

function handleLoad(template: Template): void {
    try {
        store.loadTemplate(template)
        notificationStore.notify(t('management.templateLoaded', { name: template.name }), NOTIF_SUCCESS)
    } catch {
        notificationStore.notify(t('management.failedLoad'), NOTIF_ERROR)
    }
}

async function handleDelete(template: Template): Promise<void> {
    try {

        await deleteTemplate(template.id)
        savedTemplates.value = savedTemplates.value.filter((t) => t.id !== template.id)
        notificationStore.notify(t('management.templateDeleted', { name: template.name }), NOTIF_SUCCESS)
    } catch {
        notificationStore.notify(t('management.failedDelete'), NOTIF_ERROR)
    }
}

function handleExportJSON(): void {
    const template = store.getTemplate()
    const json = JSON.stringify(template, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
}

function handleNew(): void {
    store.newTemplate()
}
</script>

<template>
    <div class="template-manager">
        <div class="manager-buttons">
            <button class="btn" @click="handleNew">+ New</button>
            <button class="btn btn-primary" @click="handleSave">Save</button>
            <button class="btn" @click="handleExportJSON">Export JSON</button>
            <button class="btn" @click="handleLoadList">
                {{ showList ? $t('management.close') : $t('management.load') }}
            </button>
        </div>
        <div v-if="showList" class="templates-list">
            <div v-if="savedTemplates.length === 0" class="no-templates">
                {{ $t('management.noTemplates') }}
            </div>
            <div v-for="tmpl in savedTemplates" :key="tmpl.id" class="template-item">
                <span class="template-name">{{ tmpl.name }}</span>
                <div class="template-actions">
                    <button class="btn-xs" @click="handleLoad(tmpl)"> {{ $t('management.load') }} </button>
                    <button class="btn-xs btn-danger" @click="handleDelete(tmpl)">
                        {{ $t('management.delete') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.template-manager {
    position: relative;
}

.manager-buttons {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 6px 14px;
    border: 1px solid var(--color-gray-300);
    border-radius: 6px;
    background: var(--color-white);
    cursor: pointer;
    font-size: 13px;
    color: var(--color-gray-700);
    display: flex;
}

.btn:hover {
    background: var(--color-gray-100);
}

.btn-primary {
    background: var(--color-indigo-500);
    color: var(--color-white);
    border-color: var(--color-indigo-500);
}

.btn-primary:hover {
    background: var(--color-indigo-500);
    color: var(--color-white);
    border-color: var(--color-indigo-500);
}

.templates-list {
    position: absolute;
    bottom: 40px;
    left: 0;
    background: var(--color-white);
    border: 1px solid var(--color-gray-200);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 8px;
    min-width: 260px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.no-templates {
    padding: 12px;
    text-align: center;
    color: var(--color-gray-400);
    font-size: 13px;
}

.template-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 4px;
}

.template-item:hover {
    background: var(--color-gray-50);
}

.template-name {
    font-size: 13px;
    color: var(--color-gray-700);
}

.template-actions {
    display: flex;
    gap: 4px;
}

.btn-xs {
    padding: 3px 8px;
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;
    background: var(--color-white);
    cursor: pointer;
    font-size: 11px;
    color: var(--color-gray-700);
}

.btn-xs:hover {
    background: var(--color-gray-100);
}

.btn-danger {
    color: var(--color-red-600);
    border-color: var(--color-red-300);
}
</style>
