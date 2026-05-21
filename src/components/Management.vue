<script setup lang="ts">

</script>

<template>
    <div class="template-manager">
        <div class="manager-buttons">
            <button class="btn">{{ $t('management.new') }}</button>
            <button class="btn btn-primary">{{ $t('management.save') }}</button>
            <button class="btn">{{ $t('management.exportJson') }}</button>
        </div>
    </div>
</template>

<style scoped>
.template-manager {
    position: relative;
}

.manager-buttons {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 6px 14px;
    border: 1px solid var(--color-gray-300);
    border-radius: 6px;
    background: var(--color-white);
    cursor: pointer;
    font-size: 13px;
    color: var(--color-gray-700);
    display: flex;
}

.btn:hover {
    background: var(--color-gray-100);
}

.btn-primary {
    background: var(--color-indigo-500);
    color: var(--color-white);
    border-color: var(--color-indigo-500);
}

.btn-primary:hover {
    background: var(--color-indigo-700);
}

.templates-list {
    position: absolute;
    bottom: 40px;
    left: 0;
    background: var(--color-white);
    border: 1px solid var(--color-gray-200);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 8px;
    min-width: 260px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.no-templates {
    padding: 12px;
    text-align: center;
    color: var(--color-gray-400);
    font-size: 13px;
}

.template-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 4px;
}

.template-item:hover {
    background: var(--color-gray-50);
}

.template-name {
    font-size: 13px;
    color: var(--color-gray-700);
}

.template-actions {
    display: flex;
    gap: 4px;
}

.btn-xs {
    padding: 3px 8px;
    border: 1px solid var(--color-gray-300);
    border-radius: 4px;
    background: var(--color-white);
    cursor: pointer;
    font-size: 11px;
    color: var(--color-gray-700);
}

.btn-xs:hover {
    background: var(--color-gray-100);
}

.btn-danger {
    color: var(--color-red-600);
    border-color: var(--color-red-300);
}

.btn-danger:hover {
    background: var(--color-red-100);
}
</style>
