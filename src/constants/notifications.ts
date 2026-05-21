export const NOTIF_ERROR = 'error' as const
export const NOTIF_SUCCESS = 'success' as const

export type NotificationType = typeof NOTIF_ERROR | typeof NOTIF_SUCCESS

export const NOTIF = {
    ERROR: NOTIF_ERROR,
    SUCCESS: NOTIF_SUCCESS,
}

export default NOTIF
