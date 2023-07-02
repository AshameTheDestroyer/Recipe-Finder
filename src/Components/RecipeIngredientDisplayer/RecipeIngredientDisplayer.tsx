import React from "react";

import TextWithIcon from "../TextWithIcon/TextWithIcon";
import { Ingredient } from "../../Utilities/Classes/Recipe";

import "./RecipeIngredientDisplayer.scss";

import checked_icon from "../../Assets/Icons/checked.svg";

type RecipeIngredientDisplayerProps = {
    servingAmount: number;
    ingredients: Array<Ingredient>;
};

export default function RecipeIngredientDisplayer({
    ingredients,
    servingAmount,
}: RecipeIngredientDisplayerProps): React.ReactElement {
    return (
        <main id="recipe-ingredient-displayer">
            <h2>Recipe Ingredients</h2>
            <section> {
                ingredients?.map((ingredient, i) =>
                    <TextWithIcon
                        key={i}

                        iconURL={checked_icon}
                        iconAlt="checked_icon"
                        text={
                            (ingredient.quantity ? `${ingredient.quantity * servingAmount} ` : "") +
                            (ingredient.unit ? ` ${ingredient.unit}` + " of " : " ") +
                            ingredient.description
                        }
                    />)
            } </section>
        </main>
    );
}