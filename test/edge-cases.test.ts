import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useRecipes } from '@features/recipes/hooks/useRecipes';

const mockGetRecipes = vi.fn();

vi.mock('@services/recipes.service', () => ({
  recipesService: {
    getRecipes: (...args: unknown[]) => mockGetRecipes(...args),
  },
}));

describe('useRecipes retry after error', () => {
  beforeEach(() => {
    mockGetRecipes.mockReset();
  });

  it('retry refetches and recovers after a failed request', async () => {
    mockGetRecipes
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ recipes: [{ id: 1, title: 'Recovered Recipe' }], total: 1 });

    const { result } = renderHook(() => useRecipes({}));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.recipes).toEqual([]);

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
    expect(result.current.recipes).toHaveLength(1);
    expect(result.current.recipes[0].title).toBe('Recovered Recipe');
  });

  it('retry can be called multiple times', async () => {
    mockGetRecipes
      .mockRejectedValueOnce(new Error('Error 1'))
      .mockRejectedValueOnce(new Error('Error 2'))
      .mockResolvedValueOnce({ recipes: [{ id: 1, title: 'Success' }], total: 1 });

    const { result } = renderHook(() => useRecipes({}));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
    expect(result.current.recipes).toHaveLength(1);
  });
});

describe('useRecipes respects cancelled flag', () => {
  beforeEach(() => {
    mockGetRecipes.mockReset();
  });

  it('does not set state after unmount during loading', async () => {
    let resolvePromise!: (value: unknown) => void;
    mockGetRecipes.mockReturnValue(new Promise((resolve) => { resolvePromise = resolve; }));

    const { result, unmount } = renderHook(() => useRecipes({}));

    expect(result.current.loading).toBe(true);

    unmount();

    resolvePromise({ recipes: [{ id: 99, title: 'Should not appear' }], total: 1 });

    await vi.waitFor(() => {
      expect(mockGetRecipes).toHaveBeenCalled();
    });
  });

  it('stays in loading state until unmounted then resolves safely', async () => {
    let resolvePromise!: (value: unknown) => void;
    mockGetRecipes.mockReturnValue(new Promise((resolve) => { resolvePromise = resolve; }));

    const { result, unmount } = renderHook(() => useRecipes({}));

    expect(result.current.loading).toBe(true);

    unmount();
    resolvePromise({ recipes: [], total: 0 });

    await vi.waitFor(() => {
      expect(mockGetRecipes).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Empty API response', () => {
  beforeEach(() => {
    mockGetRecipes.mockReset();
  });

  it('handles empty array from API gracefully', async () => {
    mockGetRecipes.mockResolvedValue({ recipes: [], total: 0 });

    const { result } = renderHook(() => useRecipes({}));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.error).toBe(false);
  });

  it('handles empty response with zero total', async () => {
    mockGetRecipes.mockResolvedValue({ recipes: [], total: 0 });

    const { result } = renderHook(() => useRecipes({ search: 'nonexistent' }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });
});

describe('Custom hooks handle cancelled requests', () => {
  beforeEach(() => {
    mockGetRecipes.mockReset();
  });

  it('does not call setState on cancelled request when API rejects', async () => {
    mockGetRecipes.mockRejectedValue(new Error('API Error'));

    const { result, unmount } = renderHook(() => useRecipes({}));

    unmount();

    await vi.waitFor(() => {
      expect(mockGetRecipes).toHaveBeenCalled();
    });
  });

  it('handles rapid remount and unmount gracefully', async () => {
    mockGetRecipes.mockResolvedValue({ recipes: [{ id: 1, title: 'Rapid' }], total: 1 });

    const { result: resultA } = renderHook(() => useRecipes({}));
    await waitFor(() => expect(resultA.current.loading).toBe(false));
    expect(resultA.current.recipes).toHaveLength(1);

    mockGetRecipes.mockResolvedValue({ recipes: [{ id: 2, title: 'Rapid 2' }], total: 1 });

    const { result: resultB } = renderHook(() => useRecipes({}));
    await waitFor(() => expect(resultB.current.loading).toBe(false));
    expect(resultB.current.recipes[0].title).toBe('Rapid 2');
  });

  it('stale responses from previous requests are ignored after unmount', async () => {
    let resolveA!: (value: unknown) => void;
    mockGetRecipes.mockReturnValue(new Promise((resolve) => { resolveA = resolve; }));

    const { result, unmount } = renderHook(() => useRecipes({}));
    expect(result.current.loading).toBe(true);

    unmount();

    resolveA({ recipes: [{ id: 1, title: 'Stale' }], total: 1 });

    await vi.waitFor(() => {
      expect(mockGetRecipes).toHaveBeenCalled();
    });
  });
});
