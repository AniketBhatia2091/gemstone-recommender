import { useState, useCallback, useRef, useEffect } from 'react';
import { getFallback } from '../utils/getFallback';

/**
 * Custom hook for managing gemstone recommendation state and API calls.
 * Handles loading, error, data states with automatic fallback on failure.
 *
 * @returns {Object} { recommend, loading, error, data, reset }
 */
export function useRecommendation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const abortControllerRef = useRef(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const recommend = useCallback(async (formData) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const result = await response.json();

      // Validate the response has the expected shape
      if (!result?.gemstone) {
        throw new Error('Invalid API response: missing gemstone field');
      }

      setData(result);
      setLoading(false);
    } catch (err) {
      // Don't handle aborted requests
      if (err.name === 'AbortError') {
        return;
      }

      // Silent fallback — try local data
      try {
        const fallbackResult = getFallback({
          rashi: formData.rashi,
          lagna: formData.lagna,
          currentIssue: formData.currentIssue,
        });
        setData(fallbackResult);
        setLoading(false);
      } catch (fallbackErr) {
        // Only show error if even fallback fails
        setError('Unable to generate recommendation. Please try again.');
        setLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { recommend, loading, error, data, reset };
}
