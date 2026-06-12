import { useState, useCallback, useRef, useEffect } from 'react';
import { getFallback } from '../utils/getFallback';

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LOG_KEY = 'hp_rate_log';

/**
 * Custom hook for managing gemstone recommendation state and API calls.
 * Handles loading, error, data states with automatic fallback on failure.
 *
 * @returns {Object} { recommend, loading, error, data, reset, rateLimited, cooldownSeconds }
 */
export function useRecommendation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const abortControllerRef = useRef(null);
  const cooldownRef = useRef(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const writeHistory = (formData, result, startTime) => {
    const entry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      rashi: formData.rashi,
      lagna: formData.lagna,
      issue: formData.currentIssue,
      gemstone: result.gemstone,
      gemstone_code: result.log_code || result.gemstone?.slice(0,3).toUpperCase() || 'UNK',
      confidence_score: result.confidence_score || 0,
      source: result.source || 'ai',
      response_time_ms: Date.now() - startTime
    };
    try {
      const existing = JSON.parse(sessionStorage.getItem('hp_recommendation_history') || '[]');
      existing.unshift(entry);
      sessionStorage.setItem('hp_recommendation_history', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.warn('History write failed:', e);
    }
  };

  const recommend = useCallback(async (formData) => {
    // Rate limiting
    try {
      const rateLog = JSON.parse(sessionStorage.getItem(RATE_LOG_KEY) || '[]');
      const recent = rateLog.filter(t => Date.now() - t < RATE_LIMIT_WINDOW_MS);
      if (recent.length >= RATE_LIMIT_MAX) {
        const oldest = recent[0];
        const waitMs = RATE_LIMIT_WINDOW_MS - (Date.now() - oldest);
        const waitSec = Math.ceil(waitMs / 1000);
        setRateLimited(true);
        setCooldownSeconds(waitSec);
        cooldownRef.current = setInterval(() => {
          setCooldownSeconds(prev => {
            if (prev <= 1) {
              clearInterval(cooldownRef.current);
              setRateLimited(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return;
      }
      recent.push(Date.now());
      sessionStorage.setItem(RATE_LOG_KEY, JSON.stringify(recent.slice(-10)));
    } catch (e) { /* sessionStorage unavailable */ }

    const startTime = Date.now();

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
      writeHistory(formData, result, startTime);
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
        writeHistory(formData, fallbackResult, startTime);
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

  return { recommend, loading, error, data, reset, rateLimited, cooldownSeconds };
}
