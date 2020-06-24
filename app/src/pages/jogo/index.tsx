import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, StatusBar } from 'react-native';

const Jogo = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

      <ImageBackground
        source={require('../../imgs/x.png')}
        style={styles.player1}
        resizeMode="cover"
      >

        <View style={styles.pontuacao_1}>
          <Text style={styles.pontuacao_n}>
            2
          </Text>
        </View>

        <View style={styles.nome_player1_input}>
          <Text style={styles.nome_player1_text}>
            Genji
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.casas}>
        <View style={styles.casa_vazia}></View>
        <View style={styles.casa_vazia}></View>
        <View style={styles.casa_player2}>
          <Text style={styles.casa_player2_simbolo}>
            O
          </Text>
        </View>
        <View style={styles.casa_vazia}></View>
        <View style={styles.casa_player1}>
          <Text style={styles.casa_player1_simbolo}>
            X
          </Text>
        </View>
        <View style={styles.casa_vazia}></View>
        <View style={styles.casa_vazia}></View>
        <View style={styles.casa_vazia}></View>
        <View style={styles.casa_vazia}></View>
      </View>

      <ImageBackground
        source={require('../../imgs/o.png')}
        style={styles.player2}
        resizeMode="cover"
      >

        <View style={styles.nome_player2_input}>
          <Text style={styles.nome_player2_text}>
            Hanzo
          </Text>
        </View>

        <View style={styles.pontuacao_2}>
          <Text style={styles.pontuacao_n}>
            1
          </Text>
        </View>

      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  player1: {
    flex: 1,
    backgroundColor: '#7159c1',
    maxHeight: '21.3%',
    marginTop:24,
    flexDirection:"row",
  },

  pontuacao_1: {
    flex: 1,
    maxHeight: 55,
    maxWidth: 55,
    backgroundColor: '#343434',
    marginLeft: 20,
    marginTop: '11%',
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  nome_player1_input: {
    flex: 1,
    maxWidth: 160,
    maxHeight: 55,
    backgroundColor:"#fff",
    marginTop: '11%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  nome_player1_text: {
    flex:1,
    textAlignVertical: "center",
    color: '#6c6c6c',
    fontSize: 14,
    paddingLeft: 10
  },

  pontuacao_n: {
    flex:1,
    textAlignVertical: "center",
    color: '#fff',
    fontWeight: "bold",
    fontSize: 20
  },

  casas: {
    flex:1,
    maxWidth: "89%",
    maxHeight: "50%",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    //backgroundColor: "#ff0000",
    marginLeft:20,
    marginTop:14,
  },

  casa_vazia: {
    width:95,
    height: 95,
    margin: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  casa_player1: {
    width:95,
    margin:4,
    height: 95,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#a29bba",
    backgroundColor: "#cac1ea",
  },

  casa_player1_simbolo: {
    color: "#7d7891",
    fontWeight: "900",
    fontSize: 50
  },

  casa_player2: {
    width:95,
    margin:4,
    height: 95,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c6c6c6",
    backgroundColor: "#dfdfdf",
  },

  casa_player2_simbolo: {
    color: "#9b9b9b",
    fontWeight: "900",
    fontSize: 50
  },

  player2: {
    flex: 1,
    backgroundColor: '#6f6f6f',
    maxHeight: '21.3%',
    marginTop:24,
    flexDirection:"row",
    justifyContent: "flex-end",
},

  pontuacao_2: {
    flex: 1,
    maxHeight: 55,
    maxWidth: 55,
    backgroundColor: '#343434',
    marginTop: '11%',
    marginRight: 22,
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  nome_player2_input: {
    flex: 1,
    maxWidth: 160,
    maxHeight: 55,
    backgroundColor:"#fff",
    marginTop: '11%',
    paddingRight: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: "flex-end"
  },

  nome_player2_text: {
    flex:1,
    textAlignVertical: "center",
    color: '#6c6c6c',
    fontSize: 14,
  },
});

export default Jogo;