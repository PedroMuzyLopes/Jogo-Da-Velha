import React, { useEffect } from 'react';
import {MaterialCommunityIcons as Icon } from 'react-native-vector-icons';
import {ImageBackground, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, Alert, StatusBar, BackHandler } from 'react-native';
import firebase from 'firebase';

import config from '../../config';

export default class Jogo extends React.Component {


  constructor(props) {

    super(props);

    this.state = {
      tabuleiro: [
        [],
        [],
        [],
      ],

      player: 1,
      pontos_player1: 0,
      pontos_player2: 0,
      rodada: 1,
      localPlayer : 0,
      nome_player1: '',
      nome_player2: '',
      jogadores: 0,
    }

    firebase.database().ref('game').on('value', (data) => {
      this.setState({jogadores: data.val().jogadores});
    })

    


    firebase.database().ref('game').update(
      {
        J1: 0,
        J2: 0,
        J3: 0,
        J4: 0,
        J5: 0,
        J6: 0,
        J7: 0,
        J8: 0,
        J9: 0,
        player: 1,
        pontos_player1: 0,
        pontos_player2: 0,
        rodada: 1,
        ultimo_ganhador: 0,
        
      });

      // BUSCA OS DADOS TODAS A VEZ QUE O BANCO É MODIFICADO
      firebase.database().ref('game').on('value', (data) => {

        this.setState({tabuleiro:
          [
            [data.val().J1, data.val().J2, data.val().J3],
            [data.val().J4, data.val().J5, data.val().J6],
            [data.val().J7, data.val().J8, data.val().J9],
          ],
    
          jogadores: data.val().jogadores,
          player: data.val().player,
          pontos_player1: data.val().pontos_player1,
          pontos_player2: data.val().pontos_player2,
          nome_player1: data.val().nome_player1,
          nome_player2: data.val().nome_player2,
          rodada: data.val().rodada,
        });
      
      })


      
  }

  atualizaStates() {



    if (this.state.player != 0) {
       firebase.database().ref('game').on('value', (data) => 
           {
            this.setState({tabuleiro:
              [
                [data.val().J1, data.val().J2, data.val().J3],
                [data.val().J4, data.val().J5, data.val().J6],
                [data.val().J7, data.val().J8, data.val().J9],
              ],
        
              jogadores: data.val().jogadores,
              player: data.val().player,
              pontos_player1: data.val().pontos_player1,
              pontos_player2: data.val().pontos_player2,
              rodada: data.val().rodada,
              nome_player1: data.val().nome_player1,
              nome_player2: data.val().nome_player2,
            });
          })
     }

     
  }

  onSessionDataChanged(data) {
    // No-op by default.
  }


  componentDidMount() {



    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    firebase.database().ref('game').on('value', (data) => {

      
      if(data.val().jogadores==0 && this.state.localPlayer ==0){

        console.log('CHAMOOOOOOOOOOOOU');

        this.setState({localPlayer: 1, nome_player1: firebase.auth().currentUser.displayName});

        firebase.database().ref('game').update(
          {
            jogadores: 1,
            nome_player1: this.state.nome_player1
          })
        

      }else if(this.state.localPlayer==0 && data.val().jogadores !=0){
        console.log('CHAMOOOOOOOOOOOOU2');
        this.setState({localPlayer: -1, nome_player2: firebase.auth().currentUser.displayName});
        firebase.database().ref('game').update(
          {
            jogadores: 2,
            nome_player2: this.state.nome_player2
          })
        
      }
    })

    
  }

  insereDados = (campo) => {

    firebase.database().ref('game').on('value', (data) => 
        {
          //data.val().+[campo];    
        }
    )
  }

  insertdata = (campo, valor) => {

    firebase.database().ref('game').update(
        {
          ['J'+campo] : valor,     
        }
    )
       
    if (this.state.player == 1) {

      firebase.database().ref('game').update(
        {
          player: -1
        })
    } else {
      firebase.database().ref('game').update(
        {
          player: 1
        })
    }


      //this.setState({player: this.state.player * -1});

  }

  

  resetgame = () => {




    firebase.database().ref('game').update(
      {
        J1: 0,
        J2: 0,
        J3: 0,
        J4: 0,
        J5: 0,
        J6: 0,
        J7: 0,
        J8: 0,
        J9: 0,
        player: 1                          
      }
    );

    this.atualizaStates();

  }
  
  

  // Esvazia todas as casas do tabuleiro
  iniciarPartida = () => {

    console.log(" Inicia P1: "+this.state.pontos_player1 + " P2:"+this.state.pontos_player2);
    this.atualizaStates();

    this.acabaRound();

    this.resetgame();


  }

