'use client';

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setThemeState] = React.useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme: Theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system';
    const resolved = initialTheme === 'system' ? getSystemTheme() : initialTheme;
    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (localStorage.getItem('theme') !== 'light' && localStorage.getItem('theme') !== 'dark') {
        const nextResolved = getSystemTheme();
        setResolvedTheme(nextResolved);
        applyTheme(nextResolved);
      }
    };

    media.addEventListener('change', handleSystemChange);
    return () => media.removeEventListener('change', handleSystemChange);
  }, []);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    const resolved = nextTheme === 'system' ? getSystemTheme() : nextTheme;
    localStorage.setItem('theme', nextTheme);
    setThemeState(nextTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  const value = React.useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
