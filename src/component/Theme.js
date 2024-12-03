import {useSelector} from 'react-redux';

const useTheme = () => {
  const theme = useSelector(state => state.myState.theme);
  const background = theme === 'Light' ? '#FFFFFF' : '#1C1C1C';
  const textColor = theme === 'Light' ? '#000000' : '#FFFFFF';
  const themeColor = {
    background,
    textColor,
  };
  return themeColor;
};

export default useTheme;
