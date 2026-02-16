/**
 * Unit tests for useDebounce hook
 */
import {renderHook, act} from '@testing-library/react-native';
import useDebounce from '../../src/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const {result} = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const {result, rerender} = renderHook(
      ({value, delay}) => useDebounce(value, delay),
      {initialProps: {value: 'initial', delay: 500}},
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({value: 'updated', delay: 500});

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDebounce(value, 500),
      {initialProps: {value: 'initial'}},
    );

    // Multiple rapid updates
    rerender({value: 'update1'});
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({value: 'update2'});
    act(() => {
      jest.advanceTimersByTime(200);
    });

    rerender({value: 'update3'});

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Complete the debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should be the last value
    expect(result.current).toBe('update3');
  });

  it('should use custom delay', () => {
    const {result, rerender} = renderHook(
      ({value, delay}) => useDebounce(value, delay),
      {initialProps: {value: 'initial', delay: 1000}},
    );

    rerender({value: 'updated', delay: 1000});

    // Should not update at 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial');

    // Should update at 1000ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle number values', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDebounce(value, 300),
      {initialProps: {value: 0}},
    );

    rerender({value: 42});

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it('should handle object values', () => {
    const initialObj = {name: 'test'};
    const updatedObj = {name: 'updated'};

    const {result, rerender} = renderHook(
      ({value}) => useDebounce(value, 300),
      {initialProps: {value: initialObj}},
    );

    rerender({value: updatedObj});

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
  });
});
