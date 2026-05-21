import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NOTIF_SUCCESS, NOTIF_ERROR } from '../constants/notifications'
import type { NotificationType } from '../constants/notifications'

export const useNotificationStore = defineStore('notification', () => {
    const notification = ref<{ message: string; type: NotificationType } | null>(null)
    let timer: number | undefined

    function notify(
        message: string,
        type: NotificationType = NOTIF_SUCCESS,
        duration = 3000
    ): void {
        notification.value = { message, type }
        if (timer) {
            window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
            notification.value = null
            timer = undefined
        }, duration)
    }

    function clearNotification(): void {
        if (timer) {
            window.clearTimeout(timer)
            timer = undefined
        }
        notification.value = null
    }

    return { notification, notify, clearNotification }
})
