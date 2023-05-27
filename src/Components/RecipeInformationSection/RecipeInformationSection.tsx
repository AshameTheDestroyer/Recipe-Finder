import React from "react";
import { useSelector } from "react-redux";

import { StoreType } from "../../store";
import { MainStateProps } from "../../MainState";
import Recipe from "../../Utilities/Classes/Recipe";
import RecipeInformationHeader from "../RecipeInformationHeader/RecipeInformationHeader";
import RecipeIngredientDisplayer from "../RecipeIngredientDisplayer/RecipeIngredientDisplayer";

import "./RecipeInformationSection.scss";

import interact_icon from "../../Assets/Icons/interact.svg";
import sad_emoji_icon from "../../Assets/Icons/sad_emoji.svg";
import search_in_list_icon from "../../Assets/Icons/search_in_list.svg";

type EmptyInformationMessageProps = {
    message: string;
    iconURL: string;
    iconAlt: string;
};

const EMPTY_INFORMATION_MESSAGES: Array<EmptyInformationMessageProps> = [{
    iconURL: search_in_list_icon,
    iconAlt: "search_in_list_icon",
    message: "Search for the recipe you would like to make",
}, {
    iconURL: sad_emoji_icon,
    iconAlt: "sad_emoji_icon",
    message: "Oops, there's no results for this recipe, try another one",
}, {
    iconURL: interact_icon,
    iconAlt: "interact_icon",
    message: "Select the version you would like to learn about of the recipe you searched for",
}];

export default function RecipeInformationSection(): React.ReactElement {
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const [
        searchInformationMessage,
        sadInformationMessage,
        interactInformationMessage
    ] = EMPTY_INFORMATION_MESSAGES;

    return (
        <section id="recipe-information-section" className={MainState.selectedRecipe && "nonempty-recipe-information-section"}> {
            MainState.selectedRecipe ?
                <>
                    <MainInformationSection recipe={MainState.selectedRecipe} />
                    <RecipeInformationHeader />
                    <RecipeIngredientDisplayer />
                </> :
                <EmptyInformationMessage
                    {...(
                        !MainState.recipes ? searchInformationMessage :
                            MainState.recipes.length == 0 ? sadInformationMessage :
                                interactInformationMessage
                    )}
                />
        } </section>
    );
}

function EmptyInformationMessage({
    message,
    iconURL,
    iconAlt,
}: EmptyInformationMessageProps): React.ReactElement {
    return (
        <div id="empty-information-message">
            <img src={iconURL} alt={iconAlt} />
            <p>{message}</p>
        </div>
    );
}

type MainInformationSectionProps = {
    recipe: Recipe;
};

function MainInformationSection({
    recipe,
}: MainInformationSectionProps): React.ReactElement {
    return (
        <figure
            style={{
                "--image-url": `url("${recipe.imageURL}")`
            } as React.CSSProperties}
        >
            <h2>{recipe.name}</h2>
        </figure>
    );
}