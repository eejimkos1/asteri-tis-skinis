import { UserProfile } from '../types';

const GIST_FILE_NAME = 'asteri-users.json';
const CONFIG_TOKEN_KEY = 'asteri-gist-token';
const CONFIG_ID_KEY = 'asteri-gist-id';

export interface GistConfig {
  gistId: string;
  token: string;
}

interface GistResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function deobfuscate(encoded: string): string {
  return atob(encoded.split('').reverse().join(''));
}

let cachedRemoteConfig: GistConfig | null = null;

export async function loadRemoteConfig(): Promise<void> {
  try {
    const base = import.meta.env.BASE_URL || '/';
    const res = await fetch(`${base}sync-config.json`);
    if (!res.ok) return;
    const json = await res.json();
    if (json.k && json.k !== 'PASTE_YOUR_TOKEN_HERE' && json.g) {
      cachedRemoteConfig = {
        token: json.k.startsWith('ghp_') ? json.k : deobfuscate(json.k),
        gistId: json.g,
      };
    }
  } catch { /* no remote config available */ }
}

export function getGistConfig(): GistConfig | null {
  const token = localStorage.getItem(CONFIG_TOKEN_KEY);
  const gistId = localStorage.getItem(CONFIG_ID_KEY);
  if (token && gistId) return { token, gistId };
  return cachedRemoteConfig;
}

export function setGistConfig(token: string, gistId: string): void {
  localStorage.setItem(CONFIG_TOKEN_KEY, token);
  localStorage.setItem(CONFIG_ID_KEY, gistId);
}

export function clearGistConfig(): void {
  localStorage.removeItem(CONFIG_TOKEN_KEY);
  localStorage.removeItem(CONFIG_ID_KEY);
}

export async function readGist(config: GistConfig): Promise<GistResult<Record<string, UserProfile>>> {
  try {
    const res = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }

    const gist = await res.json();
    const file = gist.files?.[GIST_FILE_NAME];
    if (!file || !file.content) {
      return { success: true, data: {} };
    }

    const data = JSON.parse(file.content) as Record<string, UserProfile>;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}

export async function writeGist(config: GistConfig, users: Record<string, UserProfile>): Promise<GistResult<void>> {
  try {
    const res = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [GIST_FILE_NAME]: {
            content: JSON.stringify(users, null, 2),
          },
        },
      }),
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}
