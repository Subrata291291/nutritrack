const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
export const DEFAULT_TTL = 60000;
export const PROFILE_TTL = 300000;

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
  const effectiveTtl = entry.ttl ?? ttl;
  if (Date.now() - entry.timestamp > effectiveTtl) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setInCache(key: string, data: unknown, ttl = DEFAULT_TTL): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

export function clearCache(): void {
  cache.clear();
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    clearCache();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

export function getCacheSize(): number {
  return cache.size;
}
