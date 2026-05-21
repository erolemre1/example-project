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
  Template,
} from '@/types'
import { cloneElements, generateId } from '@/utils/store-utils'
import DefaultElements from '@/data/default-template'

export const useBaseStore = defineStore('base', () => {
  const elements = ref<TemplateElement[]>(DefaultElements)
  const selectedElementId = ref<string | null>(DefaultElements?.[4]?.id || null)
  const templateName = ref('Promo Popup v1')
  const templateId = ref<string>(generateId())
  const canvasSize = ref({ width: 400, height: 500 })
  const backgroundColor = ref('#FFFFFF')
  const selectedElement = computed(() =>
    elements.value.find((el) => el.id === selectedElementId.value) ?? null
  )
  const maxZIndex = computed(() =>
    elements.value.length > 0
      ? Math.max(...elements.value.map((el) => el.zIndex))
      : 0
  )

  const history = {
    undoStack: [] as TemplateElement[][],
    redoStack: [] as TemplateElement[][],
    push(state: TemplateElement[]) {
      this.undoStack.push(cloneElements(state))
      this.redoStack.length = 0
    },
    undo(currentState: TemplateElement[]) {
      if (this.undoStack.length === 0) return null
      this.redoStack.push(cloneElements(currentState))
      return this.undoStack.pop() ?? null
    },
    redo(currentState: TemplateElement[]) {
      if (this.redoStack.length === 0) return null
      this.undoStack.push(cloneElements(currentState))
      return this.redoStack.pop() ?? null
    },
  }

  function pushHistory(): void {
    history.push(elements.value)
  }

  function addElement(type: ElementType, x: number, y: number): void {
    history.push(elements.value)
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
          color: '#000',
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
          color: '#4b5563',
          alignment: 'center',
          size: { width: 300, height: 30 },
        } as TextElement
        break
      case 'button':
        newElement = {
          ...baseProps,
          type: 'button',
          text: 'Click Me',
          backgroundColor: '#4f46e5',
          textColor: '#ffffff',
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
          color: '#d1d5db',
          thickness: 2,
          size: { width: 250, height: 2 },
        } as DividerElement
        break
      default:
        throw new Error(`Unsupported element type: ${type}`)
    }

    elements.value.push(newElement)
    selectedElementId.value = newElement.id
  }

  function selectElement(id: string): void {
    selectedElementId.value = id
  }

  function moveElement(id: string, x: number, y: number): void {
    const element = elements.value.find((item) => item.id === id)
    if (element) {
      element.position.x = x
      element.position.y = y
    }
  }

  function resizeElement(id: string, width: number, height: number): void {
    const element = elements.value.find((item) => item.id === id)
    if (element) {
      element.size.width = width
      element.size.height = height
    }
  }

  function updateElement(id: string, changes: Partial<TemplateElement>): void {
    const element = elements.value.find((item) => item.id === id)
    if (!element) return
    history.push(elements.value)
    Object.assign(element, changes)
  }

  function deleteElement(id: string): void {
    const index = elements.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      history.push(elements.value)
      elements.value.splice(index, 1)
      if (selectedElementId.value === id) {
        selectedElementId.value = null
      }
    }
  }

  function findElement(id: string): TemplateElement | undefined {
    return elements.value.find((item) => item.id === id)
  }

  function bringForward(id: string) {
    const el = findElement(id)
    if (!el) return
    const above = elements.value
      .filter((e) => e.zIndex > el.zIndex)
      .sort((a, b) => a.zIndex - b.zIndex)[0]
    if (above) {
      history.push(elements.value)
      const temp = el.zIndex
      el.zIndex = above.zIndex
      above.zIndex = temp
    }
  }

  function sendBackward(id: string) {
    const el = findElement(id)
    if (!el) return
    const below = elements.value
      .filter((e) => e.zIndex < el.zIndex)
      .sort((a, b) => b.zIndex - a.zIndex)[0]
    if (below) {
      history.push(elements.value)
      const temp = el.zIndex
      el.zIndex = below.zIndex
      below.zIndex = temp
    }
  }

  function undo(): void {
    const state = history.undo(elements.value)
    if (state) {
      elements.value = state
      selectedElementId.value = null
    }
  }

  function redo(): void {
    const state = history.redo(elements.value)
    if (state) {
      elements.value = state
      selectedElementId.value = null
    }
  }

  function loadTemplate(template: Template): void {
    history.push(elements.value)
    templateId.value = template.id
    templateName.value = template.name
    elements.value = template.elements
  }

  function getTemplate(): Template {
    return {
      id: templateId.value,
      name: templateName.value,
      elements: elements.value,
      canvasSize: canvasSize.value,
      backgroundColor: backgroundColor.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  function newTemplate(): void {
    history.push(elements.value)
    elements.value = []
    selectedElementId.value = null
    templateId.value = generateId()
    templateName.value = 'Untitled Template'
  }

  return {
    elements,
    selectedElementId,
    selectedElement,
    templateName,
    addElement,
    selectElement,
    moveElement,
    resizeElement,
    pushHistory,
    updateElement,
    deleteElement,
    bringForward,
    sendBackward,
    undo,
    redo,
    loadTemplate,
    getTemplate,
    newTemplate,
  }
})

export { useNotificationStore } from './notification'