  showAlerts = () =>{

      var vi = this.vitoria();

      if(vi==1){
        Alert.alert("Jogador 1 venceu!");
      }else if(vi==-1){
        Alert.alert("Jogador 2 venceu!");
      }else if(vi == 3){
        Alert.alert("Deu veia");
      }
      


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
    var zero=1;

    for(var i =0; i< 3; i++){
      for(var x=0; x< 3; x++){
        if(tabuleiro[i][x]==0){
          zero=0;
        }
      }

    }

    if(zero!=0){
      return 3;
    }

  }


  acabaRound = () => {


    if (this.state.rodada > 3){

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

      firebase.database().ref('game').update(
        {
          rodada: 0,
          pontos_player2: 0,
          pontos_player1: 0,
        }
      )

      this.resetgame();

    } 
  }

    

    async jogada (linha, coluna) {

    // Verifica se a casa já foi escolhida
    if(this.state.localPlayer == this.state.player){
    var casa = this.state.tabuleiro[linha][coluna];
    if (casa !== 0) { return; } 

    // Conta o número de jogadas
    


   
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

    // Verifica vitoria
    var vencedor = this.vitoria();
    
    firebase.database().ref('game').update(
      {
        ultimo_ganhador: this.vitoria()
      })

    if (vencedor == 1) {
        let x =this.state.pontos_player1;
        x=x+1;
        
        let y = Number(this.state.rodada);
        y=y+1;

    

    const AsyncAlert = async () => new Promise((resolve) => {
      Alert.alert('Resultado','Player 1 venceu esse round!',[{text: 'Continuar', onPress: () => {this.setState({pontos_player1: x, rodada: y}); resolve('YES')}},],
      { cancelable: false },);
    });

    await AsyncAlert();

    firebase.database().ref('game').update(
      {
        pontos_player1: this.state.pontos_player1,
        rodada: this.state.rodada,
      })

    this.iniciarPartida();  

      
    } else if (vencedor == -1) {

      let x = this.state.pontos_player2;
        x=x+1;

        let y = Number(this.state.rodada);
        y=y+1;

        
        const AsyncAlert = async () => new Promise((resolve) => {
          Alert.alert('Resultado','Player 2 venceu esse round!',[{text: 'Continuar', onPress: () => {this.setState({pontos_player2: x, rodada: y}); resolve('YES')}},],
          { cancelable: false },
          );
          });
          await AsyncAlert();
      
          firebase.database().ref('game').update(
            {
              pontos_player2: this.state.pontos_player2,
              rodada: this.state.rodada,
            })

          this.iniciarPartida(); 

    } else if (vencedor == 3) {
      let y = Number(this.state.rodada);
        y=y+1;
        
      this.setState({rodada: y});


      Alert.alert('Resultado','Ih, deu velha!',[{text: 'Continuar'}],
      { cancelable: false },
      );

      firebase.database().ref('game').update(
        {
          rodada: this.state.rodada
        })

      this.iniciarPartida();
      
      
    }
    
    
  }else{

     
/*
      firebase.database().ref('game').on('value', (data) => {
        this.setState({ultimo_ganhador: data.val().ultimo_ganhador});
      })

       ///inicio
       var vencedor = this.state.ultimo_ganhador;
    

       if (vencedor == 1) {
           let x =this.state.pontos_player1;
         
           
           let y = Number(this.state.rodada);
         
       
   
       const AsyncAlert = async () => new Promise((resolve) => {
         Alert.alert('Resultado','Player 1 venceu esse round!',[{text: 'Continuar', onPress: () => {this.setState({pontos_player1: x, rodada: y}); resolve('YES')}},],
         { cancelable: false },);
       });
   
       await AsyncAlert();
   
      
     
   
         
       } else if (vencedor == -1) {
   
         let x = this.state.pontos_player2;
           
   
           let y = Number(this.state.rodada);
           
   
           
           const AsyncAlert = async () => new Promise((resolve) => {
             Alert.alert('Resultado','Player 2 venceu esse round!',[{text: 'Continuar', onPress: () => {this.setState({pontos_player2: x, rodada: y}); resolve('YES')}},],
             { cancelable: false },
             );
             });
             await AsyncAlert();
         
        
   
       } else if (vencedor == 3) {
         let y = Number(this.state.rodada);
           
   
   
         Alert.alert('Resultado','Ih, deu velha!',[{text: 'Continuar'}],
         { cancelable: false },
         );
   
         
         
         
       }
 
 
       //fim

*/


       this.atualizaStates();
      this.acabaRound();


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
            {this.state.nome_player1}
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
              {this.state.nome_player2}
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