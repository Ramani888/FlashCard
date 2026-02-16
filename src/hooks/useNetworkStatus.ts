/**
 * Custom hook for network connectivity status
 * Monitors and provides real-time network status
 */
import {useEffect, useState, useCallback} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {setOnlineStatus} from '../redux/slices/appSlice';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
  isWifi: boolean;
  isCellular: boolean;
}

interface UseNetworkStatusReturn extends NetworkStatus {
  checkConnection: () => Promise<boolean>;
}

export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector(state => state.app.isOnline);

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: isOnline,
    isInternetReachable: null,
    type: 'unknown',
    isWifi: false,
    isCellular: false,
  });

  const updateNetworkStatus = useCallback(
    (state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      const newStatus: NetworkStatus = {
        isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isWifi: state.type === 'wifi',
        isCellular: state.type === 'cellular',
      };

      setNetworkStatus(newStatus);
      dispatch(setOnlineStatus(isConnected));
    },
    [dispatch],
  );

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(updateNetworkStatus);

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(updateNetworkStatus);

    return () => {
      unsubscribe();
    };
  }, [updateNetworkStatus]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    updateNetworkStatus(state);
    return state.isConnected ?? false;
  }, [updateNetworkStatus]);

  return {
    ...networkStatus,
    checkConnection,
  };
};

export default useNetworkStatus;
