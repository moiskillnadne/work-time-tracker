import { useEffect, useRef } from 'react';

interface UseDocumentTitleOptions {
  restoreOnUnmount?: boolean;
}

export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
): void {
  const { restoreOnUnmount = false } = options;
  const originalTitleRef = useRef<string>(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (restoreOnUnmount) {
      return () => {
        document.title = originalTitleRef.current;
      };
    }
  }, [restoreOnUnmount]);
}
