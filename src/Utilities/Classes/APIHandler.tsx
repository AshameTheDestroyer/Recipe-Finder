import Recipe, { RecipeExtraInformation } from "./Recipe";
import API_KEY from "../../Assets/JSONs/api_key.json";

export default class APIHandler {

    public static readonly KEY: string = API_KEY;

    private constructor() { }

    public static async SearchRecipes(recipeName: string): Promise<Array<Recipe>> {
        const RESPONSE: Response = await fetch(
            "https://forkify-api.herokuapp.com/api/v2/" +
            "recipes?search=" + recipeName +
            "&key=" + APIHandler.KEY
        );

        const
            JSON: any = await RESPONSE.json(),
            DATA: any = JSON.data;

        let recipes: Array<Recipe> = new Array<Recipe>();
        DATA.recipes.forEach((dataRecipe: any) => {
            let recipe: Recipe = new Recipe(
                dataRecipe.title,
                dataRecipe.publisher,
                dataRecipe.id,
                dataRecipe.image_url
            );
            recipes.push(recipe);
        });

        return recipes;
    }

    public static async SearchRecipesLocal(recipeName: string): Promise<Array<Recipe>> {
        recipeName = recipeName.replaceAll(" ", "_");

        try {
            const RESPONSE: Response = await fetch(`/src/Assets/JSONs/Data/${recipeName}.json`),
                JSON: any = await RESPONSE.json(),
                DATA: any = JSON.data;

            let recipes: Array<Recipe> = new Array<Recipe>();
            DATA.recipes.forEach((dataRecipe: any, i: number) => {
                let recipe: Recipe = new Recipe(
                    dataRecipe.title,
                    dataRecipe.publisher,
                    (i + 1).toString(),
                    `/src/Assets/Images/${recipeName}/ (${i + 1}).jpg`
                );

                recipes.push(recipe);
            });

            return recipes.sort((_, __) => 0.5 - Math.random());
        } catch (error: any) { console.log(error); }
    }

    public static async SearchRecipeExtraInformation(recipeID: string): Promise<RecipeExtraInformation> {
        const RESPONSE: Response = await fetch(
            "https://forkify-api.herokuapp.com/api/v2/" +
            "recipes/" + recipeID +
            "?key=" + APIHandler.KEY
        );

        const
            JSON: any = await RESPONSE.json(),
            DATA: any = JSON.data;

        return {
            cookingTime: DATA.recipe.cooking_time,
            ingredients: [...DATA.recipe.ingredients],
        };
    }
}