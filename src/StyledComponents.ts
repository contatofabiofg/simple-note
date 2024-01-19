import styled from 'styled-components/native';

import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const larguraDaTela = width;

export const BotaoDeAdicionarFlutuante = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px auto;
  color: white;
  background-color: #232935;
  border-radius: 70px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 50;
`;

export const FlexCenter = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexView = styled.View`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;


export const Input = styled.TextInput`
  background-color: white;
  margin: 5px 0px;
  min-height: 18px;
  width: 100%;
  border-radius: 3px;
  text-align: center;
  background: transparent;
`;

export const Container = styled.ScrollView`
  width: ${larguraDaTela - 20}px;
  padding: 15px;
`;

export const Note = styled.View`
  width: 100%;
  height: fit-content;
  padding: 15px;

  border: 1px solid #cccccc;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
`;
