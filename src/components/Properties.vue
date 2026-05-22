<script setup lang="ts">
import { computed } from 'vue'
import { useBaseStore } from '../stores/index'
import { ElementEnum, Alignment } from '../types'

defineOptions({ name: 'ElementProperties' })

const store = useBaseStore()

const element = computed(() => store.selectedElement)

function update(key: string, value: unknown): void {
    if (!element.value) return
    store.updateElement(element.value.id, { [key]: value })
}

function updatePosition(axis: 'x' | 'y', value: number): void {
    if (!element.value) return
    const pos = { ...element.value.position, [axis]: value }
    store.updateElement(element.value.id, { position: pos })
}

function updateSize(dim: 'width' | 'height', value: number): void {
    if (!element.value) return
    const size = { ...element.value.size, [dim]: value }
    store.updateElement(element.value.id, { size })
}

function getTargetValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    return target?.value ?? ''
}

function updateField(key: string, event: Event): void {
    update(key, getTargetValue(event))
}

function updateNumberField(key: string, event: Event): void {
    update(key, Number(getTargetValue(event)))
}

function updatePositionField(axis: 'x' | 'y', event: Event): void {
    updatePosition(axis, Number(getTargetValue(event)))
}

function updateSizeField(dim: 'width' | 'height', event: Event): void {
    updateSize(dim, Number(getTargetValue(event)))
}

function deleteSelected(): void {
    if (!element.value) return
    store.deleteElement(element.value.id)
}
</script>

<template>
    <div class="properties-panel">
        <template v-if="element">
            <h3 class="panel-title">{{ $t('panel.properties') }}</h3>
            <div class="element-type-badge">{{ element.type }}</div>

            <template v-if="element.type === ElementEnum.HEADING">
                <div class="prop-group">
                    <label>{{ $t('element.text') }}</label>
                    <input type="text" :value="element?.content" @input="updateField('content', $event)" />
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.font-size') }}</label>
                    <input type="number" :value="element?.fontSize" @input="updateNumberField('fontSize', $event)" />
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.color') }}</label>
                    <div class="color-input">
                        <input type="color" :value="element?.color" @input="updateField('color', $event)" />
                        <input type="text" :value="element?.color" @change="updateField('color', $event)" />
                    </div>
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.alignment') }}</label>
                    <select :value="element?.alignment" @change="updateField('alignment', $event)">
                        <option :value="Alignment.LEFT">{{ $t('element.alignment-left') }}</option>
                        <option :value="Alignment.CENTER">{{ $t('element.alignment-center') }}</option>
                        <option :value="Alignment.RIGHT">{{ $t('element.alignment-right') }}</option>
                    </select>
                </div>
            </template>

            <template v-if="element.type === ElementEnum.TEXT">
                <div class="prop-group">
                    <label>{{ $t('element.text') }}</label>
                    <textarea :value="element?.content" @input="updateField('content', $event)" rows="3"></textarea>
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.font-size') }}</label>
                    <input type="number" :value="element?.fontSize" @input="updateNumberField('fontSize', $event)" />
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.color') }}</label>
                    <div class="color-input">
                        <input type="color" :value="element?.color" @input="updateField('color', $event)" />
                        <input type="text" :value="element?.color" @change="updateField('color', $event)" />
                    </div>
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.alignment') }}</label>
                    <select :value="element?.alignment" @change="updateField('alignment', $event)">
                        <option value="left">{{ $t('element.alignment-left') }}</option>
                        <option value="center">{{ $t('element.alignment-center') }}</option>
                        <option value="right">{{ $t('element.alignment-right') }}</option>
                    </select>
                </div>
            </template>

            <template v-if="element.type === 'button'">
                <div class="prop-group">
                    <label>{{ $t('element.text') }}</label>
                    <input type="text" :value="element?.text" @input="updateField('text', $event)" />
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.background-color') }}</label>
                    <div class="color-input">
                        <input type="color" :value="element?.backgroundColor"
                            @input="updateField('backgroundColor', $event)" />
                        <input type="text" :value="element?.backgroundColor"
                            @change="updateField('backgroundColor', $event)" />
                    </div>
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.text-color') }}</label>
                    <div class="color-input">
                        <input type="color" :value="element?.textColor" @input="updateField('textColor', $event)" />
                        <input type="text" :value="element?.textColor" @change="updateField('textColor', $event)" />
                    </div>
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.border-radius') }}</label>
                    <div class="range-input">
                        <input type="range" min="0" max="50" :value="element?.borderRadius"
                            @input="updateNumberField('borderRadius', $event)" />
                        <span>{{ element?.borderRadius }}px</span>
                    </div>
                </div>
            </template>

            <template v-if="element.type === 'image'">
                <div class="prop-group">
                    <label>{{ $t('element.image-url') }}</label>
                    <input type="text" :value="element?.url" @input="updateField('url', $event)"
                        placeholder="https://..." />
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.alt-text') }}</label>
                    <input type="text" :value="element?.altText" @input="updateField('altText', $event)" />
                </div>
            </template>

            <template v-if="element.type === 'divider'">
                <div class="prop-group">
                    <label>{{ $t('element.color') }}</label>
                    <div class="color-input">
                        <input type="color" :value="element?.color" @input="updateField('color', $event)" />
                        <input type="text" :value="element?.color" @change="updateField('color', $event)" />
                    </div>
                </div>
                <div class="prop-group">
                    <label>{{ $t('element.thickness') }}</label>
                    <input type="number" min="1" max="10" :value="element?.thickness"
                        @input="updateNumberField('thickness', $event)" />
                </div>
            </template>

            <div class="prop-section">
                <label class="section-label">{{ $t('element.position') }}</label>
                <div class="prop-row">
                    <div class="prop-inline">
                        <span>X</span>
                        <input type="number" :value="element?.position.x" @input="updatePositionField('x', $event)" />
                    </div>
                    <div class="prop-inline">
                        <span>Y</span>
                        <input type="number" :value="element?.position.y" @input="updatePositionField('y', $event)" />
                    </div>
                </div>
            </div>

            <div class="prop-section">
                <label class="section-label">{{ $t('element.size') }}</label>
                <div class="prop-row">
                    <div class="prop-inline">
                        <span>{{ $t('element.width') }}</span>
                        <input type="number" :value="element?.size.width" @input="updateSizeField('width', $event)" />
                    </div>
                    <div class="prop-inline">
                        <span>{{ $t('element.height') }}</span>
                        <input type="number" :value="element?.size.height" @input="updateSizeField('height', $event)" />
                    </div>
                </div>
            </div>

            <button class="btn-delete" @click="deleteSelected">{{ $t('element.delete') }}</button>
        </template>

        <div v-else class="no-selection">
            {{ $t('panel.noSelection') }}
        </div>
    </div>
