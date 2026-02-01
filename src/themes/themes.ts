export interface Theme {
  name: string;
  id: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  textDim: string;
  accent: string;
  accentSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  border: string;
  glow: string;
}

export const themes: Theme[] = [
  {
    id: 'matrix',
    name: 'Matrix',
    background: '#0a0a0a',
    backgroundSecondary: '#111111',
    text: '#00ff41',
    textDim: '#00aa2a',
    accent: '#00ff41',
    accentSecondary: '#39ff14',
    success: '#00ff41',
    warning: '#c4ff00',
    error: '#ff3131',
    info: '#00ffaa',
    border: '#00ff4133',
    glow: '#00ff4166',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    background: '#0d0221',
    backgroundSecondary: '#1a0533',
    text: '#ff00ff',
    textDim: '#aa00aa',
    accent: '#00ffff',
    accentSecondary: '#ff00ff',
    success: '#00ff9f',
    warning: '#ffff00',
    error: '#ff3366',
    info: '#00ffff',
    border: '#ff00ff33',
    glow: '#ff00ff55',
  },
  {
    id: 'dracula',
    name: 'Dracula',
    background: '#282a36',
    backgroundSecondary: '#1e1f29',
    text: '#f8f8f2',
    textDim: '#6272a4',
    accent: '#ff79c6',
    accentSecondary: '#bd93f9',
    success: '#50fa7b',
    warning: '#f1fa8c',
    error: '#ff5555',
    info: '#8be9fd',
    border: '#44475a',
    glow: '#bd93f955',
  },
  {
    id: 'nord',
    name: 'Nord',
    background: '#2e3440',
    backgroundSecondary: '#3b4252',
    text: '#eceff4',
    textDim: '#d8dee9',
    accent: '#88c0d0',
    accentSecondary: '#81a1c1',
    success: '#a3be8c',
    warning: '#ebcb8b',
    error: '#bf616a',
    info: '#5e81ac',
    border: '#4c566a',
    glow: '#88c0d044',
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    background: '#fdf6e3',
    backgroundSecondary: '#eee8d5',
    text: '#657b83',
    textDim: '#93a1a1',
    accent: '#268bd2',
    accentSecondary: '#2aa198',
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
    border: '#93a1a1',
    glow: '#268bd244',
  },
  {
    id: 'retro-amber',
    name: 'Retro Amber',
    background: '#0c0c0c',
    backgroundSecondary: '#1a1400',
    text: '#ffb000',
    textDim: '#cc8800',
    accent: '#ffd700',
    accentSecondary: '#ffb000',
    success: '#ffcc00',
    warning: '#ff9500',
    error: '#ff4500',
    info: '#ffd700',
    border: '#ffb00033',
    glow: '#ffb00055',
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    background: '#0a1628',
    backgroundSecondary: '#132238',
    text: '#e0e7ff',
    textDim: '#94a3b8',
    accent: '#3b82f6',
    accentSecondary: '#60a5fa',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#0ea5e9',
    border: '#334155',
    glow: '#3b82f644',
  },
  {
    id: 'forest',
    name: 'Forest',
    background: '#0f1a0f',
    backgroundSecondary: '#1a2f1a',
    text: '#a8e6cf',
    textDim: '#6b9e7a',
    accent: '#56ab2f',
    accentSecondary: '#a8e063',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#38bdf8',
    border: '#2d4a2d',
    glow: '#56ab2f44',
  },
];

export const getThemeById = (id: string): Theme => {
  return themes.find((t) => t.id === id) || themes[0];
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  root.style.setProperty('--bg-primary', theme.background);
  root.style.setProperty('--bg-secondary', theme.backgroundSecondary);
  root.style.setProperty('--text-primary', theme.text);
  root.style.setProperty('--text-dim', theme.textDim);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-secondary', theme.accentSecondary);
  root.style.setProperty('--success', theme.success);
  root.style.setProperty('--warning', theme.warning);
  root.style.setProperty('--error', theme.error);
  root.style.setProperty('--info', theme.info);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--glow', theme.glow);
};
