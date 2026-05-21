import type {
    TemplateElement,
} from '@/types'
import { nanoid } from 'nanoid'
export function cloneElements(state: TemplateElement[]): TemplateElement[] {
    return JSON.parse(JSON.stringify(state)) as TemplateElement[]
}

export function generateId(): string {
    return nanoid()
}