</template>

<style scoped>
.properties-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 250px;
    padding: 16px;
}

.panel-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-gray-text);
    letter-spacing: 0.5px;
    margin: 0;
}

.element-type-badge {
    display: inline-block;
    padding: 4px 10px;
    background: var(--color-gray-100);
    border: 1px solid var(--color-gray-200);
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-gray-700);
    text-transform: capitalize;
    width: fit-content;
}

.prop-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.prop-group label {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-gray-text);
}

.prop-group input[type='text'],
.prop-group input[type='number'],
.prop-group textarea,
.prop-group select {
    padding: 7px 10px;
    border: 1px solid var(--color-gray-300);
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
}

.prop-group input:focus,
.prop-group textarea:focus,
.prop-group select:focus {
    border-color: var(--color-indigo-500);
}

.color-input {
    display: flex;
    align-items: center;
    gap: 8px;
}

.color-input input[type='color'] {
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-gray-300);
    border-radius: 6px;
    padding: 2px;
    cursor: pointer;
}

.color-input input[type='text'] {
    flex: 1;
    padding: 7px 10px;
    border: 1px solid var(--color-gray-300);
    border-radius: 6px;
    font-size: 13px;
    outline: none;
}

.range-input {
    display: flex;
    align-items: center;
    gap: 8px;
}

.range-input input[type='range'] {
    flex: 1;
}

.range-input span {
    font-size: 12px;
    color: var(--color-gray-text);
    min-width: 32px;
}

.prop-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-gray-text);
}

.prop-row {
    display: flex;
    gap: 8px;
}

.prop-inline {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.prop-inline span {
    font-size: 11px;
    color: var(--color-gray-400);
}

.prop-inline input {
    padding: 6px 8px;
    border: 1px solid var(--color-gray-300);
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
}

.prop-inline input:focus {
    border-color: var(--color-indigo-500);
}

.btn-delete {
    margin-top: 12px;
    padding: 10px;
    border: 1px solid var(--color-red-200);
    border-radius: 6px;
    background: var(--color-white);
    color: var(--color-red-600);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-delete:hover {
    background: var(--color-red-50);
}

.no-selection {
    text-align: center;
    color: var(--color-gray-400);
    font-size: 13px;
    padding: 40px 10px;
}

input[type="color"] {
    appearance: none;
    -webkit-appearance: none;
    border: 1px solid var(--color-gray-300);
    width: 32px;
    height: 32px;
    border-radius: 6px;
    padding: 2px;
    cursor: pointer;
    background: none;
}

input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
}

input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
}

input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: var(--color-gray-200);
    border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: var(--color-indigo-500, #4f46e5);
    cursor: pointer;
    margin-top: -6px;
    border: 2px solid var(--color-white);
}
</style>
