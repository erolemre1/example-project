import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  TemplateElement,
  ElementType,
  HeadingElement,
  TextElement,
  ButtonElement,
  ImageElement,
  DividerElement,
} from '@/types'

export const useBaseStore = defineStore('base', () => {
  const elements = ref<TemplateElement[]>([])
  const selectedElementId = ref<string | null>(null)
  const templateName = ref('Template name')
  const maxZIndex = computed(() =>
    elements.value.length > 0
      ? Math.max(...elements.value.map((el) => el.zIndex))
      : 0
  )
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
  }

  function addElement(type: ElementType, x: number, y: number): void {
    const baseProps = {
      id: generateId(),
      position: { x, y },
      zIndex: maxZIndex.value + 1,
    }

    let newElement: TemplateElement

    switch (type) {
      case 'heading':
        newElement = {
          ...baseProps,
          type: 'heading',
          content: 'Heading',
          fontSize: 28,
          color: 'var(--color-black)',
          alignment: 'center',
          size: { width: 300, height: 40 },
        } as HeadingElement
        break
      case 'text':
        newElement = {
          ...baseProps,
          type: 'text',
          content: 'Text content here',
          fontSize: 16,
          color: 'var(--color-gray-600)',
          alignment: 'center',
          size: { width: 300, height: 30 },
        } as TextElement
        break
      case 'button':
        newElement = {
          ...baseProps,
          type: 'button',
          text: 'Click Me',
          backgroundColor: 'var(--color-indigo-500)',
          textColor: 'var(--color-white)',
          borderRadius: 8,
          size: { width: 170, height: 48 },
        } as ButtonElement
        break
      case 'image':
        newElement = {
          ...baseProps,
          type: 'image',
          url: '',
          altText: 'Image',
          size: { width: 150, height: 120 },
        } as ImageElement
        break
      case 'divider':
        newElement = {
          ...baseProps,
          type: 'divider',
          color: 'var(--color-athen-gray)',
          thickness: 2,
          size: { width: 250, height: 2 },
        } as DividerElement
        break
    }

    elements.value.push(newElement)
    selectedElementId.value = newElement.id
  }


  return {
    elements,
    templateName,
    addElement,
  }
})