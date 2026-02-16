/**
 * Redux Slice Tests
 */
import authReducer, {
  setUser,
  setToken,
  clearError,
  logout,
} from '../../src/redux/slices/authSlice';
import themeReducer, {
  setTheme,
  toggleTheme,
} from '../../src/redux/slices/themeSlice';
import folderReducer, {
  setSelectedFolder,
  clearFolderError,
  clearFolders,
} from '../../src/redux/slices/folderSlice';
import appReducer, {
  setOnlineStatus,
  setAppReady,
  setLanguage,
} from '../../src/redux/slices/appSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const user = {_id: '1', email: 'test@test.com', name: 'Test', token: 'abc'};
    const actual = authReducer(
      initialState,
      setUser({user, token: 'abc'}),
    );
    expect(actual.user).toEqual(user);
    expect(actual.token).toBe('abc');
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle setToken', () => {
    const actual = authReducer(initialState, setToken('new-token'));
    expect(actual.token).toBe('new-token');
  });

  it('should handle clearError', () => {
    const stateWithError = {...initialState, error: 'Some error'};
    const actual = authReducer(stateWithError, clearError());
    expect(actual.error).toBeNull();
  });

  it('should handle logout', () => {
    const authenticatedState = {
      user: {_id: '1', email: 'test@test.com', name: 'Test', token: 'abc'},
      token: 'abc',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const actual = authReducer(authenticatedState, logout());
    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });
});

describe('Theme Slice', () => {
  const initialState: {theme: 'Light' | 'Dark'; isDarkMode: boolean} = {
    theme: 'Light',
    isDarkMode: false,
  };

  it('should return the initial state', () => {
    expect(themeReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  it('should handle setTheme', () => {
    const actual = themeReducer(initialState, setTheme('Dark'));
    expect(actual.theme).toBe('Dark');
    expect(actual.isDarkMode).toBe(true);
  });

  it('should handle toggleTheme', () => {
    const actual = themeReducer(initialState, toggleTheme());
    expect(actual.theme).toBe('Dark');
    expect(actual.isDarkMode).toBe(true);

    const toggled = themeReducer(actual, toggleTheme());
    expect(toggled.theme).toBe('Light');
    expect(toggled.isDarkMode).toBe(false);
  });
});

describe('Folder Slice', () => {
  const initialState = {
    folders: [],
    selectedFolder: null,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(folderReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  it('should handle setSelectedFolder', () => {
    const folder = {_id: '1', name: 'Test Folder', color: '#FF0000', userId: '1', isPrivate: false, isHighlight: false};
    const actual = folderReducer(initialState, setSelectedFolder(folder));
    expect(actual.selectedFolder).toEqual(folder);
  });

  it('should handle clearFolderError', () => {
    const stateWithError = {...initialState, error: 'Some error'};
    const actual = folderReducer(stateWithError, clearFolderError());
    expect(actual.error).toBeNull();
  });

  it('should handle clearFolders', () => {
    const stateWithFolders = {
      ...initialState,
      folders: [{_id: '1', name: 'Test', color: '#000', userId: '1', isPrivate: false, isHighlight: false}],
      selectedFolder: {_id: '1', name: 'Test', color: '#000', userId: '1', isPrivate: false, isHighlight: false},
    };
    const actual = folderReducer(stateWithFolders, clearFolders());
    expect(actual.folders).toEqual([]);
    expect(actual.selectedFolder).toBeNull();
  });
});

describe('App Slice', () => {
  const initialState = {
    isOnline: true,
    isAppReady: false,
    language: 'en',
  };

  it('should return the initial state', () => {
    expect(appReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  it('should handle setOnlineStatus', () => {
    const actual = appReducer(initialState, setOnlineStatus(false));
    expect(actual.isOnline).toBe(false);
  });

  it('should handle setAppReady', () => {
    const actual = appReducer(initialState, setAppReady(true));
    expect(actual.isAppReady).toBe(true);
  });

  it('should handle setLanguage', () => {
    const actual = appReducer(initialState, setLanguage('es'));
    expect(actual.language).toBe('es');
  });
});
