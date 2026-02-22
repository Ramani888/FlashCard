import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomeButton from '../../src/custome/CustomeButton';
import { Text } from 'react-native';

// Mock icon component
const MockIcon = ({ name, style }: any) => (
  <Text style={style} testID={`icon-${name}`}>
    {name}
  </Text>
);

describe('CustomeButton', () => {
  describe('Basic Rendering', () => {
    it('should render with title', () => {
      const { getByText } = render(<CustomeButton title="Test Button" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with testID', () => {
      const { getByTestId } = render(
        <CustomeButton title="Test Button" testID="custom-button" />
      );
      expect(getByTestId('custom-button')).toBeTruthy();
    });
  });

  describe('Press Handling', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomeButton title="Press Me" onPress={onPressMock} />
      );

      fireEvent.press(getByText('Press Me'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomeButton title="Press Me" onPress={onPressMock} disabled={true} />
      );

      fireEvent.press(getByText('Press Me'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should handle multiple presses', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomeButton title="Press Me" onPress={onPressMock} />
      );

      const button = getByText('Press Me');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Styling', () => {
    it('should apply custom container styles', () => {
      const customStyle = { backgroundColor: 'red', padding: 20 };
      const { getByTestId } = render(
        <CustomeButton
          title="Styled Button"
          containerStyle={customStyle}
          testID="styled-button"
        />
      );

      const button = getByTestId('styled-button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ padding: 20 })])
      );
    });

    it('should apply custom text styles', () => {
      const customTextStyle = { fontSize: 20, color: 'blue' };
      const { getByText } = render(
        <CustomeButton title="Styled Text" textStyle={customTextStyle} />
      );

      const text = getByText('Styled Text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ fontSize: 20, color: 'blue' })])
      );
    });

    it('should apply disabled styles when disabled', () => {
      const { getByTestId } = render(
        <CustomeButton title="Disabled" disabled={true} testID="disabled-btn" />
      );

      const button = getByTestId('disabled-btn');
      expect(button.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })])
      );
    });
  });

  describe('Icons', () => {
    it('should render left icon when provided', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="With Left Icon"
          iconLeft={{
            Component: MockIcon,
            name: 'arrow-left',
            size: 24,
            color: 'white',
          }}
        />
      );

      expect(getByTestId('icon-arrow-left')).toBeTruthy();
    });

    it('should render right icon when provided', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="With Right Icon"
          iconRight={{
            Component: MockIcon,
            name: 'arrow-right',
            size: 24,
            color: 'white',
          }}
        />
      );

      expect(getByTestId('icon-arrow-right')).toBeTruthy();
    });

    it('should render both left and right icons', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="With Both Icons"
          iconLeft={{
            Component: MockIcon,
            name: 'arrow-left',
          }}
          iconRight={{
            Component: MockIcon,
            name: 'arrow-right',
          }}
        />
      );

      expect(getByTestId('icon-arrow-left')).toBeTruthy();
      expect(getByTestId('icon-arrow-right')).toBeTruthy();
    });

    it('should use default icon props', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Default Icon Props"
          iconLeft={{
            Component: MockIcon,
            name: 'check',
          }}
        />
      );

      const icon = getByTestId('icon-check');
      expect(icon).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility role button', () => {
      const { getByRole } = render(<CustomeButton title="Accessible Button" />);
      expect(getByRole('button')).toBeTruthy();
    });

    it('should use title as default accessibility label', () => {
      const { getByLabelText } = render(<CustomeButton title="My Button" />);
      expect(getByLabelText('My Button')).toBeTruthy();
    });

    it('should use custom accessibility label when provided', () => {
      const { getByLabelText } = render(
        <CustomeButton
          title="Button"
          accessibilityLabel="Custom Label"
        />
      );
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });

    it('should have correct accessibility state when disabled', () => {
      const { getByRole } = render(
        <CustomeButton title="Disabled Button" disabled={true} />
      );
      
      const button = getByRole('button');
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });

    it('should include accessibility hint when provided', () => {
      const { getByRole } = render(
        <CustomeButton
          title="Button"
          accessibilityHint="Double tap to submit"
        />
      );
      
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toBe('Double tap to submit');
    });
  });

  describe('Performance', () => {
    it('should not re-render when unrelated props change', () => {
      const onPressMock = jest.fn();
      const { rerender } = render(
        <CustomeButton title="Button" onPress={onPressMock} />
      );

      // Re-render with same props
      rerender(<CustomeButton title="Button" onPress={onPressMock} />);

      // The memo should prevent unnecessary re-renders
      // This is more of a smoke test; actual performance testing would require React DevTools
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should maintain onPress reference stability', () => {
      const onPressMock = jest.fn();
      const { getByText, rerender } = render(
        <CustomeButton title="Button" onPress={onPressMock} />
      );

      fireEvent.press(getByText('Button'));
      expect(onPressMock).toHaveBeenCalledTimes(1);

      // Re-render with same onPress
      rerender(<CustomeButton title="Button" onPress={onPressMock} />);

      fireEvent.press(getByText('Button'));
      expect(onPressMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing onPress prop', () => {
      const { getByText } = render(<CustomeButton title="No Handler" />);
      
      // Should not throw
      expect(() => {
        fireEvent.press(getByText('No Handler'));
      }).not.toThrow();
    });

    it('should handle empty title', () => {
      const { getByTestId } = render(
        <CustomeButton title="" testID="empty-title" />
      );
      expect(getByTestId('empty-title')).toBeTruthy();
    });

    it('should pass additional Pressable props', () => {
      const onPressIn = jest.fn();
      const onPressOut = jest.fn();
      
      const { getByTestId } = render(
        <CustomeButton
          title="Extra Props"
          testID="extra-props-btn"
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      );

      const button = getByTestId('extra-props-btn');
      fireEvent(button, 'pressIn');
      fireEvent(button, 'pressOut');

      expect(onPressIn).toHaveBeenCalledTimes(1);
      expect(onPressOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('Backward Compatibility (Legacy API)', () => {
    it('should render with legacy buttonWidth and buttonHeight props', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Legacy Button"
          buttonWidth={200}
          buttonHeight={50}
          testID="legacy-btn"
        />
      );

      const button = getByTestId('legacy-btn');
      expect(button.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: 200, height: 50 })])
      );
    });

    it('should render with legacy buttonColor prop', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Colored Button"
          buttonColor="#007AFF"
          testID="colored-btn"
        />
      );

      const button = getByTestId('colored-btn');
      expect(button.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: '#007AFF' })])
      );
    });

    it('should render with legacy font props', () => {
      const { getByText } = render(
        <CustomeButton
          title="Legacy Font"
          fontSize={18}
          fontColor="#FFFFFF"
          fontWeight="bold"
        />
      );

      const text = getByText('Legacy Font');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' })
        ])
      );
    });

    it('should render with legacy spacing props', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Spaced Button"
          marginTop={10}
          marginHorizontal={20}
          paddingVertical={15}
          testID="spaced-btn"
        />
      );

      const button = getByTestId('spaced-btn');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ marginTop: 10, marginHorizontal: 20, paddingVertical: 15 })
        ])
      );
    });

    it('should render with legacy border props', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Bordered"
          borderRadius={12}
          borderWidth={2}
          borderColor="#007AFF"
          testID="bordered-btn"
        />
      );

      const button = getByTestId('bordered-btn');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderRadius: 12, borderWidth: 2, borderColor: '#007AFF' })
        ])
      );
    });

    it('should merge legacy props with containerStyle', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Merged"
          buttonColor="#FF0000"
          containerStyle={{ borderRadius: 8, padding: 10 }}
          testID="merged-btn"
        />
      );

      const button = getByTestId('merged-btn');
      // New containerStyle should override/merge with legacy props
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: '#FF0000' }),
          expect.objectContaining({ borderRadius: 8, padding: 10 })
        ])
      );
    });

    it('should call onPress with legacy API', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <CustomeButton
          title="Legacy Press"
          onPress={onPressMock}
          buttonColor="#007AFF"
          buttonWidth="90%"
        />
      );

      fireEvent.press(getByText('Legacy Press'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should support string width/height values (e.g., "90%")', () => {
      const { getByTestId } = render(
        <CustomeButton
          title="Percentage Width"
          buttonWidth="90%"
          buttonHeight="100%"
          testID="percentage-btn"
        />
      );

      const button = getByTestId('percentage-btn');
      expect(button.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ width: '90%', height: '100%' })])
      );
    });
  });
});
