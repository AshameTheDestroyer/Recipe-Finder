export type Ingredient = {
    unit?: string;
    quantity?: number;
    description: string;
};

export type RecipeExtraInformation = {
    cookingTime: number;
    ingredients: Array<Ingredient>;
};

export default class Recipe {
    public constructor(
        public name: string,
        public publisher: string,
        public id: string,
        public imageURL?: string,
        public isUserMade?: boolean,
        public extraInformation?: RecipeExtraInformation,
    ) { }
}