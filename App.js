import * as React from 'react';
import {Button, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Recipes from './src/Pages/Recipes';
import Bag from './src/Pages/Bag';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Bag">
        <Drawer.Screen name="Bag" component={Bag} />
        <Drawer.Screen
          name="Weapon"
          component={Recipes}
          initialParams={{title: 'Weapon'}}
        />
        <Drawer.Screen
          name="Armour/Clothing"
          component={Recipes}
          initialParams={{title: 'Armour/Clothing'}}
        />
        <Drawer.Screen
          name="Shields"
          component={Recipes}
          initialParams={{title: 'Shields'}}
        />
        <Drawer.Screen
          name="Headgear"
          component={Recipes}
          initialParams={{title: 'Headgear'}}
        />
        <Drawer.Screen
          name="Accessory"
          component={Recipes}
          initialParams={{title: 'Accessory'}}
        />
        <Drawer.Screen
          name="Cheese"
          component={Recipes}
          initialParams={{title: 'Cheese'}}
        />
        <Drawer.Screen
          name="Medicine"
          component={Recipes}
          initialParams={{title: 'Medicine'}}
        />
        <Drawer.Screen
          name="Other objects"
          component={Recipes}
          initialParams={{title: 'Other objects'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
