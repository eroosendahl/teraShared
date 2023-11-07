export class Store {
    constructor(data) {
        this.name = data.name;
        this.image = data.image;
        this.ingredients = data.ingredients;
    }

}

export const awsIP = "http://ec2-3-86-208-16.compute-1.amazonaws.com:3000"

export function constructRecipesInStoresData(inputStoresData, inputRecipesData) {
    if (Array.isArray(inputStoresData)) {
        inputStoresData.forEach((storeItem) => {
            storeItem.recipes = []
            inputRecipesData.forEach((recipeItem) => {
                if (recipeItem.ingredients.every(
                    (recipeIngredientName) => {
                        return storeItem.ingredients.some(
                            (storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                    })) {
                    storeItem.recipes.push(recipeItem)
                }
            })
        })
        return inputStoresData
    } else {
        const inputStoreData = inputStoresData
        inputStoreData.recipes = []
        inputRecipesData.forEach((recipeItem) => {
            if (recipeItem.ingredients.every( // strict matching
                (recipeIngredientName) => {
                    return inputStoreData.ingredients.some(
                        (storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                })) {
                inputStoreData.recipes.push(recipeItem)
            }
        })

        return inputStoreData
    }
}

export function constructPricesInRecipes(inputStoresData) {
    if (inputStoresData.length == 0) return

    if (Array.isArray(inputStoresData)) {
        inputStoresData.forEach((storeItem) => {
            storeItem.recipes.forEach((recipeItem) => {
                var sumPrices = 0
                var sumDiscounts = 0
                recipeItem.ingredients.forEach((recipeIngredientName) => {
                    const storeIngredientItemCopy = storeItem.ingredients.find((storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                    sumPrices += storeIngredientItemCopy.price
                    sumDiscounts += storeIngredientItemCopy.discount
                })
                recipeItem.price = sumPrices
                recipeItem.discount = sumDiscounts
                recipeItem.salePrice = sumPrices - sumDiscounts
            })
        })
    } else {
        const inputStoreData = inputStoresData
        inputStoreData.recipes.forEach((recipeItem) => {
            var sumPrices = 0
            var sumDiscounts = 0
            recipeItem.ingredients.forEach((recipeIngredientName) => {
                const storeIngredientItemCopy = inputStoreData.ingredients.find((storeIngredientItem) => (storeIngredientItem.name == recipeIngredientName))
                sumPrices += storeIngredientItemCopy.price
                sumDiscounts += storeIngredientItemCopy.discount
            })
            recipeItem.price = sumPrices
            recipeItem.discount = sumDiscounts
            recipeItem.salePrice = sumPrices - sumDiscounts
        })
    }

}