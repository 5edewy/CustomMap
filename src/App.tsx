import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  DefaultTheme,
} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MainNavigator} from './navigation';
import {colors} from './config/theme';

interface AppProps {}

export const navigationRef = createNavigationContainerRef<any>();

const Mytheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    text: 'rgb(28, 28, 30)',
  },
};

const App = (props: AppProps) => {
  const isReadyRef = React.useRef<boolean>(false); // Use useRef here

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer
          theme={Mytheme}
          ref={navigationRef}
          onReady={() => {
            isReadyRef.current = true;
          }}>
          <KeyboardAvoidingView
            style={[styles.container]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <MainNavigator />
          </KeyboardAvoidingView>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
