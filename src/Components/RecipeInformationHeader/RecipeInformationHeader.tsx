import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../store";
import CustomButton from "../CustomButton/CustomButton";
import TextWithIcon from "../TextWithIcon/TextWithIcon";
import { MainStateActions, MainStateProps } from "../../MainState";

import "./RecipeInformationHeader.scss";

import chef_icon from "../../Assets/Icons/chef.svg";
import clock_icon from "../../Assets/Icons/clock.svg";
import users_icon from "../../Assets/Icons/users.svg";
import plus_icon from "../../Assets/Icons/plus.svg";
import minus_icon from "../../Assets/Icons/minus.svg";
import bookmark_icon from "../../Assets/Icons/bookmark.svg";

export default function RecipeInformationHeader(): React.ReactElement {
    const Dispatcher = useDispatch();
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const [servings, setServings] = useState(1);

    const minutes = 12.5;

    return (
        <header>
            <section id="recipe-indicators">
                <TextWithIcon
                    iconURL={clock_icon}
                    iconAlt="clock_icon"
                    text={`${minutes * servings} Minute${minutes * servings > 1 ? "s" : ""}`}
                />

                <TextWithIcon
                    iconURL={users_icon}
                    iconAlt="users_icon"
                    text={`${servings} Serving${servings > 1 ? "s" : ""}`}
                />

                <TextWithIcon
                    text={MainState.selectedRecipe.chef}
                    iconURL={chef_icon}
                    iconAlt="chef_icon"
                />
            </section>

            <section className="button-displayer">
                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={minus_icon}
                    iconAlt="minus_icon"
                    isDisabled={servings <= 1}
                    title="Decreases the servings amount."

                    events={{
                        onClick: _ => setServings(previousValue => previousValue - 1),
                    }}
                />

                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={plus_icon}
                    iconAlt="plus_icon"
                    title="Increases the servings amount."

                    events={{
                        onClick: _ => setServings(previousValue => previousValue + 1),
                    }}
                />

                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={bookmark_icon}
                    iconAlt="bookmark_icon"
                    title="Bookmarks this recipe."
                    isEmphasized={MainState.bookmarkedRecipes?.includes(MainState.selectedRecipe)}

                    events={{
                        onClick: _ => Dispatcher(MainStateActions.ToggleBookmarkingRecipe(MainState.selectedRecipe)),
                    }}
                />
            </section>
        </header>
    );
}