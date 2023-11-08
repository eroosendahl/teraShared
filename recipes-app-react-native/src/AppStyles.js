import { StyleSheet, Dimensions } from "react-native";

// screen sizing
const { width, height } = Dimensions.get("window");
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 250;

const IMAGE_MARGIN = 20;

const ITEM_CONTAINER_HEIGHT = 400

const ITEM_CARD_ALT_HEIGHT = 180

// 2 photos per width
export const mainStyles = StyleSheet.create({
  sectionListHeader: {
    margin: 5,
    marginTop: 0,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    fontSize: 30,
    fontWeight: "bold",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 0,
    textAlign: "center"
  },
  storeContainer: {
    marginBottom: 20,
    width: '100%',
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "green", // Border color
    borderStyle: 'solid',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemContainerAlt: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd", // Border color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1
  },
  imageAlt: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 0,
    padding: 0
  },
  itemCard: {
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 0,
    marginBottom: 10,
    marginLeft: 20,
    alignSelf: 'flex-start',
    width: "90%",
  },
  ingredientFilterTagBox: {
    height: 20,
  },
  ingredientFilterTag: {
    textAlign: "center",
    backgroundColor: "#dcdcdc",
    borderColor: "green",
    borderWidth: 2,
    borderTopEndRadius: 15
  },
  ingredientFilterTagSelected: {
    textAlign: "center",
    backgroundColor: "green",
    color: "white",
    borderColor: "green",
    borderWidth: 2,
    borderTopEndRadius: 15
  },
  ingredientFilterTagText: {
    fontWeight: "bold"
  },
  storeIngredientAndFilterBox: {
    height: ITEM_CARD_ALT_HEIGHT+20,

  },
  itemCardAlt: {
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 2,
    marginBottom: 10,
    width: 120,
    height: ITEM_CARD_ALT_HEIGHT,
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },  //https://jorgecolonconsulting.com/react-native-text-wrap/
  itemHeaderTextAlt: {
    fontSize: 24,
    fontWeight: "bold", // Make the text bold
    color: "black", // Change the text color
    textAlign: "left",
    flex: 1,
    width: 1,
    marginTop: 20,
    marginLeft: 10
  },
  // Additional styles for store header and category
  storeHeaderText: {
    fontSize: 24,
    fontWeight: "bold", // Make the text bold
    color: "#333", // Change the text color
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  storeHeaderBox: {
    width: "90%",
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 8,
    marginBottom: 20,
    marginLeft: 20,
    alignSelf: 'flex-start'
  },
  // Additional styles for category
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },

  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "#444444",
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  category: {
    marginTop: 5,
    marginBottom: 5,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 150
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    borderStyle: 'solid',
    borderColor: 'green',
    borderWidth: 2
  },
  itemImage: {
    width: RECIPE_ITEM_HEIGHT - IMAGE_MARGIN * 2,
    height: RECIPE_ITEM_HEIGHT - IMAGE_MARGIN * 2,
    borderRadius: 10,
    marginRight: IMAGE_MARGIN,
  },
  itemImageAlt: {
    width: 105,
    height: 105,
    borderRadius: 10,
    margin: 0,
    marginRight: 5,
    padding: 0
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  storeContainer: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  storeHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryHeader: {
    marginLeft: 5,
    marginTop: 5,
    fontSize:20,
    fontWeight: "bold",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 15,
    height: ITEM_CONTAINER_HEIGHT
  },
  itemContainerLong: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 15,
    height: ITEM_CONTAINER_HEIGHT+30
  },
  itemImage: {
    width: RECIPE_ITEM_HEIGHT - 30,
    height: RECIPE_ITEM_HEIGHT - 30,
    borderRadius: 10,
    marginRight: 10,
  },
  headerButtonContainer: {
    padding: 10
  },
  headerButtonImage: {
    justifyContent: 'center',
    width: 25,
    height: 25,
    margin: 6
  },
  itemDetails: {
    flex: 1,
  },
  itemDetailsAlt: {
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: "center"
  },
  itemDetailsHome: {
    flex: 1,
    padding: 0,
    margin: 0,
    height: 30
  },
  homeSectionHeaderText: {
    marginTop: 20,
    width: "98%",
    textAlign: "center",
    padding: 8,
    marginBottom: 20,
    marginLeft: 20,
    alignSelf: 'flex-start',
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Gill Sans",
    marginLeft:0, 
    paddingLeft:0
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    borderColor: 'red',
    borderStyle: 'solid'
  },
  homeSubsectionHeaderText: {
    padding: 8,
    marginBottom: 5,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemName: {
    flex: 1,
    width: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemNameAlt: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemNameAltSmall: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  }
  itemPrice: {
    fontSize: 11,
    color: "#555",
  },
  itemDiscount: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 0,
    paddingBottom: 0
  },
  homeBigSeparator: {
    minHeight: 20,
    backgroundColor: "green",
  },
  homeAltSeparator: {
    minHeight: 10,
  },
  itemIngredientsText: {
    fontSize: 13,
    flex: 1,
    width: 1,
  },
  wrappingTextBox: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1,
    marginBottom: 0,
  },
  itemIngredientsBox: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    flexGrow: 1,
    marginBottom:0,
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    marginBottom: 3
  },
  debugBorder: {
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 15,
  },
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
  },
  categoriesPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  categoriesName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
  }
});