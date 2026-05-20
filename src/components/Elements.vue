<script setup lang="ts">

import type { ElementType } from '@/types'
import { 
  Heading, 
  Type,
  Square,
  Image,
  Minus
} from 'lucide-vue-next'

const paletteItems: { type: ElementType; label: string; icon: any }[] = [
  { type: 'heading', label: 'element.heading', icon: Heading },
  { type: 'text', label: 'element.text', icon: Type },
  { type: 'button', label: 'element.button', icon: Square },
  { type: 'image', label: 'element.image', icon: Image },
  { type: 'divider', label: 'element.divider', icon: Minus },
]


</script>

<template>
  <div class="element-palette">
    <h3 class="palette-title">{{ $t('element.title') }}</h3>
    <div
      v-for="item in paletteItems"
      :key="item.type"
      class="palette-item"
    >
      <button class="palette-icon"><component :is="item.icon" :size="16" /></button> 
      <span class="palette-label">{{ $t(item.label) }}</span>
    </div>
  </div>
</template>

<style scoped>
.element-palette {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-gray-text);
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  background: var(--color-white);
  cursor: grab;
  transition: box-shadow 0.15s, border-color 0.15s;
  user-select: none;
}

.palette-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-200);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-gray-600);
  background: var(--color-gray-50);
}

.palette-label {
  font-size: 14px;
  color: var(--color-gray-700);
}
</style>
