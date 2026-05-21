import type { Template } from '@/types'
import { request } from './axios-interceptors'

export async function fetchTemplates(): Promise<Template[]> {
    const res = await request.get<Template[]>('/templates')
    if (!res.success) throw new Error(res.error ?? 'Failed to fetch templates')
    return res.data ?? []
}

export async function saveTemplate(template: Template): Promise<Template> {
    const res = await request.post<Template>('/templates', template)
    if (!res.success) throw new Error(res.error ?? 'Failed to save template')
    return res.data as Template
}

export async function deleteTemplate(id: string): Promise<void> {
    const res = await request.del<void>(`/templates/${encodeURIComponent(id)}`)
    if (!res.success) throw new Error(res.error ?? 'Failed to delete template')
}
