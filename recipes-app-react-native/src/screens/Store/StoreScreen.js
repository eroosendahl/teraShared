import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native"
import {
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  Button
} from "react-native";
import styles from "./styles";
import { ingredients, recipes } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName } from "../../data/MockDataAPI";
import { dummyStoresData } from "../../dummyData/dummyData";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes } from '../../Utility'
import HomeButton from "../../components/HomeButton/HomeButton";
import Arrow from 'react-native-arrow'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group"
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";


export default function InspectStoreScreen(props) {
  const { navigation } = props;
  const [backupData, setBackupData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [popularRecipesData, setPopularRecipesData] = useState([]);
  const [loading, setLoading] = useState(true)
  const route = useRoute();
  const targetStoreData = route.params?.storeItem;
  const storeFetchURL = awsIP + '/StoreData/' + targetStoreData.id
  const recipesFetchURL = awsIP + '/allRecipes'
  const [sortingOn, setSortingOn] = useState("None")
  const [sortingDir, setSortingDir] = useState({ "Price": "Ascending", "Name": "Alphabetical" })
  const [ingredientFilter, setIngredientFilter] = useState([])
  const updateRecent = awsIP + '/UpdateRecent/'
  const userUID = getAuth().currentUser.uid
  var popDataIsSet = false
  const updatePopularity = awsIP + '/UpdatePopularity/'

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
    const storeResponse = await fetch(storeFetchURL)
    const storePromise = await storeResponse.json()

    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json()

    setBackupData(storePromise)
    setStoreData(storePromise);
    setRecipesData(recipesPromise);

    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressIngredient = async (item, storeItem) => {
    // navigation.navigate("IngredientByStore", { ingredient: item, storeItem: storeItem });
    alert("[STORE] You picked an ingredient - great job!")
  };

  function updateIngredientFilter(taggedIngredientName) {
    if (ingredientFilter.includes(taggedIngredientName)) {
      const temp = ingredientFilter
      temp.splice(temp.at(taggedIngredientName), 1)
      setIngredientFilter(JSON.parse(JSON.stringify(temp)))
    }
    else {
      const temp = ingredientFilter
      temp.push(taggedIngredientName)
      setIngredientFilter(JSON.parse(JSON.stringify(temp)))
    }
    setStoreData(JSON.parse(JSON.stringify(storeData)))
  }

  function renderIngredientTag(inputIngredient) {
    ingredientName = inputIngredient.name
    if (ingredientFilter.some((filterIngredientName) => (filterIngredientName === ingredientName))) {
      return <View style={styles.ingredientFilterTagBox}>
        <TouchableHighlight
          style={styles.ingredientFilterTagSelected}
          underlayColor="#f0f0f0"
          onPress={() => updateIngredientFilter(inputIngredient.name)}
        >
          <View><Text style={styles.ingredientFilterTagText}>Filter by:</Text></View>
        </TouchableHighlight>
      </View>
    } else {
      return (<View style={styles.ingredientFilterTagBox}>
        <TouchableHighlight
          style={styles.ingredientFilterTag}
          underlayColor="#f0f0f0"
          onPress={() => updateIngredientFilter(inputIngredient.name)}
        >
          <View><Text style={styles.ingredientFilterTagText}>Filter by:</Text></View>
        </TouchableHighlight>
      </View>)
    }
  }

  const renderIngredients = ({ item }, storeItem) => {
    return (
      <View style={styles.storeIngredientAndFilterBox}>
        {renderIngredientTag(item)}
        <TouchableHighlight
          style={styles.itemCardAlt}
          underlayColor="#f0f0f0"
          onPress={() => onPressIngredient(item, storeItem)}
        >
          <View style={styles.itemDetailsAlt}>
            <Image style={styles.itemImageAlt} source={{ uri: item.image }} />
            <View style={{ marginLeft: 0, flex: 1 }}>
              <Text style={styles.itemNameAlt}>{item.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)} </Text>
                <Arrow size={10} color={'black'} />
                <Text style={styles.itemDiscount}> ${(item.price - item.discount).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>

    )
  };

  const onPressRecipe = async (item, storeItem) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Store/recipe/${storeItem.id}`);
    const text = await response.text();
    const popResponse = await fetch(updatePopularity + `${item.storeid}/${item.id}`)
    const popResult = await popResponse.text()
    alert("[STORE] You picked a recipe - great job!")
  }

  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    return (
      <TouchableHighlight
        style={styles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => onPressRecipe(item, storeData)}
      >
        <View style={styles.itemDetails}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View>
            <View style={styles.wrappingTextBox}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
            <Text style={styles.itemPrice}>
              Original Price: ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${discountPrice}        saved: ${item.discount.toFixed(2)}!
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderRecipesWithFilter = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    if (ingredientFilter.length != 0 && !recipeMatchesFilter(item)) return

    return (
      <TouchableHighlight
        style={styles.itemContainer}
        underlayColor="#f0f0f0"
        onPress={() => onPressRecipe(item, storeData)}
      >
        <View style={styles.itemDetails}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View>
            <View style={styles.wrappingTextBox}>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
            <Text style={styles.itemPrice}>
              Original Price: ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${discountPrice}        saved: ${item.discount.toFixed(2)}!
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  function gatherPopularRecipes(inputStoreItem) {
    if (inputStoreItem.recipes === undefined) return

    const inputRecipes = inputStoreItem.recipes
    const inputRecipePopularities = inputStoreItem.recipePopularity

    console.log("inputStoreItem")
    console.log(Object.keys(inputStoreItem))

    console.log("inputRecipePopularities")
    console.log(inputRecipePopularities)

    inputRecipePopularities.sort((a, b) => (b.clicks - a.clicks))

    const popularIDs = inputRecipePopularities.map((popularityItem) => (popularityItem.id)).slice(0, 9)

    const popularRecipes = []

    popularIDs.map((popRecipeID) => {
      const eligibleRecipe = inputRecipes.find((recipe) => (recipe.id === popRecipeID))
      if (eligibleRecipe != undefined) popularRecipes.push(eligibleRecipe)
    })

    return popularRecipes
  }

  const renderStore = (storeItem) => {
    const ingredientsData = storeItem.ingredients;
    const recipesData = storeItem.recipes;

    const ingredientCategories = ingredientsData.reduce((categoriesList, ingr) => {
      if (!categoriesList.some(item => item === ingr.category)) categoriesList.push(ingr.category)
      return categoriesList
    }, [])

    const categoriedIngredientData = ingredientCategories.map((catgry) => {
      return { category: catgry, ingredients: ingredientsData.filter(item => (item.category === catgry)) }
    })

    if (storeItem.id === undefined) return;

    if (popularRecipesData.length === 0) {
      const temp = JSON.parse(JSON.stringify(gatherPopularRecipes(storeItem)))
      setPopularRecipesData(temp)
    }

    popularRecipesData.map(popRec => {
      popRec.storeid = storeItem.id
      return popRec
    })

    recipesData.map(rec => {
      rec.storeid = storeItem.id
      return rec
    })

    return (
      <View style={styles.storeContainer} key={storeItem.id}>
        {/* Store name with updated style */}
        <Text style={styles.storeHeaderText}>{storeItem.title}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Popular Recipes</Text>
        </View>
        <FlatList
          horizontal
          data={popularRecipesData}
          renderItem={renderRecipes}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />

        <HomeSeparator size='tiny' />

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>All Recipes by filter</Text>
        </View>

        <Text>filtering by: {ingredientFilter.join(", ")}</Text>

        {/* Render recipes list */}
        <FlatList
          horizontal
          data={recipesData}
          renderItem={renderRecipesWithFilter}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
        <HomeSeparator size='tiny' />
        
        <Text style={styles.categoryHeader}>Ingredients</Text>
        <Text>Click the "Filter by" tab to add ingredient to filter.</Text>

        {renderIngredientSortControls()}
        {renderIngredientLists(categoriedIngredientData, storeItem)}

      </View>
    );
  };

  function renderIngredientLists(categoriedIngredientData, storeItem) {
    return categoriedIngredientData.map(item => {
      return (
        <View>
          <Text style={{ fontStyle: 'italic', padding: 5, fontSize: 16 }}>{item.category}</Text>
          <FlatList
            horizontal
            data={item.ingredients}
            storeItem={storeItem}
            renderItem={(item) => renderIngredients(item, storeItem)}
            ItemSeparatorComponent={() => <View style={{ width: 10 }}
            />}
          />
        </View>
      )
    })
  }

  function sortStoresIngredients(option, direction) {
    if (option == "None") return
    if (option == undefined) option = sortingOn
    if (direction == undefined) direction = sortingDir[option]

    if (option === "Price") {
      setSortingOn("Price")
      if (direction === "Ascending") {
        const temp = sortingDir["Name"]
        setSortingDir({ "Price": "Ascending", "Name": temp })
        backupData.ingredients.sort((a, b) => ((a.price - a.discount) - (b.price - b.discount)))
        setStoreData(backupData)
      }
      if (direction === "Descending") {
        const temp = sortingDir["Name"]
        setSortingDir({ "Price": "Descending", "Name": temp })
        backupData.ingredients.sort((a, b) => ((b.price - b.discount) - (a.price - a.discount)))
        setStoreData(backupData)
      }

    } else if (option === "Name") {
      setSortingOn("Name")
      if (direction === "Alphabetical") {
        const temp = sortingDir["Price"]
        setSortingDir({ "Price": temp, "Name": "Alphabetical" })
        backupData.ingredients.sort((a, b) => (a.name.localeCompare(b.name)))
        setStoreData(backupData)
      }
      else if (direction === "Reverse-alpha") {
        const temp = sortingDir["Price"]
        setSortingDir({ "Price": temp, "Name": "Reverse-alpha" })
        backupData.ingredients.sort((a, b) => (b.name.localeCompare(a.name)))
        setStoreData(backupData)
      }
    }
  }

  const changeIngredientSortDirection = () => {
    if (sortingOn === "Price") {
      if (sortingDir['Price'] === "Ascending") sortStoresIngredients("Price", "Descending")
      else if (sortingDir['Price'] === "Descending") sortStoresIngredients("Price", "Ascending")
    }
    else if (sortingOn === "Name") {
      if (sortingDir["Name"] === "Alphabetical") sortStoresIngredients("Name", "Reverse-alpha")
      else if (sortingDir["Name"] === "Reverse-alpha") sortStoresIngredients("Name", "Alphabetical")
    }
  }

  function renderIngredientSortControls() {
    return (
      <View style={{ flexDirection: "row", marginLeft: 5 }}>
        <View>
          <Text>Sort by:</Text>
          <Text>Price   Name</Text>
          <BouncyCheckboxGroup
            data={[{ id: "Price" }, { id: "Name" }]}
            onChange={(option) => sortStoresIngredients(option.id)}
          />
        </View>

        {(() => {
          if (sortingOn != "None") return (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text>Press to Change Direction</Text>
              <Button
                title={sortingDir[sortingOn]}
                onPress={changeIngredientSortDirection}
              />
            </View>
          )
        })()}

      </View>
    )
  }

  function recipeMatchesFilter(inputRecipe) {
    const res = (ingredientFilter.every(
      (filterIngredient) => (inputRecipe.ingredients.some(
        (recipeIngredient) => (recipeIngredient === filterIngredient)))))
    return res
  }

  function render() {

    constructRecipesInStoresData(storeData, recipesData)

    constructPricesInRecipes(storeData)

    if (loading) {
      return (
        <Text style={styles.loadingText}>
          LOADING
        </Text>
      )
    }
    else return (
      <ScrollView style={styles.HomeScrollBox}>
        <HomeSeparator size="small" />
        {renderStore(storeData)}
      </ScrollView>
    );
  }


  return render()
}
