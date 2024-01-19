import {FlatList, Text, View} from 'react-native';
import {Nota} from './Nota';
import * as SQLite from 'expo-sqlite';
import {useState, useEffect} from 'react';
import { BotaoDeAdicionarFlutuante } from '../StyledComponents';
import { INota } from '../types/INota';



const db = SQLite.openDatabase('notas.db');

export function Home() {

  const [notas, setNotas] = useState<INota[]>();

 function criarOuInicializarTabela() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT, cor TEXT)',

      [],
      (_, resultado) => {
        console.log('Tabela criada com sucesso ou já existia.');
      },

      (_, erro) => {
        console.error('Erro ao criar a tabela:', erro);
        return true;
      },
    );
  });
 }

  function obterTodosOsDados() {    

      console.log('function obterTodosOsDados executada');
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM notas', [], async (_, resultado) => {
        setNotas(resultado.rows._array);
        console.log('resultado ' + resultado.rows._array.length)
        console.log('notas ' + notas?.length)
      });
    });


  }

  function novaNota() {
    console.log('function novaNota executada');
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO notas (texto, cor) VALUES (?, ?)',
        [' ', 'white'],
        (_, resultado) => {
          console.log('Nota inserida com sucesso!');
          obterTodosOsDados()
        },
        (_, erro) => {
          console.error('Erro ao inserir nota:', erro);
        },
      );
    });
    
  }

  useEffect(() => {
    console.log('useEffect executado');
    criarOuInicializarTabela()
    obterTodosOsDados();
  }, []);





  return (
    <>

    <FlatList data={notas} renderItem={({item, index}) => <Nota key={index} nota={item} />}/>   
        <View style={{minHeight: 10}}></View>   
      <BotaoDeAdicionarFlutuante onPress={() => novaNota()}>
        <Text style={{color: 'white', fontSize: 30}}>+</Text>
      </BotaoDeAdicionarFlutuante>
    </>
  );
}
