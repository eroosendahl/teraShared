import React, { useEffect, useState, useLayoutEffect } from "react";
import { FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import recipeStyles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { dummyStores } from "../../dummyData/dummyData";
import { awsIP } from '../../Utility'
import mainStyles from "./styles";
import HomeButton from "../../components/HomeButton/HomeButton";
import HomeSeparator from "../../components/HomeSeparator/HomeSeparator";

export default function StoresScreen(props) {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const localFetchURL = awsIP + '/allStores'



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
    const response = await fetch(localFetchURL)
    setData((await response.json()).map(item => {
      return ({
        id: item.id,
        image: item.image,
        title: item.title
      })
    }
    ));
    setLoading(false);
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressStore = (item) => {
    navigation.navigate("Store", { storeItem: item });

    /**
     * send message to db pinning the store "item"
     */
  };

  const renderStores = ({ item }) => {
    if (item.title === undefined) return;
    return (
      <TouchableHighlight onPress={() => onPressStore(item)} style={mainStyles.itemCard}>
        <View style={mainStyles.itemContainerAlt}>
          <Image style={mainStyles.imageAlt} source={{ uri: item.image }} />
          <Text style={mainStyles.itemHeaderTextAlt}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  };

  // console.log("data = ", data)

  return (
    <View>
      <HomeSeparator size="small" />
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={1} data={data} renderItem={renderStores} keyExtractor={(item) => `${item.id}`} />
    </View>
  );
}
