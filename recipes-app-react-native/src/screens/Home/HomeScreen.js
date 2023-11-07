import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Image,
  Button,
} from "react-native";
import MenuImage from "../../components/MenuImage/MenuImage";
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";
import { awsIP, constructRecipesInStoresData, constructPricesInRecipes } from '../../Utility'
import SelectDropdown from 'react-native-select-dropdown'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from "react-native-bouncy-checkbox-group"
import Arrow from 'react-native-arrow'
import styles from './styles'
import { categories } from "../../dummyData/dummyData"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { dummyRecentItems } from "../../dummyData/dummyData";

export default function HomeScreen(props) {
  const { navigation } = props;
  const [storesData, setStoresData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pinnedStoreIDs, setPinnedStoreIDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'
  const userEmail = getAuth().currentUser.email
  const userUID = getAuth().currentUser.uid
  const userFetchURL = awsIP + '/UserInfo/' + userUID
  const dummyPinnedStoreIDs = ["3jpfqAS0au00ektJSoFY", "nhpwEfjVu2i62JoP9m8r"]


  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => (
        <HomeButton
          title="Home"
          onPress={() => {
            navigation.navigate("Home");
          }}
        />

      )
    });
  }, []);

  const onPressCategory = (item) => {
    const category = item.name;
    if (category == "Ingredients") {
      navigation.navigate("Ingredients");
    } else if (category == "Recipes") {
      navigation.navigate("Recipes");
    } else if (category == "Stores") {
      navigation.navigate("Stores");
    }

  };

  const gatherData = async () => {
    const storesResponse = await fetch(storesFetchURL)
    const storesPromise = await storesResponse.json()
    setStoresData(storesPromise.map(item => {
      return ({
        id: item.id,
        image: item.image,
        title: item.title,
        ingredients: item.ingredients,
        recipePopularity: item.recipePopularity
      })
    }
    ))
    const recipesResponse = await fetch(recipesFetchURL)
    const recipesPromise = await recipesResponse.json()
    setRecipesData(recipesPromise)
    setIngredientsData(storesPromise.reduce((res, item) => {  // gathers and stores data on unique ingredients (not store specific)
      item.ingredients.forEach((ingredient) => {
        if (!res.some(item => item.title === ingredient.name)) res.push(({// adds the ingredient to result if it hasnt already
          title: ingredient.name,
          image: ingredient.image,
          category: ingredient.category,

        }))
      })
      return res
    }, []
    ))
    const userResponse = await fetch(userFetchURL)
    const userPromise = await userResponse.json()
    setUserData(userPromise)
    setPinnedStoreIDs(userPromise.pinnedStores)
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const renderRecipes = ({ item }) => {
    const ingredients = item.ingredients.join(", ");
    const discountPrice = (item.price - item.discount).toFixed(2);

    // const discountPrice = (item.price - item.discount).toFixed(2);

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

  const renderIngredients = ({ item }, storeItem) => {
    return (
      <TouchableHighlight
        style={styles.itemCardAlt}
        underlayColor="#f0f0f0"
        onPress={() => onPressIngredient(item, storeItem)}
      >
        <View style={styles.itemDetailsHome}>
          <Image style={styles.itemImageAlt} source={{ uri: item.image }} />
          <Text style={styles.itemNameAlt}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  const renderStores = ({ item: storeItem }) => {
    if (storeItem.title === undefined) return;
    return (
      <TouchableHighlight onPress={() => onPressStore(storeItem)} style={styles.itemCard}>
        <View style={styles.itemContainerAlt}>
          <Image style={styles.imageAlt} source={{ uri: storeItem.image }} />
          <Text style={styles.itemHeaderTextAlt}>{storeItem.title}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  const renderPinnedStores = () => {
    if (storesData === undefined) return

    const pinnedStores = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id))))

    const res = []

    pinnedStores.forEach((storeItem, index) => {
      res.push(
        <TouchableHighlight onPress={() => onPressStore(storeItem)} style={styles.itemCard}>
          <View style={styles.itemContainerAlt}>
            <Image style={styles.imageAlt} source={{ uri: storeItem.image }} />
            <Text style={styles.itemHeaderTextAlt}>{storeItem.title}</Text>
          </View>
        </TouchableHighlight>
      )
    })
    return res
  }

  function attachPopularityToRecipes(inputStoreRecipes, inputStoreRecipePopularities) {

    inputStoreRecipePopularities.sort((a, b) => (b.clicks - a.clicks))

    const popularIDs = inputStoreRecipePopularities.map((popularityItem) => (popularityItem.id)).slice(9)

    const readyPopularRecipes = popularIDs.map((popRecipeID) => (inputStoreRecipes.find((recipe) => (recipe.id === popRecipeID))))

    return readyPopularRecipes
  }

  function gatherPopularRecipes(inputStoreItem) {
    if (inputStoreItem.recipes === undefined) return

    const inputRecipes = inputStoreItem.recipes
    const inputRecipePopularities = inputStoreItem.recipePopularity

    inputRecipePopularities.sort((a, b) => (b.clicks - a.clicks))

    const popularIDs = inputRecipePopularities.map((popularityItem) => (popularityItem.id)).slice(0, 9)

    const popularRecipes = []

    popularIDs.map((popRecipeID) => {
      const eligibleRecipe = inputRecipes.find((recipe) => (recipe.id === popRecipeID))
      if (eligibleRecipe != undefined) popularRecipes.push(eligibleRecipe)
    })

    return popularRecipes
  }

  const renderRecentItems = () => {
    return <FlatList
      horizontal
      data={dummyRecentItems}
      renderItem={(item) => renderRecentItem(item.item)}
      keyExtractor={item => (item.id)}
    />
  }

  function renderRecentItem(recentItem) {
    if (recentItem.screen === "Store") {
      if (recentItem.type === "Recipe") {
        const recentRecipeID = recentItem.id
        const recentStoreID = recentItem.storeid
        const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
        const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
        return renderRecentRecipeSale(recentRecipeData, recentStoreData)
      }
    } else if (recentItem.screen === "Home") {
      if (recentItem.type === "Recipe") {
        const recentRecipeID = recentItem.id
        const recentStoreID = recentItem.storeid
        const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
        const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
        return renderRecentRecipeSale(recentRecipeData, recentStoreData)
      }
    } else if (recentItem.screen === "Ingredients") {
      const recentIngredientID = recentItem.id
      // must find the corresponding ingredient item and feed it into the below function
      return renderRecentIngredientSearch()
    } else if (recentItem.screen === "Ingredient") {
      const recentRecipeID = recentItem.id
      const recentStoreID = recentItem.storeid
      const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
      const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
      return renderRecentRecipeSale(recentRecipeData, recentStoreData)
    } else if (recentItem.screen === "Recipes") {
      const recentRecipeID = recentItem.id
      const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
      return renderRecentRecipeSearch(recentRecipeData)
    } else if (recentItem.screen === "Recipe") {
      const recentRecipeID = recentItem.id
      const recentStoreID = recentItem.storeid
      const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
      const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
      return renderRecentRecipeSale(recentRecipeData, recentStoreData)
    }
  }

  function renderRecentRecipeSearch(recentRecipe) {
    const ingredients = recentRecipe.ingredients.join(", ");
    return (
      <TouchableHighlight
        style={styles.itemContainerLong}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressRecipe(recentRecipe)
        }}
      >
        <View style={styles.itemDetails}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Search for similar recipes to:</Text>
          <Image style={styles.itemImage} source={{ uri: recentRecipe.image }} />
          <View>
            <Text style={styles.itemName}>{recentRecipe.name}</Text>
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  function renderRecentRecipeSale(recentRecipe, recentStore) {
    const ingredients = recentRecipe.ingredients.join(", ");
    const storeRecipe = recentStore.recipes.find(storeRecipeItem => (storeRecipeItem.id === recentRecipe.id))
    const discountPrice = (storeRecipe.price - storeRecipe.discount).toFixed(2);
    return (
      <TouchableHighlight
        style={styles.itemContainerLong}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressRecipe(recentRecipe)
        }}
      >
        <View style={styles.itemDetails}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>From: {recentStore.title}</Text>
          <Image style={styles.itemImage} source={{ uri: recentRecipe.image }} />
          <View>
            <Text style={styles.itemName}>{recentRecipe.name}</Text>
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
            <Text style={styles.itemPrice}>
              Original Price: ${storeRecipe.price.toFixed(2)}
            </Text>
            <Text style={styles.itemDiscount}>
              Discounted Price: ${discountPrice}        saved: ${storeRecipe.discount.toFixed(2)}!
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  function renderRecentIngredientSearch(recentIngredientItem) {
    return (<View></View>) // empty bc no way to attach ingredient id "i4" to a specific ingredient in some store
  }


  const renderPopularItems = () => {
    if (storesData === undefined) return

    const pinnedStores = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id))))

    const res = []

    pinnedStores.forEach((storeItem, index) => {
      const popularRecipes = gatherPopularRecipes(storeItem)

      if (index != 0) res.push(<HomeSeparator size='tiny' />)

      res.push(
        <View>
          <Text style={styles.homeSubsectionHeaderText}>{storeItem.title}</Text>
          <FlatList
            horizontal
            data={popularRecipes}
            renderItem={(item) => renderRecipes(item)}
            keyExtractor={(item) => {
              return item.id
            }}
          />
        </View>
      )
    })
    return res
  }

  const renderCategories = () => {
    res = []
    categories.forEach((category) => {
      res.push(
        <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(category)}>
          <View style={styles.categoriesItemContainer}>
            <Image style={styles.categoriesPhoto} source={{ uri: category.photo_url }} />
            <Text style={styles.categoriesName}>{category.name}</Text>
          </View>
        </TouchableHighlight>
      )
    })
    return res
  }

  const onPressRecipe = (item) => {
    alert("[HOME] You picked a recipe, great job!")
  };

  const onPressStore = (item) => {
    navigation.navigate("Store", { storeItem: item });
  };

  const onPressASIButton = (item) => {
    navigation.navigate("AllStoresInventories");
  };

  const onPressPSButton = (item) => {
    navigation.navigate("OnboardingStoresScreen");
  };



  function render() {
    const recipesBoxDimensions = 400

    const recipesDataCopy = JSON.parse(JSON.stringify(recipesData))

    constructRecipesInStoresData(storesData, recipesDataCopy)

    constructPricesInRecipes(storesData)

    console.log("pinnedStoreIDs")
    console.log(pinnedStoreIDs)
    console.log("userData")
    console.log(userData)

    const pinnedStoresData = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedID) => pinnedID === storeItem.id)))

    if (loading) {
      return (
        <Text style={styles.loadingText}>
          LOADING
        </Text>
      )
    }
    else return (
      <ScrollView nestedScrollEnabled={true} name='homeContainer' style={{ marginLeft: 0, paddingLeft: 0, paddingBottom: 300 }}>
        <HomeSeparator size="small" />
        <View name='pinnedStores' style={{ marginLeft: 0, paddingLeft: 0 }}>
          <Text style={styles.homeSectionHeaderText}>your pinned stores:</Text>
          <View>
            {renderPinnedStores()}
          </View>
        </View>

        <HomeSeparator size="big" />

        <View name='recentItems'>
          <Text style={styles.homeSectionHeaderText}>recent items:</Text>
          {renderRecentItems()}
        </View>

        <HomeSeparator size="big" />

        <View name='popularRecipes' >
          <Text style={styles.homeSectionHeaderText}>popular deals{"\n"}from your stores:</Text>
          {renderPopularItems()}
        </View>

        <HomeSeparator size="big" />

        <View name='homeCategories'>
          <Text style={styles.homeSectionHeaderText}>browse by category:</Text>
          {renderCategories()}
        </View>

        <HomeSeparator size="big" />

        <View name='browseAllStoresInventories'>
          <Button title="AllStoresInventories" onPress={onPressASIButton} />
          <Button title="PinnedStores" onPress={onPressPSButton} />
        </View>

      </ScrollView>
    );
  }

  return render();
}
