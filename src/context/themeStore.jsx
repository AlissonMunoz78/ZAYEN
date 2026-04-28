import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((s) => {
        const next = !s.isDark;
        if (next) {
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
        }
        return { isDark: next };
      }),
      init: () => {
        const stored = JSON.parse(localStorage.getItem('theme-store') || '{}');
        const isDark = stored?.state?.isDark !== false;
        if (!isDark) document.documentElement.classList.add('light');
      }
    }),
    { name: 'theme-store' }
  )
);

export default themeStore;
