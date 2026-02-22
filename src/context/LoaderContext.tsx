/**
 * Loader Context Provider
 * Provides global loader functionality that can be accessed from anywhere in the app
 */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import Loader from '../component/Loader';

interface LoaderContextType {
  isLoading: boolean;
  showLoader: (color?: string) => void;
  hideLoader: () => void;
  withLoader: <T>(asyncFn: () => Promise<T>, color?: string) => Promise<T>;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderColor, setLoaderColor] = useState<string | undefined>(undefined);

  /**
   * Show the global loader
   * @param color - Optional color for the loader spinner
   */
  const showLoader = useCallback((color?: string) => {
    setLoaderColor(color);
    setIsLoading(true);
  }, []);

  /**
   * Hide the global loader
   */
  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setLoaderColor(undefined);
  }, []);

  /**
   * Execute an async function with automatic loader management
   * @param asyncFn - The async function to execute
   * @param color - Optional color for the loader spinner
   * @returns The result of the async function
   */
  const withLoader = useCallback(
    async <T,>(asyncFn: () => Promise<T>, color?: string): Promise<T> => {
      showLoader(color);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader],
  );

  const value: LoaderContextType = {
    isLoading,
    showLoader,
    hideLoader,
    withLoader,
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <Loader visible={isLoading} color={loaderColor} />
    </LoaderContext.Provider>
  );
};

/**
 * Hook to access loader context
 * Use this to show/hide loader from anywhere in the app
 * 
 * @example
 * const { showLoader, hideLoader, withLoader } = useLoader();
 * 
 * // Manual control
 * showLoader();
 * await someAsyncOperation();
 * hideLoader();
 * 
 * // Automatic control
 * await withLoader(async () => {
 *   return await someAsyncOperation();
 * });
 */
export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};

export default LoaderContext;
