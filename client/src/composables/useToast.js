import { ref } from 'vue';

const toasts = ref([]);
let id = 0;

export function useToast() {
  function push(message, type = 'info', duration = 3200) {
    const toast = { id: ++id, message, type };
    toasts.value.push(toast);
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toast.id);
    }, duration);
  }

  return {
    toasts,
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  };
}
