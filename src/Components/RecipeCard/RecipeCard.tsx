import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../store";
import Recipe from "../../Utilities/Classes/Recipe";
import { MainStateActions, MainStateProps } from "../../MainState";

import "./RecipeCard.scss";

import user_icon from "../../Assets/Icons/user.svg";

type RecipeCardProps = {
    recipe: Recipe;
    width?: string;
    defaultColour?: string;
};

export default function RecipeCard({
    width,
    recipe,
    defaultColour,
}: RecipeCardProps): React.ReactElement {
    const Dispatcher = useDispatch();
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);
    const RECIPE_CARD_ELEMENT = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!MainState.selectedRecipe || recipe != MainState.selectedRecipe) { return; }

        RECIPE_CARD_ELEMENT.current.classList.add("selected-recipe-card");
    }, []);

    function OnButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if (e.currentTarget != e.target) { return; }

        let selectedRecipeCard: HTMLElement = document.querySelector(".recipe-card.selected-recipe-card");

        if ((e.target as HTMLElement).parentElement == selectedRecipeCard) {
            selectedRecipeCard.classList.remove("selected-recipe-card");
            Dispatcher(MainStateActions.DeselectRecipe());
            return;
        }

        (e.target as HTMLElement).parentElement.classList.toggle("selected-recipe-card");
        selectedRecipeCard?.classList.toggle("selected-recipe-card");

        Dispatcher(MainStateActions.SelectRecipe(recipe));

        (e.currentTarget as HTMLElement).querySelector("a")!.click();
    }

    return (
        <div
            className={"recipe-card"}

            style={{
                "--width": width,
                "--default-colour": defaultColour,
            } as React.CSSProperties}

            ref={RECIPE_CARD_ELEMENT}
        >

            <button onClick={OnButtonClick} type="button">
                {
                    recipe.isUserMade &&
                    <img
                        className="user-icon"
                        src={user_icon}
                        alt="user_icon"
                        title="This recipe is made by you."
                    />
                }

                {
                    recipe.imageURL &&
                    <img
                        className="recipe-image"
                        src={recipe.imageURL}
                        alt={`${recipe.name}_recipe_image`}
                    />
                }

                <a href="#recipe-information-section">{!recipe.imageURL && recipe.name[0]}</a>
            </button>

            <h3>{recipe.name}</h3>
            <p>{recipe.chef}</p>
        </div>
    );
}