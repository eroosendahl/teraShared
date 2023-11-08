import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/Home/HomeScreen";
import CategoriesScreen from "../screens/Categories/CategoriesScreen";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import SearchScreen from "../screens/Search/SearchScreen";
import IngredientByStoreScreen from "../screens/IngredientByStore/IngredientByStoreScreen";
import StoreScreen from "../screens/Store/StoreScreen";
import IngredientsScreen from "../screens/Ingredients/IngredientsScreen";
import IngredientScreen from "../screens/Ingredient/IngredientScreen";
import RecipesScreen from "../screens/Recipes/RecipesScreen";
import RecipeScreen from "../screens/Recipe/RecipeScreen";
import StoresScreen from "../screens/Stores/StoresScreen";
import AllStoresInventoriesScreen from "../screens/AllStoresInventories/AllStoresInventoriesScreen";
import Login from "../screens/Login/Login";
import Signup from "../screens/Signup";
import Settings from "../screens/Settings/Settings";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import OnboardingStoresScreen from "../screens/Onboarding/OnboardingStoresScreen";

const Stack = createStackNavigator();

function MainNavigator({ user }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
          textAlign: "center",
          alignSelf: "center",
          flex: 1,
        },
      }} 
      initialRouteName={user ? "Home" : "Onboarding"}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="IngredientByStore" component={IngredientByStoreScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Stores" component={StoresScreen} />
      <Stack.Screen name="AllStoresInventories" component={AllStoresInventoriesScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Ingredients" component={IngredientsScreen} />
      <Stack.Screen name="Ingredient" component={IngredientScreen} />
      <Stack.Screen name="Recipes" component={RecipesScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="OnboardingStoresScreen" component={OnboardingStoresScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function DrawerStack({ user }) {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      initialRouteName="Main"
      drawerStyle={{
        width: 250,
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => (
        <DrawerContainer navigation={navigation} />
      )}
    >
      <Drawer.Screen name="Main">
        {props => <MainNavigator {...props} user={user} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}


export default function AppContainer({ user }) {
  return (
    <NavigationContainer>
      <DrawerStack user={user} />
    </NavigationContainer>
  );
}



console.disableYellowBox = true;
