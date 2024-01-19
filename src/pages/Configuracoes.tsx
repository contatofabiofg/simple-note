import {View, Text} from 'react-native';

import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export function Configuracoes() {
  return (
    <View
      style={{
        width,
        margin: 'auto',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{textAlign: 'center', width: '80%', margin: 'auto'}}>
        Ainda não tem configurações, mas obrigado por clicar! Deus te abençoe!
      </Text>
    </View>
  );
}
