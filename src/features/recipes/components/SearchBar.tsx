import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search recipes' }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => searchParams.get('search') || '');
  const skipSyncRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      skipSyncRef.current = true;
      setSearchParams(
        value ? { search: value } : {},
        { replace: true }
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [value, setSearchParams]);

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    setValue(searchParams.get('search') || '');
  }, [searchParams]);

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
        <span className="material-symbols-outlined text-[20px]">search</span>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 text-sm text-on-surface bg-background border-2 rounded-xl transition-colors duration-150 placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:border-primary border-outline hover:border-on-surface-variant/50"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-container transition-colors"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
        </button>
      )}
    </div>
  );
}