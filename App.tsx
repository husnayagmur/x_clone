/// <reference types="nativewind/types" />

import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux'; 
import Home from './src/screen/Home';  
import store from './src/redux/store';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';

function App() {
  return (
    <Provider store={store}> 
      <View>
        <LoginScreen />  
      </View>
    </Provider>
  );
}

export default App;
