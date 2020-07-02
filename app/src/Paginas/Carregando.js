import React, { useState, Component } from 'react';
import firebase from 'firebase';
import {StatusBar, Text,SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';

class Carregando extends Component {

  componentDidMount() {
    this.verificaLogin();
  }
  

  verificaLogin = () =>{
    firebase.auth().onAuthStateChanged((user) =>
    {
      if(user) {
        this.props.navigation.navigate('Jogo')
      } else {
        this.props.navigation.navigate('Login')
      }
    })
  }

  render(){
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator color="#7159c1" size="large" barStyle="center"/>
        </SafeAreaView>
      </>
    );
  }

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Carregando;