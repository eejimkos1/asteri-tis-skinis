import { UserProfile } from '../types';

const GIST_FILE_NAME = 'asteri-users.json';

export interface GistConfig {
  gistId: string;
  token: string;
}

interface GistResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function getGistConfig(): GistConfig | null {
  const token = import.meta.env.VITE_GIST_TOKEN;
  const gistId = import.meta.env.VITE_GIST_ID;
  if (!token || !gistId) return null;
  return { token, gistId };
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
