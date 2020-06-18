import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, StatusBar } from 'react-native';

const Jogo = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

      <ImageBackground
        source={require('../../imgs/x_azul.png')}
        resizeMethod="resize"
        style={styles.header}
      >

      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#B8D4FF',
    maxHeight: 173,
  },
});

export default Jogo;