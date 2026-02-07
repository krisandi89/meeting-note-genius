import { Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle({ theme, cycleTheme }) {
    const getIcon = () => {
        if (theme === 'dark') return <Moon className="w-5 h-5" />;
        if (theme === 'light') return <Sun className="w-5 h-5" />;
        return <Monitor className="w-5 h-5" />;
    };

    const getLabel = () => {
        if (theme === 'dark') return 'Dark';
        if (theme === 'light') return 'Light';
        return 'System';
    };

    return (
        <button
            onClick={cycleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                 hover:bg-[var(--color-bg-tertiary)]"
            title={`Theme: ${getLabel()}`}
        >
            {getIcon()}
            <span className="text-sm font-medium hidden sm:inline">{getLabel()}</span>
        </button>
    );
}
