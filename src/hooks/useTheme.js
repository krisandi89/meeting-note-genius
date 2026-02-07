/**
 * Custom hook for theme management with system preference detection
 */

import { useState, useEffect } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('theme');
        if (saved && ['dark', 'light', 'system'].includes(saved)) {
            return saved;
        }
        return 'dark'; // Default to dark
    });

    const [resolvedTheme, setResolvedTheme] = useState('dark');

    useEffect(() => {
        const applyTheme = () => {
            let effectiveTheme = theme;

            if (theme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
            }

            setResolvedTheme(effectiveTheme);
            document.documentElement.setAttribute('data-theme', effectiveTheme);

            // Also set class for Tailwind dark mode if needed
            if (effectiveTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const cycleTheme = () => {
        setTheme(prev => {
            if (prev === 'dark') return 'light';
            if (prev === 'light') return 'system';
            return 'dark';
        });
    };

    return { theme, setTheme, resolvedTheme, cycleTheme };
}
