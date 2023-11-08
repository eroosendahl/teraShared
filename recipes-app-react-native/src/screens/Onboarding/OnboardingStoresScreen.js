import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableHighlight, StyleSheet, Button } from "react-native";
import { awsIP } from '../../Utility'
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 200,
    paddingTop: 100,
  },
  item: {
    padding: 10,
    margin: 10,
    borderRadius: 20,
    backgroundColor: '#d3d3d3', 
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#90EE90', 
  },
  
});

export default function OnboardingStoresScreen(props) {
      const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]); // New state variable for the selected stores
  const localFetchURL = awsIP + '/allStores'
  const onPressContinue = async () => {
    const auth = getAuth();
    const db = getFirestore();

    if (auth.currentUser) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, {
        pinnedStores: selectedStores,
      });
    }

    navigation.navigate('Home');
  };
  const gatherData = async () => {
    const response = await fetch(localFetchURL)
    setData((await response.json()).map(item => {
      return ({
        id: item.id,
        title: item.title
      })
    }
    ));
  }

  useEffect(() => {
    gatherData();
  }, []);

  const onPressStore = (item) => {
    if (selectedStores.includes(item.id)) {
      setSelectedStores(selectedStores.filter(storeId => storeId !== item.id)); // Remove the store from the selected stores if it's already selected
    } else {
      setSelectedStores([...selectedStores, item.id]); // Add the store to the selected stores if it's not already selected
    }
  };

  const renderStores = ({ item }) => {
    if (item.title === undefined) return;
    return (
      <TouchableHighlight
        onPress={() => onPressStore(item)}
        style={[
          styles.item,
          selectedStores.includes(item.id) && styles.selectedItem, // Apply the selected styles if this is a selected store
        ]}
      >
        <Text>{item.title}</Text>
      </TouchableHighlight>
    )
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 16, fontWeight: "bold", textAlign: 'center'}}>Select your favorite grocery stores:</Text>
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={1} data={data} renderItem={renderStores} keyExtractor={(item) => `${item.id}`} />
      <Button
        title="Continue"
        onPress={onPressContinue}
        disabled={selectedStores.length === 0}
        color="#808080" // Change this to your desired color
      />
      <Button
        title="Skip"
        onPress={() => navigation.navigate('Home')} // Replace 'Home' with the name of your home screen
        color="#808080" // Change this to your desired color
      />
    </View>
  );

}
