import {
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
  KeyboardTypeOptions,
} from 'react-native';
import {ForwardRefExoticComponent, RefAttributes, ReactElement} from 'react';

export interface CustomeInputFieldProps {
  placeholder?: string;
  value?: string;
  maxLength?: number;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  touched?: boolean;
  errors?: string;
  borderRadius?: number;
  backgroundColor?: string;
  width?: string | number;
  height?: string | number;
  placeholderTextColor?: string;
  marginHorizontal?: number;
  iconLeft?: boolean;
  IconLeftComponent?: ReactElement | null;
  iconRight?: boolean;
  IconRightComponent?: ReactElement | null;
  textArea?: boolean;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  multiline?: boolean;
  numberOfLines?: number;
  customStyles?: StyleProp<ViewStyle>;
  errorTextStyles?: StyleProp<TextStyle>;
  inputStyles?: StyleProp<TextStyle>;
  inputContainerStyles?: StyleProp<ViewStyle>;
  errorContainerStyle?: StyleProp<ViewStyle>;
  onBlur?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  testID?: string;
}

declare const CustomeInputField: ForwardRefExoticComponent<
  CustomeInputFieldProps & RefAttributes<any>
>;

export default CustomeInputField;
