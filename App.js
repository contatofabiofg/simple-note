import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home} from './src/pages/Home';
import {Configuracoes} from './src/pages/Configuracoes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeBaseProvider} from 'native-base';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Notas"
              component={Home}
              options={{
                tabBarLabel: 'Notas',
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons
                    name="home"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Configurações"
              component={Configuracoes}
              options={{
                tabBarLabel: 'Configurações',
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons
                    name="cog"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
