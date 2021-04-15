import React from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  View,
  Text,
  ScrollView,
} from 'react-native';
import DQ8_Logo from './../assets/DQVIII_Logo.png';

const {width, height} = Dimensions.get('window');
const data = require('./../data/RecipesDragonQuestVIII.json');

const Thumb = ({imagePath, name}) => {
  return (
    <View style={styles.thumbContainer}>
      <Image source={{uri: imagePath}} style={styles.itemImage} />
      <Text style={styles.itemText}>{name}</Text>
    </View>
  );
};

const Item = ({item}) => {
  return (
    <ScrollView
      style={styles.taskContainer}
      contentContainerStyle={styles.taskContainerContent}
      horizontal={true}>
      <Thumb imagePath={data.images[item.name]} name={item.name} />
      <Text style={styles.operators}>=</Text>
      {item.recipe.map((recipeItem, index) => (
        <React.Fragment key={index}>
          {index >= 1 && <Text style={styles.operators}>+</Text>}
          <Thumb
            key={index}
            imagePath={data.images[recipeItem]}
            name={recipeItem}
          />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};
const HeaderList = ({name}) => (
  <>
    <Image source={DQ8_Logo} style={styles.logo} />
    <Text style={styles.listName}>{name.toUpperCase()}</Text>
  </>
);

const Recipes = ({navigation, route}) => {
  const title = route.params.title;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        style={styles.recipeList}
        data={data[title]}
        renderItem={({item, index}) => <Item item={item} key={index} />}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={<HeaderList name={title} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logo: {
    width: width,
    height: height * 0.3,
  },
  recipeList: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    padding: 0,
  },
  taskContainer: {
    width: width,
    flexDirection: 'row',
    marginBottom: 10,
  },
  taskContainerContent: {
    paddingHorizontal: 5,
  },
  itemText: {
    fontSize: 11,
    color: 'black',
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    width: 100,
    fontWeight: 'bold',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 5,
  },
  listName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 5,
  },
  thumbContainer: {
    flexDirection: 'row',
    height: 150,
    width: 100,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'rgba(0,0,0,0.2)',
    marginTop: 5,
  },
  operators: {
    fontSize: 22,
    fontWeight: 'bold',
    height: 150,
    textAlignVertical: 'center',
    marginHorizontal: 5,
  },
});

export default Recipes;
