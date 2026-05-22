import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { ApiResponse } from '@/types'

const httpClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})

async function handleError(error: unknown): Promise<ApiResponse> {
    if (axios.isAxiosError(error)) {
        const res = error.response
        if (res) {
            const payload = res.data as { message?: unknown } | undefined
            const message = typeof payload?.message === 'string' ? payload.message : res.statusText
            return { success: false, status: res.status, error: String(message) }
        }
        return { success: false, status: 0, error: error.message }
    }
    return { success: false, status: 0, error: (error as Error)?.message ?? 'error' }
}

export async function get<T = unknown>(path: string): Promise<ApiResponse<T>> {
    try {
        const res = await httpClient.get<T>(path)
        return { success: true, status: res.status, data: res.data as T }
    } catch (err) {
        return handleError(err) as Promise<ApiResponse<T>>
    }
}

export async function post<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
        const res = await httpClient.post<T>(path, body)
        return { success: true, status: res.status, data: res.data as T }
    } catch (err) {
        return handleError(err) as Promise<ApiResponse<T>>
    }
}

export async function del<T = unknown>(path: string): Promise<ApiResponse<T>> {
    try {
        const res = await httpClient.delete<T>(path)
        return { success: true, status: res.status, data: res.data as T }
    } catch (err) {
        return handleError(err) as Promise<ApiResponse<T>>
    }
}

export const request = { get, post, del }

export default request
