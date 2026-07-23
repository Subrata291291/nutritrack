const cache = new Map<string, { data: unknown; timestamp: number }>();
const DEFAULT_TTL = 60000;

export function getCacheKey(url: string, params?: Record<string, unknown>): string {
  if (!params) return url;
  const sorted = Object.keys(params).sort().reduce((acc, key) => {
    if (params[key] !== undefined) acc[key] = params[key];
    return acc;
  }, {} as Record<string, unknown>);
  return `${url}?${JSON.stringify(sorted)}`;
}

export function getFromCache<T>(key: string, ttl = DEFAULT_TTL): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setInCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}
