import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native"
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes } from '../../Utility'
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";

export default function RecipeScreen(props) {
  const { navigation } = props;
  const route = useRoute();
  const targetRecipeItem = route.params?.recipeItem;
  const [data, setData] = useState([]);
  const [storesData, setStoresData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <HomeButton
        onPress={() => {
          navigation.navigate("Home");
        }}
      />,
    });
  }, []);

  function recipesAreSimilar(mainIngrList, candIngrList) {
    var sum = 0
    candIngrList.forEach(candIngr => {
      if (mainIngrList.includes(candIngr)) sum++
    })
    if (sum >= 2) return true
    return false
  }

  const gatherData = async () => {
    const storesResponse = await fetch(storesFetchURL)
    const storesPromise = await storesResponse.json()

    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json()

    setStoresData(storesPromise.map((storeItem) => {
      return {
        id: storeItem.id,
        title: storeItem.title,
        image: storeItem.image,
        ingredients: storeItem.ingredients
      }
    }));

    setRecipesData(recipesPromise.filter((recipeItem) => (
      recipesAreSimilar(targetRecipeItem.ingredients, recipeItem.ingredients))))

    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressRecipe = (item) => {
    alert("[RECIPE] You picked a recipe - great job!")
  }


  const renderRecipes = ({ item }) => {
    const discountPrice = (item.price - item.discount).toFixed(2);
    const ingredients = item.ingredients.join(", ")

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
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
            <Text style={styles.itemPrice}>
              Original Price: ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${discountPrice}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };



  const renderStores = (item) => {
    if (item.id === undefined) return;
    return (
      <View style={styles.storeContainer}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>Store: {item.title}</Text>
        <FlatList
          horizontal
          data={item.recipes}
          renderItem={(item) => renderRecipes(item)}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }

  function render() {
    const pinnedStoreIDs = ["3jpfqAS0au00ektJSoFY", "nhpwEfjVu2i62JoP9m8r"] //temporary version

    const pinnedStoresData = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedID) => pinnedID === storeItem.id)))

    constructRecipesInStoresData(pinnedStoresData, recipesData)

    constructPricesInRecipes(pinnedStoresData)


    if (loading) {
      return (
        <Text style={styles.loadingText}>
          LOADING
        </Text>
      )
    }
    else return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Recipes matching: </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>{targetRecipeItem.name}</Text>
        <Text style={{ marginBottom: 10 }}>Recipes are a match if they share 2 or more ingredients.</Text>
        <View style={{ paddingBottom: 60 }}>
          <FlatList
            vertical
            numColumns={1}
            showsVerticalScrollIndicator={false}
            data={pinnedStoresData}
            renderItem={(item) => renderStores(item.item)}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    );
  }

  return render()
}



/**
 * list stores, pin the inspected recipe to the left, list similar recipes to the right
 */