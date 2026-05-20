import { defineStore } from 'pinia'


export const useBaseStore = defineStore('base', () => {
  const state = {
    templateName: 'Template name',
  }

  return {
    ...state
  }
})