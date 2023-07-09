import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { StoreType } from "../../store";
import Recipe from "../../Utilities/Classes/Recipe";
import { MainStateProps, TEXT_KEY_TO_ALL_RECIPES } from "../../MainState";
import RecipeInformationHeader from "../RecipeInformationHeader/RecipeInformationHeader";
import RecipeIngredientDisplayer from "../RecipeIngredientDisplayer/RecipeIngredientDisplayer";

import "./RecipeInformationSection.scss";

import loading_icon from "../../Assets/Icons/loading.svg";
import interact_icon from "../../Assets/Icons/interact.svg";
import sad_emoji_icon from "../../Assets/Icons/sad_emoji.svg";
import offline_cloud_icon from "../../Assets/Icons/offline_cloud.svg";
import search_in_list_icon from "../../Assets/Icons/search_in_list.svg";

type EmptyInformationMessage = {
    message: string;
    iconURL: string;
    iconAlt: string;
};

const EMPTY_INFORMATION_MESSAGES: Array<EmptyInformationMessage> = [{
    iconURL: search_in_list_icon,
    iconAlt: "search_in_list_icon",
    message: "Search for the recipe you would like to make.",
}, {
    iconURL: sad_emoji_icon,
    iconAlt: "sad_emoji_icon",
    message: "Oops, there're no results for the text \"[placeholder]\", try another one.",
}, {
    iconURL: interact_icon,
    iconAlt: "interact_icon",
    message: "Select the version you would like to learn about of the recipe you searched for.",
}, {
    iconURL: loading_icon,
    iconAlt: "loading_icon",
    message: "Currently searching for matching recipes...",
}, {
    iconURL: loading_icon,
    iconAlt: "loading_icon",
    message: "Currently pending information of the recipe...",
}, {
    iconURL: offline_cloud_icon,
    iconAlt: "offline_cloud_icon",
    message: "503! There's been a network issue, loading only from client-side data instead.",
}, {
    iconURL: offline_cloud_icon,
    iconAlt: "offline_cloud_icon",
    message: "503! There's been a network issue.",
}, {
    iconURL: sad_emoji_icon,
    iconAlt: "sad_emoji_icon",
    message: "Oops, there're currently no user-made recipes, try adding one.",
}];

export default function RecipeInformationSection(): React.ReactElement {
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const [servingAmount, setServingAmount] = useState(1);

    const [
        searchInformationMessage,
        sadInformationMessage,
        interactInformationMessage,
        loadingInformationMessage,
        loadingRecipeExtraInformationMessage,
        offlineCloudInformationMessage,
        offlineCloudRecipeExtraInformationMessage,
        sadUserMadeInformationMessage,
    ] = EMPTY_INFORMATION_MESSAGES;

    useEffect(() => {
        setServingAmount(1);
    }, [MainState.selectedRecipe]);

    return (
        <section id="recipe-information-section" className={MainState.selectedRecipe && "nonempty-recipe-information-section"}> {
            MainState.selectedRecipe ?
                <>
                    <MainInformationSection recipe={MainState.selectedRecipe} />

                    {
                        MainState.selectedRecipe.extraInformation ?
                            <>
                                <RecipeInformationHeader
                                    servingAmount={servingAmount}
                                    minutes={MainState.selectedRecipe.extraInformation.cookingTime}

                                    setServingAmount={setServingAmount}
                                />

                                <RecipeIngredientDisplayer
                                    servingAmount={servingAmount}
                                    ingredients={MainState.selectedRecipe.extraInformation.ingredients}
                                />
                            </> :
                            <EmptyInformationMessageDisplayer {
                                ...((): EmptyInformationMessage => {
                                    if (MainState.isThereNetworkIssue) { return offlineCloudRecipeExtraInformationMessage; }
                                    return loadingRecipeExtraInformationMessage;
                                })()
                            }
                                isLoading={MainState.isLoadingRecipes || !MainState.isThereNetworkIssue}
                            />
                    }
                </> :
                <EmptyInformationMessageDisplayer {
                    ...((): EmptyInformationMessage => {
                        if (MainState.searchedText?.toLowerCase() == TEXT_KEY_TO_ALL_RECIPES && MainState.recipes.length == 0) { return sadUserMadeInformationMessage; }

                        if (MainState.isLoadingRecipes) { return loadingInformationMessage; }
                        if (MainState.isThereNetworkIssue) { return offlineCloudInformationMessage; }
                        if (!MainState.recipes) { return searchInformationMessage; }
                        if (MainState.recipes.length == 0) { return sadInformationMessage; }
                        return interactInformationMessage;
                    })()
                }
                    searchedText={MainState.searchedText}
                    hasFailed={MainState.recipes?.length == 0}
                    isLoading={MainState.isLoadingRecipes && !MainState.isThereNetworkIssue}
                />
        } </section>
    );
}

type EmptyInformationMessageDisplayerProps = EmptyInformationMessage & {
    isLoading: boolean;
    hasFailed?: boolean;
    searchedText?: string;
};

function EmptyInformationMessageDisplayer({
    message,
    iconURL,
    iconAlt,
    isLoading,
    hasFailed,
    searchedText,
}: EmptyInformationMessageDisplayerProps): React.ReactElement {
    return (
        <div
            id="empty-information-message"
            className={isLoading ? "loading-information-message" : ""}
        >
            <img src={iconURL} alt={iconAlt} />
            <p>{hasFailed ? message.replace("[placeholder]", searchedText) : message}</p>
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