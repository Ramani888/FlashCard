/**
 * Unit tests for useLoading hook
 */
import {renderHook, act} from '@testing-library/react-native';
import useLoading from '../../src/hooks/useLoading';

describe('useLoading', () => {
  it('should initialize with false by default', () => {
    const {result} = renderHook(() => useLoading());
    expect(result.current.isLoading).toBe(false);
  });

  it('should initialize with provided initial state', () => {
    const {result} = renderHook(() => useLoading(true));
    expect(result.current.isLoading).toBe(true);
  });

  it('should start loading', () => {
    const {result} = renderHook(() => useLoading());

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should stop loading', () => {
    const {result} = renderHook(() => useLoading(true));

    act(() => {
      result.current.stopLoading();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle withLoading for successful async function', async () => {
    const {result} = renderHook(() => useLoading());

    const asyncFn = jest.fn().mockResolvedValue('success');

    let returnValue: string | undefined;

    await act(async () => {
      returnValue = await result.current.withLoading(asyncFn);
    });

    expect(asyncFn).toHaveBeenCalled();
    expect(returnValue).toBe('success');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle withLoading for failed async function', async () => {
    const {result} = renderHook(() => useLoading());

    const error = new Error('Test error');
    const asyncFn = jest.fn().mockRejectedValue(error);

    await act(async () => {
      try {
        await result.current.withLoading(asyncFn);
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(asyncFn).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set loading to true during async operation', async () => {
    const {result} = renderHook(() => useLoading());

    let resolvePromise: (value: string) => void;
    const asyncFn = jest.fn().mockImplementation(
      () =>
        new Promise(resolve => {
          resolvePromise = resolve;
        }),
    );

    let loadingPromise: Promise<string>;

    act(() => {
      loadingPromise = result.current.withLoading(asyncFn);
    });

    // Loading should be true while promise is pending
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    await act(async () => {
      resolvePromise!('done');
      await loadingPromise;
    });

    // Loading should be false after completion
    expect(result.current.isLoading).toBe(false);
  });
});
