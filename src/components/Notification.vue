<script setup lang="ts">
import { useNotificationStore } from '../stores/index'

const notificationStore = useNotificationStore()
</script>

<template>
    <transition name="notification-fade">
        <div v-if="notificationStore.notification"
            :class="['global-notification', notificationStore.notification.type]">
            {{ notificationStore.notification.message }}
        </div>
    </transition>
</template>

<style scoped>
.global-notification {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 2000;
    min-width: 280px;
    max-width: 360px;
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(8px);
}

.global-notification.success {
    background: rgba(56, 185, 143, 0.12);
    color: #166534;
    border: 1px solid rgba(56, 185, 143, 0.25);
}

.global-notification.error {
    background: rgba(239, 68, 68, 0.12);
    color: #991b1b;
    border: 1px solid rgba(239, 68, 68, 0.25);
}

.notification-fade-enter-active,
.notification-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
