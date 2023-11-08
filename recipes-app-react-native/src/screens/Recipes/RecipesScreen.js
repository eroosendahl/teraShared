import React, { useEffect, useState, useLayoutEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import recipeStyles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { dummyStores } from "../../dummyData/dummyData";
import { awsIP } from '../../Utility'
import mainStyles from "./styles";
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

export default function RecipesScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const storesFetchURL = awsIP + '/allStores'
  const recipesFetchURL = awsIP + '/allRecipes'
  const updateRecent = awsIP + '/UpdateRecent/'
  const userUID = getAuth().currentUser.uid
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
    const response = await fetch(recipesFetchURL)
    setData(await response.json())
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressItem = async (item) => {
    const response = await fetch(updateRecent + `${userUID}/${item.id}/Recipes/Recipe/null`);
    const result = await response.text()
    console.log(result);  
    navigation.navigate("Recipe", { recipeItem: item });
  };

  const renderRecipes = ({ item }) => {
    if (item.name === undefined) return;
    return (
      <TouchableHighlight onPress={() => onPressItem(item)} style={mainStyles.itemCard}>
        <View style={mainStyles.itemContainerAlt}>
          <Image style={mainStyles.imageAlt} source={{ uri: item.image }} />
          <Text style={mainStyles.itemHeaderTextAlt}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  console.log("data: ", data)
  return (
    <View>
      <HomeSeparator size="small" />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}> All Recipes</Text>
      <Text>Select one to see its availability, and recipes like it.</Text>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={1} data={data} renderItem={renderRecipes} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
