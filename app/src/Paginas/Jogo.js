import React from 'react';
import {MaterialCommunityIcons as Icon } from 'react-native-vector-icons';
import {ImageBackground, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, Alert, StatusBar } from 'react-native';
import firebase from 'firebase';

export default class Jogo extends React.Component {

  constructor(props) {

    super(props);

    // Inicia o tabuleiro
    this.state = {
      tabuleiro: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],

      player: 1,
      pontos_player1: 0,
      pontos_player2: 0,
      rodada: 1,
      numero_jogadas: 0,
    }
  }

  resetgame = () => {

    //CONFIGURAÇÕES DO BANCO
    var config = {
      apiKey: "AIzaSyBVg5RDq_Ftl2Am0Eae8UZietPKWHHoA6E",
      authDomain: "jogo-da-velha-40552.firebaseapp.com",
      databaseURL: "https://jogo-da-velha-40552.firebaseio.com",
      projectId: "jogo-da-velha-40552",
      storageBucket: "jogo-da-velha-40552.appspot.com",
      messagingSenderId: "455848204596",
      appId: "1:455848204596:web:3c15b887a5c8642bdd6d61",
      measurementId: "G-7YKBRSS9LQ"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    // BUSCA OS DADOS TODAS A VEZ QUE O BANCO É MODIFICADO
    firebase.database().ref('game').on('value', (data) => {
        console.log(data.toJSON());
    })

    // ESPERAR 5 SEGUNDOS PARA INSERIR O PROXIMO DADO
    setTimeout(() => {
        firebase.database().ref('game').update(
            {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0                                
            }
        ).then(() => {
            console.log('INSERTED !');
        }).catch((error) => {
            console.log(error);
        });
    }, 5000);

}
  

  insertdata = (posicao,player) => {

    //CONFIGURAÇÕES DO BANCO
    var config = {
      apiKey: "AIzaSyBVg5RDq_Ftl2Am0Eae8UZietPKWHHoA6E",
      authDomain: "jogo-da-velha-40552.firebaseapp.com",
      databaseURL: "https://jogo-da-velha-40552.firebaseio.com",
      projectId: "jogo-da-velha-40552",
      storageBucket: "jogo-da-velha-40552.appspot.com",
      messagingSenderId: "455848204596",
      appId: "1:455848204596:web:3c15b887a5c8642bdd6d61",
      measurementId: "G-7YKBRSS9LQ"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    // BUSCA OS DADOS TODAS A VEZ QUE O BANCO É MODIFICADO
    firebase.database().ref('game').on('value', (data) => {
        console.log(data.toJSON());
    })

    // ESPERAR 5 SEGUNDOS PARA INSERIR O PROXIMO DADO
    setTimeout(() => {
        firebase.database().ref('game').update(
            {

              [posicao]: player           
            }
        ).then(() => {
            console.log('INSERTED !');
        }).catch((error) => {
            console.log(error);
        });
    }, 5000);


    // Para Atualizar o banco

    /*
    firebase.database().ref('game/004').update({
        name: 'Pheng Sengvuthy'
    });
    */

    // para apagar o banco
    /*
    firebase.database().ref('game/004').remove();
    */

}
  

  // Esvazia todas as casas do tabuleiro
  iniciarPartida = () => {

    console.log(" Inicia P1: "+this.state.pontos_player1 + " P2:"+this.state.pontos_player2);

    this.acabaRound();

    this.setState({tabuleiro:
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],

      player: 1,
      numero_jogadas: 0,
    });


  }

  // Define qual ícone será mostrado
  mostraIcone = (linha, coluna) => {
    var icone = this.state.tabuleiro[linha][coluna];
    switch(icone) {
      case 1: return <View style={styles.casa_player1}><Icon name="close" style={styles.casa_player1_simbolo}/></View>;
      case -1: return <View style={styles.casa_player2}><Icon name="circle-outline" style={styles.casa_player2_simbolo}/></View>;
      default: return <View />;
    }
  }

  // Verifica vitória
  vitoria = () => {

    var soma;
    var tabuleiro = this.state.tabuleiro;

    // Percorre todas as linhas
    for (var i = 0; i < 3; i++) {
      soma = tabuleiro[i][0] + tabuleiro[i][1] + tabuleiro[i][2];
    
      if (soma == 3) {return  1;}
      else if (soma == -3) {return -1;}
    }

    // Percorre todas as colunas
    for(var i =0; i < 3; i++) {
      soma = tabuleiro[0][i] + tabuleiro[1][i] + tabuleiro[2][i];

      if (soma == 3) {return 1;}
      else if (soma == -3) {return -1;}
    }

    // Diagonais
    soma = tabuleiro[0][0] + tabuleiro[1][1] + tabuleiro[2][2];
    if (soma == 3) {return 1;}
    else if (soma == -3) {return -1;}

    soma = tabuleiro[2][0] + tabuleiro[1][1] + tabuleiro[0][2];
    if (soma == 3) {return 1;}
    else if (soma == -3) {return -1;}

    // Velha
    return 0;
  }

  acabaRound = () => {
    if (this.state.rodada >= 4){


      console.log("Rodada: " + this.state.rodada.toString() + "Valor final partida P1: "+ this.state.pontos_player1.toString() + " Valor final partida P2: "+ this.state.pontos_player2.toString());


      if (this.state.pontos_player1 > this.state.pontos_player2) {
        Alert.alert('Fim de jogo!','Vitória do jogador 1');
      } 
      else if (this.state.pontos_player2 > this.state.pontos_player1) {
        Alert.alert('Fim de jogo!','Vitória do jogador 2');
      }
      else if (this.state.pontos_player1 == this.state.pontos_player2) {
        
        Alert.alert('Fim de jogo!','A partida empatou');
      }

      this.setState({rodada: 1, pontos_player1:0, pontos_player2:0 });

    } 
  }

    

    async jogada (linha, coluna) {

    // Verifica se a casa já foi escolhida
    var casa = this.state.tabuleiro[linha][coluna];
    if (casa !== 0) { return; } 

    // Conta o número de jogadas
    var n_jogadas = Number(this.state.numero_jogadas);
    n_jogadas++;
    this.setState({numero_jogadas: n_jogadas});
    console.log("N_jogadas:"+n_jogadas +" P1: "+this.state.pontos_player1 + " P2:"+this.state.pontos_player2);
    // Pega o player atual
    var player = this.state.player;

    // Registra a jogada
    var jogada = this.state.tabuleiro.slice();
    jogada[linha][coluna] = player;
    this.setState({tabuleiro: jogada});

     //BANCO INSERÇÃO
     if(linha == "0" && coluna == "0"){
      var posicao = 1;
      this.insertdata(posicao,player);
    }else if(linha == "0" && coluna == "1"){
      var posicao = 2;
      this.insertdata(posicao,player);
    }else if(linha == "0" && coluna == "2"){
      var posicao = 3;
      this.insertdata(posicao,player);
    }else if(linha == "1" && coluna == "0"){
      var posicao = 4;
      this.insertdata(posicao,player);
    }else if(linha == "1" && coluna == "1"){
      var posicao = 5;
      this.insertdata(posicao,player);
    }else if(linha == "1" && coluna == "2"){
      var posicao = 6;
      this.insertdata(posicao,player);
    }else if(linha == "2" && coluna == "0"){
      var posicao = 7;
      this.insertdata(posicao,player);
    }else if(linha == "2" && coluna == "1"){
      var posicao = 8;
      this.insertdata(posicao,player);
    }else if(linha == "2" && coluna == "2"){
      var posicao = 9;
      this.insertdata(posicao,player);
    }

    // Troca o player
    this.setState({player: this.state.player * -1});

    // Verifica vitoria
    var vencedor = this.vitoria();
    

    if (vencedor == 1) {
        let x =this.state.pontos_player1;
        x=x+1;
        
        let y = Number(this.state.rodada);
        y=y+1;

    

    const AsyncAlert = async () => new Promise((resolve) => {
      Alert.alert('Resultado','Player 1 venceu esse round!',[{text: 'Continuar', onPress: () => {this.setState({pontos_player1: x, rodada: y}); resolve('YES')}},],
      { cancelable: false },
    );
    });
    await AsyncAlert();

    this.resetgame();
    this.iniciarPartida();  

      
    } else if (vencedor == -1) {

      let x = this.state.pontos_player2;
        x=x+1;

        let y = Number(this.state.rodada);
        y=y+1;

        this.deletedata();
        const AsyncAlert = async () => new Promise((resolve) => {
          Alert.alert('Resultado','Player 2 venceu esse round!',[{text: 'Continuar', onPress: () => {this.setState({pontos_player2: x, rodada: y}); resolve('YES')}},],
          { cancelable: false },
          );
          });
          await AsyncAlert();
      
          
          this.iniciarPartida(); 

    } else if (n_jogadas == 9 && vencedor == 0) {
      let y = Number(this.state.rodada);
        y=y+1;
        
      this.setState({rodada: y});


      Alert.alert('Resultado','Ih, deu velha!',[{text: 'Continuar'}],
      { cancelable: false },
      );


      this.iniciarPartida();
      
      
    }
    
    
  }
  
  render() {
    return (
      <SafeAreaView style={{flex:1}}>

        <StatusBar backgroundColor="#3a2c69" barStyle="light-content" ></StatusBar>

        <ImageBackground
          source={require('../../src/imgs/x.png')}
          style={styles.header}
          resizeMode="cover"
        >
          <View style={styles.pontuacao_1}>
            <Text style={styles.pontuacao_n}>
              {this.state.pontos_player1}
            </Text>
          </View>

        <View style={styles.nome_player1_input}>
          <Text style={styles.nome_player1_text}>
            {firebase.auth().currentUser.displayName}
          </Text>
        </View>

          <TouchableOpacity 
            onPress={() => firebase.auth().signOut()}
            styles={styles.sair}
          >
            <Text>SAIR</Text>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.espaco}>

          <View style={styles.tabuleiro}>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(0, 0)} >
              {this.mostraIcone(0, 0)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(0, 1)} >
              {this.mostraIcone(0, 1)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(0, 2)} >
              {this.mostraIcone(0, 2)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(1, 0)} >
              {this.mostraIcone(1, 0)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(1, 1)} >
              {this.mostraIcone(1, 1)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(1, 2)} >
              {this.mostraIcone(1, 2)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(2, 0)} >
              {this.mostraIcone(2, 0)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(2, 1)} >
              {this.mostraIcone(2, 1)}
            </TouchableOpacity>

            <TouchableOpacity style={styles.casa} onPress={() => this.jogada(2, 2)} >
              {this.mostraIcone(2, 2)}
            </TouchableOpacity>
            
          </View>
        </View>

        <ImageBackground
          source={require('../../src/imgs/o.png')}
          style={styles.footer}
          resizeMode="cover"
        >
          <View style={styles.nome_player2_input}>
            <Text style={styles.nome_player2_text}>
              Jogador 2
            </Text>
          </View>

        <View style={styles.pontuacao_2}>
          <Text style={styles.pontuacao_n}>
            {this.state.pontos_player2}
          </Text>
        </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  sair: {
    marginTop: 50
  },

  espaco: {
    flex: 1,
    justifyContent: 'center',
  },

  tabuleiro: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  casa: {
    width:105,
    height: 105,
    margin: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },

  casa_player1: {
    width: '100%',
    height: '100%',
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

  pontuacao_1: {
    flex: 1,
    maxHeight: 55,
    maxWidth: 55,
    backgroundColor: '#343434',
    marginLeft: 20,
    marginTop: 28,
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  nome_player1_input: {
    flex: 1,
    maxWidth: 160,
    maxHeight: 55,
    backgroundColor:"#fff",
    marginTop: 28,
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

  casa_player2: {
    width: '100%',
    height: '100%',
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

  pontuacao_2: {
    flex: 1,
    maxHeight: 55,
    maxWidth: 55,
    backgroundColor: '#343434',
    marginTop: 28,
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
    marginTop: 28,
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

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  header: {
    backgroundColor: '#7159c1',
    height: 110,
    flexDirection:"row",
  },

  footer: {
    backgroundColor: '#6f6f6f',
    flexDirection:'row',
    justifyContent: "flex-end",
    height: 110
  }

});
