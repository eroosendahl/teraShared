import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native"
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
} from "react-native";
import mainStyles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes } from '../../Utility'
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";

export default function IngredientScreen(props) {
  const { navigation } = props;
  const route = useRoute();
  const targetIngredientItem = route.params?.ingredientItem;
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

  const gatherData = async () => {
    const storesResponse = await fetch(storesFetchURL)
    const storesPromise = await storesResponse.json()
    setData(storesPromise)
    setStoresData(storesPromise.map(item => {
      return ({
        id: item.id,
        image: item.image,
        title: item.title,
        ingredients: item.ingredients
      })
    }
    ))
    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json()
    setRecipesData(recipesPromise)
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressRecipe = (item) => {
    alert("You picked a recipe - great job!")
  }


  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    return (
      <TouchableHighlight
        style={mainStyles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressRecipe(item)
        }}
      >
        <View style={mainStyles.itemDetails}>
          <Image style={mainStyles.itemImage} source={{ uri: item.image }} />
          <View>
            <Text style={mainStyles.itemName}>{item.name}</Text>

            <View style={mainStyles.itemIngredientsBox}>
              <Text style={mainStyles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderStores = (item) => {  //https://stackoverflow.com/questions/48353471/checking-if-a-state-object-is-empty
    if (item.id === undefined || Object.keys(item.recipes).length == 0) return
    return (
      <View style={mainStyles.storeContainer}>
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

    const filteredRecipes = recipesData.filter((recipeItem) => {
      return recipeItem.ingredients.some((recipeIngredient) => {
        return (recipeIngredient === targetIngredientItem.title)
      })
    })

    constructRecipesInStoresData(pinnedStoresData, filteredRecipes)

    constructPricesInRecipes(pinnedStoresData)

    if (loading) {
      return (
        <Text style={mainStyles.loadingText}>
          LOADING
        </Text>
      )
    }
    else return (
      <View style={mainStyles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Recipes using: {targetIngredientItem.title}</Text>
        <View>
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

