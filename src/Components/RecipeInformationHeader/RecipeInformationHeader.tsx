import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../store";
import CustomButton from "../CustomButton/CustomButton";
import TextWithIcon from "../TextWithIcon/TextWithIcon";
import { MainActions, MainStateProps } from "../../MainState";

import "./RecipeInformationHeader.scss";

import chef_icon from "../../Assets/Icons/chef.svg";
import plus_icon from "../../Assets/Icons/plus.svg";
import clock_icon from "../../Assets/Icons/clock.svg";
import users_icon from "../../Assets/Icons/users.svg";
import minus_icon from "../../Assets/Icons/minus.svg";
import delete_icon from "../../Assets/Icons/delete_2.svg";
import bookmark_icon from "../../Assets/Icons/bookmark.svg";

type RecipeInformationHeaderProps = {
    minutes: number;
    servingAmount: number;

    setServingAmount: React.Dispatch<React.SetStateAction<number>>;
};

export default function RecipeInformationHeader({
    minutes,
    servingAmount,

    setServingAmount,
}: RecipeInformationHeaderProps): React.ReactElement {
    const Dispatcher = useDispatch();
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    return (
        <header>
            <section id="recipe-indicators">
                <TextWithIcon
                    iconURL={clock_icon}
                    iconAlt="clock_icon"
                    text={`${minutes * servingAmount} Minute${minutes * servingAmount > 1 ? "s" : ""}`}
                />

                <TextWithIcon
                    iconURL={users_icon}
                    iconAlt="users_icon"
                    text={`${servingAmount} Serving${servingAmount > 1 ? "s" : ""}`}
                />

                <TextWithIcon
                    iconURL={chef_icon}
                    iconAlt="chef_icon"
                    text={
                        MainState.loggedUser?.username == MainState.selectedRecipe.publisher ?
                            "You" : MainState.selectedRecipe.publisher
                    }
                />
            </section>

            <section className="button-displayer">
                {
                    MainState.loggedUser?.username == MainState.selectedRecipe.publisher &&
                    <CustomButton
                        isStatic
                        isIconOnly
                        iconURL={delete_icon}
                        iconAlt="delete_icon"
                        title="Deletes the recipe."

                        events={{
                            onClick: _ => {
                                Dispatcher(MainActions.DeselectRecipe());
                                Dispatcher(MainActions.DeleteRecipe(MainState.selectedRecipe));
                            },
                        }}
                    />
                }

                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={minus_icon}
                    iconAlt="minus_icon"
                    isDisabled={servingAmount <= 1}
                    title="Decreases the servings amount."

                    events={{ onClick: _ => setServingAmount(previousValue => previousValue - 1) }}
                />

                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={plus_icon}
                    iconAlt="plus_icon"
                    title="Increases the servings amount."

                    events={{ onClick: _ => setServingAmount(previousValue => previousValue + 1) }}
                />

                {
                    MainState.loggedUser &&
                    <CustomButton
                        isStatic
                        isIconOnly
                        iconURL={bookmark_icon}
                        iconAlt="bookmark_icon"
                        title="Bookmarks this recipe."
                        isEmphasized={
                            MainState.bookmarkedRecipes
                                ?.find(bookmarkedRecipe => bookmarkedRecipe.recipe.id == MainState.selectedRecipe.id)
                                ?.usernames.includes(MainState.loggedUser.username)
                        }

                        events={{ onClick: _ => Dispatcher(MainActions.ToggleBookmarkingRecipe(MainState.selectedRecipe)) }}
                    />
                }
            </section>
        </header>
    );
}