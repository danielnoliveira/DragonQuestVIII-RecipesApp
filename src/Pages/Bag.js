import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
const data = require('./../data/RecipesDragonQuestVIII.json');

const getPossibleCrafts = (inventory = []) => {
  const weapons = data.Weapon;
  const acessorys = data.Accessory;
  const medicine = data.Medicine;
  const shilders = data.Shields;
  const cheese = data.Cheese;
  const headgears = data.Headgear;
  const others = data['Other objects'];
  const armour = data['Armour/Clothing'];
  const all = [
    ...weapons,
    ...acessorys,
    ...medicine,
    ...shilders,
    ...cheese,
    ...headgears,
    ...others,
    ...armour,
  ];
  const possibleCrafts = [];
  var bag = inventory.map(p => p.name);
  for (var item of all) {
    let i = 0;
    for (var r of item.recipe) {
      bag.includes(r) && i++;
    }
    i === item.recipe.length && possibleCrafts.push(item);
  }
  return possibleCrafts;
};

const allItems = require('./../data/ingredientsRecipesDragonQuestVIII.json').map(
  m => {
    return {name: m};
  },
);
const storeData = async value => {
  try {
    var jsonValue = await AsyncStorage.getItem('@inventory');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : [];
    await AsyncStorage.setItem(
      '@inventory',
      JSON.stringify([...jsonValue, ...value]),
    );
  } catch (e) {
    // saving error
  }
};
const clearData = async () => {
  await AsyncStorage.removeItem('@inventory');
};

const getData = async () => {
  try {
    var jsonValue = await AsyncStorage.getItem('@inventory');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    return jsonValue;
  } catch (e) {
    // error reading value
  }
};

const {width, height} = Dimensions.get('window');

const Bag = ({navigation, route}) => {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const getInventory = async () => {
      const auxInventory = await getData();
      auxInventory !== null && setInventory(auxInventory);
    };
    getInventory();
  }, []);

  return (
    <View style={styles.container}>
      <SearchableDropdown
        multi={false}
        selectedItems={items}
        onItemSelect={item => {
          const itemsNovos = items;
          itemsNovos.push(item);
          setItems([...itemsNovos]);
        }}
        containerStyle={{padding: 5, width: width * 0.83}}
        onRemoveItem={item => {
          const itemsNovos = items.filter(sitem => sitem !== item);
          setItems(itemsNovos);
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{color: '#222'}}
        itemsContainerStyle={{maxHeight: 140}}
        items={allItems}
        defaultIndex={0}
        chip={true}
        resetValue={true}
        textInputProps={{
          placeholder: 'Add Item',
          underlineColorAndroid: 'transparent',
          style: {
            padding: 12,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 5,
            color: 'black',
          },
          placeholderTextColor: '#c9c9c9',
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <View
        style={{
          width: width * 0.83,
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: width * 0.085,
        }}>
        {items.map((i, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemsSelected}
              onPress={e => {
                const itemsNovos = items.filter((p, ix) => ix !== index);
                setItems([...itemsNovos]);
              }}>
              <Text style={styles.itemsSelectedText}>{i.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={async e => {
          await storeData(items);
          setInventory([...inventory, ...items]);
          setItems([]);
        }}
        style={styles.specialButton}>
        <Text>Add to inventory</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async e => {
          clearData();
          setInventory([]);
        }}
        style={styles.specialButton}>
        <Text>Clear inventory</Text>
      </TouchableOpacity>
      <ScrollView
        style={{marginTop: 20, paddingBottom: 100}}
        contentContainerStyle={{paddingBottom: 100}}>
        <Text style={styles.headerText}>Your Inventory</Text>
        <View style={styles.inventoryContainer}>
          {inventory.map((m, index) => {
            return (
              <TouchableOpacity
                style={styles.cardItem}
                key={index}
                onPress={() => {
                  Alert.alert(
                    m.name,
                    'Do you want remove this item?',
                    [
                      {
                        text: 'Yes',
                        onPress: () => {
                          const inventoryNovos = inventory.filter(
                            (it, ix) => ix !== index,
                          );
                          setInventory([...inventoryNovos]);
                          storeData(inventoryNovos);
                        },
                      },
                      {text: 'No', onPress: () => console.log('No')},
                    ],
                    {cancelable: true},
                  );
                }}>
                <Image
                  source={{uri: data.images[m.name]}}
                  style={styles.itemImage}
                />
                <Text style={styles.itemText}>{m.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.headerText}>Your possbible crafts</Text>
        <View style={styles.possibleCrafts}>
          {getPossibleCrafts(inventory).map((p, index) => (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  p.name,
                  'Do you want create this item?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => {
                        const inventoryNovos = [
                          ...inventory.filter(
                            it => !p.recipe.includes(it.name),
                          ),
                          {name: p.name},
                        ];
                        setInventory([...inventoryNovos]);
                        storeData(inventoryNovos);
                      },
                    },
                    {text: 'No', onPress: () => console.log('No')},
                  ],
                  {cancelable: true},
                )
              }
              key={index}
              style={styles.recipe}>
              <Text style={styles.craftItem}>{p.name} = </Text>
              {p.recipe.map((rec, index) => (
                <Text key={index} style={styles.craftItem}>
                  {rec} {index < p.recipe.length - 1 && '+ '}
                </Text>
              ))}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  picker: {
    height: 25,
    width: 300,
    fontSize: 20,
    color: 'black',
    backgroundColor: 'white',
  },
  itemPicker: {
    color: 'red',
    fontSize: 24,
  },
  itemsSelected: {
    maxWidth: 125,
    backgroundColor: '#c3c3c3',
    marginHorizontal: 4,
    marginVertical: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  itemsSelectedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialButton: {
    width: 150,
    height: 30,
    backgroundColor: '#81b214',
    paddingHorizontal: 50,
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 5,
  },
  inventoryContainer: {
    flexWrap: 'wrap',
    width: width * 0.85,
    flex: 1,
    flexDirection: 'row',
    padding: 1,
    marginVertical: 10,
  },
  cardItem: {
    width: width * 0.27,
    height: width * 0.27,
    borderWidth: 1,
    borderColor: '#c3c3c3',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingTop: 5,
    margin: 1,
  },
  itemImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 11,
    color: 'black',
    width: '100%',
    textAlign: 'center',
  },
  possibleCrafts: {},
  recipe: {
    flexDirection: 'row',
    marginVertical: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#c3c3c3',
    borderWidth: 1,
    flexWrap: 'wrap',
    paddingLeft: 3,
  },
  craftItem: {
    fontWeight: 'bold',
  },
});

export default Bag;
