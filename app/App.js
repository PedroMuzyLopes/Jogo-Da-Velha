import React from 'react';
import { StyleSheet } from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';

import Carregando from './src/Paginas/Carregando';
import Login from './src/Paginas/Login';
import Jogo from './src/Paginas/Jogo';

import firebase from 'firebase';

import { config } from './config';

firebase.initializeApp(config);


export default function App() {

  const Telas = createSwitchNavigator({
    Carregando: Carregando,
    Login: Login,
    Jogo: Jogo
  });

  const Navegacao = createAppContainer(Telas);
  
  return (
    <Navegacao />
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  btnLogin: {
    backgroundColor: '#343434',
    width: '100%',
    height: 55,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 45
  },

  btnTexto: {
    color: '#fff',
    fontSize: 16,
  }

});