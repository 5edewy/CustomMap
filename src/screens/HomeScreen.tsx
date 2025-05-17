import React from 'react';
import {View} from 'react-native';
import {CustomMapView} from '../components/common';
import styles from '../components/assets/styles/styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <CustomMapView updateLocation={() => null} />
    </View>
  );
};

export default HomeScreen;
