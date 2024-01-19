import {
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Container, Input, Note} from '../StyledComponents';
import {
  GestureDetector,
  Gesture,
  PanGestureHandler,
  TextInput,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {PanGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import {useState, useRef} from 'react';
import * as SQLite from 'expo-sqlite';
import {Popover} from 'native-base';
import { INota } from '../types/INota';

const db = SQLite.openDatabase('notas.db');

export function Nota({nota}: {nota: INota}) {
  const [editarTexto, setEditarTexto] = useState(false);
  const [texto, setTexto] = useState(nota.texto || '');
  const inputRef = useRef<React.RefObject<TextInput>>();
  const translateX = useSharedValue(0);
  const tamanhoDoElemento = useSharedValue(80);
  const {width: larguraDaTela} = Dimensions.get('window');
  const limitePraApagar = -larguraDaTela * 0.2;
  const [id] = useState(nota.id || undefined);
  const [cor, setCor] = useState(nota.cor || 'white');
  const [showPopover, setShowPopover] = useState(false);

  const movendoParaOLado =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onActive: event => {
        translateX.value = event.translationX;
      },
      onEnd: () => {
        if (translateX.value < limitePraApagar) {
          translateX.value = withTiming(-larguraDaTela);
          tamanhoDoElemento.value = withTiming(0);
          runOnJS(apagarNota)();
        } else {
          translateX.value = withTiming(0);
        }
      },
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const efeitosDoApagar = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < limitePraApagar ? 1 : 0);
    return {opacity};
  });

  const efeitoDoElemento = useAnimatedStyle(() => {
    return {
      height: tamanhoDoElemento.value,
    };
  });

  function salvar(corSelecionada?: string) {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE notas SET texto = ?, cor = ? WHERE id = ?',
        [texto, corSelecionada? corSelecionada : cor, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log(`Nota com ID ${id} atualizada com sucesso.`);
          } else {
            console.error(`Houve algum erro ao atualizar essa nota.`);
          }
        },
        (_, resultado) => {
          console.log('Nota editada com sucesso!');
        },
        (_, error) => {
          console.error(`Erro ao atualizar nota: ${error}`);
        },
      );
    });
  }

  function apagarNota() {
    //translateX.value = withTiming(-larguraDaTela);
    //tamanhoDoElemento.value = withTiming(0);
    if (id) {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM notas WHERE id = ?',
          [id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log(`Nota com ID ${id} deletada com sucesso.`);
         
            } else {
              console.error(`Houve algum erro ao deletar essa nota.`);
            }
          },
          (_, resultado) => {
            console.log('Nota deletada com sucesso!');
           
          },
          (_, error) => {
            console.error(`Erro ao deletar nota: ${error}`);
          },
        );
      });
    }
  }

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    tamanhoDoElemento.value = withTiming(height + 22);
  };

  function editar() {
    setEditarTexto(true);
    setTimeout(() => {
      inputRef.current ? inputRef.current.focus() : null;
    }, 500);
  }

  function trocarCor() {
    console.log('chegou no trocar cor');
    setShowPopover(true);
    
  }

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(editar)();
  });

  const longPress = Gesture.LongPress()
    .minDuration(350)
    .onStart(() => {
      runOnJS(trocarCor)();
    });

  const clicarOuSegurar = Gesture.Race(tap, longPress);

  return (
    <Popover
      isOpen={showPopover}
      onClose={() => setShowPopover(false)}
      trigger={triggerProps => {
        return (
          <Animated.View
            {...triggerProps}
            style={[
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: tamanhoDoElemento,
              },
              efeitoDoElemento,
            ]}>
            <Container>
              <Animated.View style={[efeitosDoApagar]}>
                <Text
                  style={{
                    color: 'red',
                    position: 'absolute',
                    right: 10,
                    top: 20,
                  }}>
                  apagar
                </Text>
              </Animated.View>
              <PanGestureHandler
                onGestureEvent={movendoParaOLado}
                activeOffsetX={[-40, 40]}>
                <Animated.View style={[rStyle]}>
                  <GestureDetector gesture={clicarOuSegurar}>
                    <Note onLayout={onLayout} style={{backgroundColor: cor}}>
                      {editarTexto && (
                        <Input
                          ref={inputRef}
                          value={texto}
                          style={{width: '90%', fontSize: 18}}
                          multiline
                          onBlur={() => {
                            setEditarTexto(false);
                            salvar();
                          }}
                          onSubmitEditing={() => {
                            salvar();
                            setEditarTexto(false);
                          }}
                          onChangeText={(e: string) => setTexto(e)}></Input>
                      )}
                      {!editarTexto && (
                        <Text style={{fontSize: 18, textAlign: 'center'}}>
                          {texto != ' ' ? (
                            texto
                          ) : (
                            <Text style={{color: '#cccccc', fontSize: 12}}>
                              CLIQUE PARA INSERIR UM NOVO TEXTO
                            </Text>
                          )}
                        </Text>
                      )}
                    </Note>
                  </GestureDetector>
                </Animated.View>
              </PanGestureHandler>
            </Container>
          </Animated.View>
        );
      }}>
      <Popover.Content>
        <Popover.Arrow />

        <Popover.Body
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: 35,
              height: 35,
              borderWidth: 1,
              borderColor: '#cccccc',
              borderRadius: 20,
            }}
            onPress={() => {
              setShowPopover(false);
              setCor('white');
           
               salvar('white');
        
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#defce2',
              width: 35,
              height: 35,
              borderWidth: 1,
              borderColor: '#cccccc',
              borderRadius: 20,
            }}
            onPress={() => {
              setShowPopover(false);
              setCor('#defce2');
          
                salvar('#defce2');
           
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffedee',
              width: 35,
              height: 35,
              borderWidth: 1,
              borderColor: '#cccccc',
              borderRadius: 20,
            }}
            onPress={() => {
              setShowPopover(false);
              setCor('#ffedee');
           
                salvar('#ffedee');
        
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#fcfcde',
              width: 35,
              height: 35,
              borderColor: '#cccccc',
              borderWidth: 1,
              borderRadius: 20,
            }}
            onPress={() => {
              setShowPopover(false);
              setCor('#fcfcde');
        
                salvar('#fcfcde');
         
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#dee1fc',
              width: 35,
              height: 35,
              borderWidth: 1,
              borderColor: '#cccccc',
              borderRadius: 20,
            }}
            onPress={() => {
              setShowPopover(false);
              setCor('#dee1fc');
         
                salvar('#dee1fc');
        
            }}></TouchableOpacity>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  );
}
