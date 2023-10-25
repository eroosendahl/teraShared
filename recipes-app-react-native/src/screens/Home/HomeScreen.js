import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP } from '../../Utility'

export default function HomeScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const localFetchURL = awsIP + '/DummyData'

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const gatherData = async () => {
    const response = await fetch(localFetchURL)
    setData((await response.json()));
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressIngredient = (item, storeItem) => {
    navigation.navigate("IngredientByStore", { ingredient: item, storeItem: storeItem });
  };

  const onPressStore = (item) => {
    navigation.navigate("Store", { storeItem: item });
  };

  const onPressRecipe = (item) => {
    alert("[HOME]  Recipe selected, great job!")
  }

  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    return (
      <TouchableHighlight
        style={styles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressRecipe(item)
        }}
      >
        <View style={styles.itemDetails}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>
              Original Price: ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${discountPrice}
            </Text>
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };


  const renderIngredients = ({ item }, storeItem) => {
    return (
      <TouchableHighlight
        style={styles.itemCardAlt}
        underlayColor="#f0f0f0"
        onPress={() => onPressIngredient(item, storeItem)}
      >
        <View style={styles.itemDetailsAlt}>
          <Image style={styles.itemImageAlt} source={{ uri: item.image }} />
          <View style={{ marginLeft: 0, flex: 1 }}>
            <Text style={styles.itemNameAlt}>{item.name}</Text>
            <Text style={styles.itemPrice}>
              Original Price: ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${(item.price - item.discount).toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  };


  const renderAllStores = (storeItem) => {
    const ingredientsData = storeItem.ingredients;
    const idl = ingredientsData.length
    const recipesData = storeItem.recipes;
    const leftHalfIngr = ingredientsData.slice(0, idl / 2)
    const rightHalfIngr = ingredientsData.slice(idl / 2, idl)


    if (storeItem.id === undefined) return;

    return (
      <View style={styles.storeContainer} key={storeItem.id}>
        {/* Store name with updated style */}
        <TouchableHighlight onPress={() => onPressStore(storeItem)} style={styles.storeHeaderBox}>
          <Text style={styles.storeHeaderText}>{storeItem.title}</Text>
        </TouchableHighlight>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Eligible Ingredients</Text>
        </View>

        {/* Render ingredients list */}
        <FlatList
          horizontal
          data={leftHalfIngr}
          storeItem={storeItem}
          renderItem={(item) => renderIngredients(item, storeItem)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }}
          />}
        />

        <FlatList
          horizontal
          data={rightHalfIngr}
          storeItem={storeItem}
          renderItem={(item) => renderIngredients(item, storeItem)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }}
          />}
        />

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Discounted Recipes</Text>
        </View>

        {/* Render recipes list */}
        <FlatList
          horizontal
          data={recipesData}
          renderItem={renderRecipes}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      </View>
    );
  };


  if (loading) {
    return (
      <Text style={styles.loadingText}>
        LOADING
      </Text>
    )
  }
  else return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        All Stores Inventories
      </Text>

      <FlatList
        data={data}
        renderItem={(item) => renderAllStores(item.item)}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
