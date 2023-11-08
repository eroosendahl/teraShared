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

export default function HomeScreen(props) {
  const { navigation } = props;
  const [storesData, setStoresData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pinnedStoreIDs, setPinnedStoreIDs] = useState([]);
  const [usersRecentItems, setUsersRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'
  const userEmail = getAuth().currentUser.email
  const userUID = getAuth().currentUser.uid
  const userFetchURL = awsIP + '/UserInfo/' + userUID
  const updateRecent = awsIP + '/UpdateRecent/'
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
        recipePopularity: item.recipePopularity,
        recipes: item.recipes
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
    setUsersRecentItems(userPromise.recent)
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
              <Text style={styles.itemIngredientsText}>{ingredients}</Text>
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



  const renderRecentItems = () => {
    return <FlatList
      horizontal
      data={usersRecentItems}
      renderItem={(item) => renderRecentItem(item.item)}
      keyExtractor={item => (item.id)}
    />
  }

  function renderRecentItem(recentItem) {
    if (recentItem.screen === "Store") {
      if (recentItem.type.toLowerCase() === "recipe") {
        const recentRecipeID = recentItem.id
        const recentStoreID = recentItem.storeid
        const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
        const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
        return renderRecentRecipeSale(recentRecipeData, recentStoreData)
      }
    } else if (recentItem.screen === "Home") {
      if (recentItem.type.toLowerCase() === "recipe") {
        const recentRecipeID = recentItem.id
        const recentStoreID = recentItem.storeid
        const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
        const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
        return renderRecentRecipeSale(recentRecipeData, recentStoreData)
      }
    } else if (recentItem.screen.toLowerCase() === "ingredients") {
      const recentIngredientSearchItem = recentItem
      return renderRecentIngredientSearch(recentIngredientSearchItem)
    } else if (recentItem.screen.toLowerCase() === "ingredient") {
      const recentRecipeID = recentItem.id
      const recentStoreID = recentItem.storeid
      const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
      const recentStoreData = storesData.find(storeItem => (storeItem.id === recentStoreID))
      return renderRecentRecipeSale(recentRecipeData, recentStoreData)
    } else if (recentItem.screen.toLowerCase() === "recipes") {
      const recentRecipeID = recentItem.id
      const recentRecipeData = recipesData.find(recipeItem => (recipeItem.id === recentRecipeID))
      return renderRecentRecipeSearch(recentRecipeData)
    } else if (recentItem.screen.toLowerCase() === "recipe") {
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
          onPressRecipeSearch(recentRecipe)
        }}
      >
        <View style={styles.itemDetails}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Search for similar recipes to:</Text>
          <Image style={styles.itemImage} source={{ uri: recentRecipe.image }} />
          <View>
            <View style={styles.wrappingTextBox}>
              <Text style={styles.itemName}>{recentRecipe.name}</Text>
            </View>
            <View style={styles.itemIngredientsBox}>
              <Text style={styles.itemIngredientsText}>Ingredients: {ingredients}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  function renderRecentRecipeSale(recentRecipe, recentStore) {
    if (recentStore === undefined) return
    const ingredients = recentRecipe.ingredients.join(", ");
    const storeRecipe = recentStore.recipes.find(storeRecipeItem => (storeRecipeItem.id === recentRecipe.id))
    const discountPrice = (storeRecipe.price - storeRecipe.discount).toFixed(2);
    recentRecipe.storeid = recentStore.id

    return (
      <TouchableHighlight
        style={styles.itemContainerLong}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressRecentRecipeSale(recentRecipe)
        }}
      >
        <View style={styles.itemDetails}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>From: {recentStore.title}</Text>
          <Image style={styles.itemImage} source={{ uri: recentRecipe.image }} />
          <View>
            <View style={styles.wrappingTextBox}>
              <Text style={styles.itemName}>{recentRecipe.name}</Text>
            </View>
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

  function renderRecentIngredientSearch(recentIngredientSearchItem) {
    if (recentIngredientSearchItem.storeid === undefined) return

    const relatedStore = storesData.find(
      storeItem => (storeItem.id === recentIngredientSearchItem.storeid))

    if (relatedStore === undefined) {
      return
    }

    const recentIngredientSearched = relatedStore.ingredients.find(
      ingredientItem => (ingredientItem.id === recentIngredientSearchItem.id))

    return (
      <TouchableHighlight
        style={styles.itemContainerLong}
        underlayColor="#f0f0f0"
        onPress={() => {
          onPressIngredientSearch(recentIngredientSearched)
        }}
      >
        <View style={styles.itemDetails}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>{"\n"}Search for recipes using:
            {"\n"}{"\n"}
            {recentIngredientSearched.name} {"\n"}{"\n"}
            in your pinned stores</Text>
          <Image style={styles.itemImage} source={{ uri: recentIngredientSearched.image }} />
          <View>
            <Text style={styles.itemName}>{recentIngredientSearched.name}</Text>

          </View>
        </View>
      </TouchableHighlight>
    )
  }

  function gatherPopularRecipes(inputStoreItem) {
    if (inputStoreItem.recipes === undefined) return

    const inputRecipes = inputStoreItem.recipes
    const inputRecipePopularities = inputStoreItem.recipePopularity

    inputRecipePopularities.sort((a, b) => (b.clicks - a.clicks))

    const popularIDs = inputRecipePopularities.map((popularityItem) => (popularityItem.id))

    const popularRecipes = []

    inputRecipePopularities.forEach(recPop => {
      if (recPop.popular) {
        const forcedPopRec = inputRecipes.find(rec => (rec.id === recPop.id))
        if (forcedPopRec != undefined) popularRecipes.push(forcedPopRec)
      }
    })

    popularIDs.map((popRecipeID) => {
      const eligibleRecipe = inputRecipes.find((recipe) => (recipe.id === popRecipeID))
      if (eligibleRecipe != undefined && !popularRecipes.some(popRec => (popRec.id === eligibleRecipe.id))) popularRecipes.push(eligibleRecipe)
    })

    console.log("top ten!")
    const topTenPopRecipes = popularRecipes.slice(0,9)
    topTenPopRecipes.forEach(item => {
      console.log(item.id)
    })
    return topTenPopRecipes
  }

  const renderPopularItems = () => {
    if (storesData === undefined) return

    const pinnedStores = storesData.filter((storeItem) => (pinnedStoreIDs.some((pinnedStoreID) => (pinnedStoreID == storeItem.id))))

    const res = []

    pinnedStores.forEach((storeItem, index) => {
      const popularRecipes = gatherPopularRecipes(storeItem)

      popularRecipes.map(popRecipe => {
        popRecipe.storeid = storeItem.id
        return popRecipe
      })

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

  const onPressIngredientSearch = async (item) => {
    navigation.navigate("Ingredient", { ingredientItem: item });
  };

  const renderCategories = () => {
    res = []
    categories.forEach((category) => {
      displayMessage = ""
      if (category.name === "Ingredients") displayMessage = "search by ingredient"
      if (category.name === "Recipes") displayMessage = "find similar recipes"
      if (category.name === "Stores") displayMessage = "see all stores"
      res.push(
        <TouchableHighlight underlayColor="rgba(73,182,77,0.9)" onPress={() => onPressCategory(category)}>
          <View style={styles.categoriesItemContainer}>
            <Image style={styles.categoriesPhoto} source={{ uri: category.photo_url }} />
            <Text style={styles.categoriesName}>{displayMessage}</Text>
          </View>
        </TouchableHighlight>
      )
    })
    return res
  }

  const onPressRecipe = async (item) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Home/recipe/${item.storeid}`);
    const result = await response.text()
    const popResponse = await fetch(updatePopularity + `${item.storeid}/${item.id}`)
    const popResult = await popResponse.text()
    alert("[HOME] You picked a recipe, great job!");
  };

  const onPressRecentRecipeSale = async (item) => {
    const popResponse = await fetch(updatePopularity + `${item.storeid}/${item.id}`)
    const popResult = await popResponse.text()
    alert("[HOME] You picked a recipe, great job!");
  }

  const onPressRecipeSearch = async (item) => {
    navigation.navigate("Recipe", { recipeItem: item });
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

    console.log("userEmail")
    console.log(userEmail)
    console.log("userUID")
    console.log(userUID)

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
