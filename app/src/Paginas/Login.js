import React from 'react';
import * as Google from 'expo-google-app-auth';
import { Image ,StatusBar, TextInput, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import firebase from 'firebase';

console.disableYellowBox = true;

export default function Login() {

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('Resposta do autenticador do Google', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(function(result){
            console.log('Usuário logado');
          
            if (result.additionalUserInfo.isNewUser){
              firebase
                .database()
                .ref('/usuarios/' + result.user.uid)
                .set({
                  foto: result.additionalUserInfo.profile.picture,
                  email: result.user.email,
                  nome: result.additionalUserInfo.profile.given_name,
                  sobrenome: result.additionalUserInfo.profile.family_name,
                  data_criacao: Date.now()
                })
                .then(function (snapshot) {
                  //console.log('Snapshot', snapshot)
                })
            } else {
              firebase
                .database()
                .ref('/usuarios/' + result.user.uid).update({
                  ultimo_login: Date.now()
                })

            }
          }).catch(function(error) {
          
            var errorCode = error.code;
            var errorMessage = error.message;
            
            var email = error.email;
            
            var credential = error.credential;
          
        });
      } else {
        console.log('Usuário já esta logado');
      }
    }.bind(this));
  }

   signInWithGoogleAsync = async() => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        androidClientId: '455848204596-j390rvvvoug1ongmmnhet8a8ecdfh0eq.apps.googleusercontent.com',
        iosClientId: '455848204596-ssln00bo0cfk2cmpnt8ktsmnrk8barue.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <SafeAreaView style={styles.container}>
        <Image 
          source={require('../../src/imgs/logo.png')} 
          style={styles.logo}
        />

        <TouchableOpacity
          style={styles.btnLogin}
          activeOpacity={0.75}
          onPress={() => this.signInWithGoogleAsync()}
        >
          <Image
            source={require('../../src/imgs/google.png')}
            style={styles.btnIcone}
          />

          <Text style={styles.btnTexto}>|</Text>

          <Text style={styles.btnTexto}>Entre com sua conta do Google </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },

  btnLogin: {
    backgroundColor: '#343434',
    width: '100%',
    height: 55,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 45
  },

  btnTexto: {
    color: '#fff',
    fontSize: 16,
  }

});