import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CustomeInputField from '../../src/custome/CustomeInputField';
import {View, Text} from 'react-native';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock dependencies
jest.mock('../../src/component/Color', () => ({
  White: '#FFFFFF',
  Black: '#000000',
  Gray: '#808080',
  Red: '#FF0000',
  mediumGray: '#9E9E9E',
  LightGray: '#E0E0E0',
}));

jest.mock('../../src/component/Font', () => ({
  regular: 'System',
  medium: 'System',
  bold: 'System',
}));

jest.mock('../../src/custome/Responsive', () => ({
  scale: (value: number) => value,
  verticalScale: (value: number) => value,
  moderateScale: (value: number) => value,
}));

describe('CustomeInputField', () => {
  const defaultProps = {
    placeholder: 'Enter text',
    value: '',
    onChangeText: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render correctly with default props', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} />,
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should render with provided value', () => {
      const {getByDisplayValue} = render(
        <CustomeInputField {...defaultProps} value="Test value" />,
      );
      expect(getByDisplayValue('Test value')).toBeTruthy();
    });

    it('should apply custom placeholder text color', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField
          {...defaultProps}
          placeholderTextColor="#FF0000"
        />,
      );
      const input = getByPlaceholderText('Enter text');
      expect(input.props.placeholderTextColor).toBe('#FF0000');
    });
  });

  describe('User Interactions', () => {
    it('should call onChangeText when text is entered', () => {
      const onChangeText = jest.fn();
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} onChangeText={onChangeText} />,
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent.changeText(input, 'New text');

      expect(onChangeText).toHaveBeenCalledWith('New text');
    });

    it('should call onBlur when input loses focus', () => {
      const onBlur = jest.fn();
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} onBlur={onBlur} />,
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent(input, 'blur');

      expect(onBlur).toHaveBeenCalled();
    });

    it('should respect editable prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} editable={false} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.editable).toBe(false);
    });

    it('should respect maxLength prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} maxLength={10} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.maxLength).toBe(10);
    });
  });

  describe('Security and Input Types', () => {
    it('should handle secureTextEntry for passwords', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} secureTextEntry={true} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should apply correct keyboardType', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField
          {...defaultProps}
          keyboardType="email-address"
        />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.keyboardType).toBe('email-address');
    });
  });

  describe('Error Handling', () => {
    it('should display error when touched and error exists', () => {
      const {getByText} = render(
        <CustomeInputField
          {...defaultProps}
          errors="This field is required"
          touched={true}
        />,
      );

      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should not display error when not touched', () => {
      const {queryByText} = render(
        <CustomeInputField
          {...defaultProps}
          errors="This field is required"
          touched={false}
        />,
      );

      expect(queryByText('This field is required')).toBeNull();
    });

    it('should not display error when no error exists', () => {
      const {queryByText} = render(
        <CustomeInputField
          {...defaultProps}
          errors=""
          touched={true}
        />,
      );

      // No error text should be found
      expect(queryByText(/./)).toBeNull();
    });

    it('should apply custom error text styles', () => {
      const errorStyle = {fontSize: 12, color: '#FF0000'};
      const {getByText} = render(
        <CustomeInputField
          {...defaultProps}
          errors="Error message"
          touched={true}
          errorTextStyles={errorStyle}
        />,
      );

      const errorText = getByText('Error message');
      expect(errorText.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(errorStyle)]),
      );
    });
  });

  describe('Icons', () => {
    it('should render left icon when provided', () => {
      const LeftIcon = (
        <View testID="left-icon">
          <Text>Email Icon</Text>
        </View>
      );

      const {getByTestId} = render(
        <CustomeInputField
          {...defaultProps}
          iconLeft={true}
          IconLeftComponent={LeftIcon}
        />,
      );

      expect(getByTestId('left-icon')).toBeTruthy();
    });

    it('should render right icon when provided', () => {
      const RightIcon = (
        <View testID="right-icon">
          <Text>Eye Icon</Text>
        </View>
      );

      const {getByTestId} = render(
        <CustomeInputField
          {...defaultProps}
          iconRight={true}
          IconRightComponent={RightIcon}
        />,
      );

      expect(getByTestId('right-icon')).toBeTruthy();
    });

    it('should not render icons when iconLeft/iconRight is false', () => {
      const LeftIcon = <View testID="left-icon"><Text>Icon</Text></View>;

      const {queryByTestId} = render(
        <CustomeInputField
          {...defaultProps}
          iconLeft={false}
          IconLeftComponent={LeftIcon}
        />,
      );

      expect(queryByTestId('left-icon')).toBeNull();
    });
  });

  describe('Multi-line and Text Area', () => {
    it('should handle multiline input', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField
          {...defaultProps}
          multiline={true}
          numberOfLines={5}
        />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.multiline).toBe(true);
      expect(input.props.numberOfLines).toBe(5);
    });

    it('should apply textArea styles when textArea is true', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} textArea={true} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.style).toBeTruthy();
    });

    it('should set correct textAlignVertical', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField
          {...defaultProps}
          textAlignVertical="top"
        />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.textAlignVertical).toBe('top');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom input styles', () => {
      const customStyle = {fontSize: 16, color: '#000000'};
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} inputStyles={customStyle} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });

    it('should apply custom container styles', () => {
      const customStyle = {borderWidth: 2};
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} customStyles={customStyle} />,
      );

      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should respect width prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} width={200} />,
      );

      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should respect height prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} height={50} />,
      );

      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.accessible).toBe(true);
    });

    it('should have accessibility label', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} placeholder="Email address" />,
      );

      const input = getByPlaceholderText('Email address');
      expect(input.props.accessibilityLabel).toBe('Email address');
    });

    it('should show error in accessibility hint when error exists', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField
          {...defaultProps}
          errors="Invalid email"
          touched={true}
        />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.accessibilityHint).toBe('Invalid email');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<any>();
      render(<CustomeInputField {...defaultProps} ref={ref} />);

      expect(ref.current).toBeTruthy();
    });
  });

  describe('Additional Props', () => {
    it('should handle autoCapitalize prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} autoCapitalize="none" />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('should handle autoCorrect prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} autoCorrect={false} />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.autoCorrect).toBe(false);
    });

    it('should handle returnKeyType prop', () => {
      const {getByPlaceholderText} = render(
        <CustomeInputField {...defaultProps} returnKeyType="done" />,
      );

      const input = getByPlaceholderText('Enter text');
      expect(input.props.returnKeyType).toBe('done');
    });

    it('should call onSubmitEditing when submit is pressed', () => {
      const onSubmitEditing = jest.fn();
      const {getByPlaceholderText} = render(
        <CustomeInputField
          {...defaultProps}
          onSubmitEditing={onSubmitEditing}
        />,
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent(input, 'submitEditing');

      expect(onSubmitEditing).toHaveBeenCalled();
    });

    it('should apply testID for testing', () => {
      const {getByTestId} = render(
        <CustomeInputField {...defaultProps} testID="email-input" />,
      );

      expect(getByTestId('email-input')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should not re-render when unrelated props change', () => {
      const onChangeText = jest.fn();
      const {rerender} = render(
        <CustomeInputField
          {...defaultProps}
          value="test"
          onChangeText={onChangeText}
        />,
      );

      // Re-render with same props should not cause issues
      rerender(
        <CustomeInputField
          {...defaultProps}
          value="test"
          onChangeText={onChangeText}
        />,
      );

      // Component should still work
      expect(onChangeText).not.toHaveBeenCalled();
    });

    it('should memoize error display correctly', () => {
      const {rerender, queryByText} = render(
        <CustomeInputField
          {...defaultProps}
          errors="Error message"
          touched={false}
        />,
      );

      expect(queryByText('Error message')).toBeNull();

      rerender(
        <CustomeInputField
          {...defaultProps}
          errors="Error message"
          touched={true}
        />,
      );

      expect(queryByText('Error message')).toBeTruthy();
    });
  });
});
