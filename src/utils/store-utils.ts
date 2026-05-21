import type {
    TemplateElement,
} from '@/types'
export function cloneElements(state: TemplateElement[]): TemplateElement[] {
    return JSON.parse(JSON.stringify(state)) as TemplateElement[]
}

export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}