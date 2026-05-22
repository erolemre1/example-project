import { setActivePinia, createPinia } from 'pinia'
import { useBaseStore } from '../src/stores/index'

describe('Template Store', () => {
  let store: ReturnType<typeof useBaseStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBaseStore()
    store.newTemplate()
  })

  it('should add an element to the canvas', () => {
    expect(store.elements).toHaveLength(0)

    store.addElement('heading', 50, 100)

    expect(store.elements).toHaveLength(1)
    expect(store.elements[0].type).toBe('heading')
    expect(store.elements[0].position).toEqual({ x: 50, y: 100 })
  })

  it('should delete an element and deselect it', () => {
    store.addElement('button', 10, 20)
    const id = store.elements[0].id
    store.selectElement(id)
    expect(store.selectedElementId).toBe(id)

    store.deleteElement(id)

    expect(store.elements).toHaveLength(0)
    expect(store.selectedElementId).toBeNull()
  })

  it('should update element properties', () => {
    store.addElement('button', 0, 0)
    const id = store.elements[0].id

    store.updateElement(id, { text: 'Subscribe Now' } as never)

    const el = store.elements.find((e) => e.id === id)
    expect((el as { text: string }).text).toBe('Subscribe Now')
  })

  it('should support undo and redo', () => {
    store.addElement('text', 0, 0)
    expect(store.elements).toHaveLength(1)

    store.undo()
    expect(store.elements).toHaveLength(0)

    store.redo()
    expect(store.elements).toHaveLength(1)
  })

  it('should manage z-index with bringForward and sendBackward', () => {
    store.addElement('heading', 0, 0)
    store.addElement('text', 0, 50)

    const headingId = store.elements[0].id
    const textId = store.elements[1].id

    expect(store.elements[0].zIndex).toBe(1)
    expect(store.elements[1].zIndex).toBe(2)

    store.sendBackward(textId)

    const text = store.elements.find((e) => e.id === textId)
    const heading = store.elements.find((e) => e.id === headingId)
    expect(text!.zIndex).toBe(1)
    expect(heading!.zIndex).toBe(2)
  })

  it('should export template as valid JSON structure', () => {
    store.addElement('heading', 10, 20)
    store.addElement('button', 30, 40)

    const template = store.getTemplate()

    expect(template.id).toBeDefined()
    expect(template.name).toBe('Untitled Template')
    expect(template.elements).toHaveLength(2)
    expect(template.canvasSize).toEqual({ width: 400, height: 500 })
    expect(template.backgroundColor).toBe('#FFFFFF')
  })
})
