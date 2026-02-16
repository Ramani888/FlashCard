import React, {Component, ErrorInfo, ReactNode} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Color from '../component/Color';
import Font from '../component/Font';
import {scale, verticalScale, moderateScale} from '../custome/Responsive';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({errorInfo});

    // Log error to your error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // You can also log to a crash reporting service here
    // e.g., crashlytics().recordError(error);
  }

  handleRestart = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⚠️</Text>
            </View>

            <Text style={styles.title}>Oops! Something went wrong</Text>

            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Please try again
              or restart the app.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleRestart}
              accessibilityRole="button"
              accessibilityLabel="Try again">
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  iconContainer: {
    marginBottom: verticalScale(20),
  },
  iconText: {
    fontSize: moderateScale(60),
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: Font.bold,
    color: Color.Black,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  message: {
    fontSize: moderateScale(16),
    fontFamily: Font.regular,
    color: Color.Gray,
    textAlign: 'center',
    marginBottom: verticalScale(30),
    lineHeight: verticalScale(24),
  },
  button: {
    backgroundColor: Color.theme1,
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(10),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: Font.semiBold,
    color: Color.White,
  },
  errorContainer: {
    marginTop: verticalScale(30),
    maxHeight: verticalScale(200),
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: moderateScale(8),
    padding: scale(10),
  },
  errorTitle: {
    fontSize: moderateScale(14),
    fontFamily: Font.semiBold,
    color: Color.Red,
    marginBottom: verticalScale(5),
  },
  errorText: {
    fontSize: moderateScale(12),
    fontFamily: Font.regular,
    color: Color.Black,
    marginBottom: verticalScale(10),
  },
  errorStack: {
    fontSize: moderateScale(10),
    fontFamily: Font.regular,
    color: Color.Gray,
  },
});

export default ErrorBoundary;
