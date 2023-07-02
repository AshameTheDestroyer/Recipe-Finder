import React from "react";
import { useSelector } from "react-redux";

import { StoreType } from "../../../store";
import RecipeCard from "../../RecipeCard/RecipeCard";
import Modal, { ModalProps } from "../../Modal/Modal";
import TextWithIcon from "../../TextWithIcon/TextWithIcon";
import COLOURS from "../../../Utilities/Constants/Colours";
import { BookmarkedRecipe, MainStateProps } from "../../../MainState";

import "./BookmarkedRecipeDisplayer.scss";

import sad_emoji_icon from "../../../Assets/Icons/sad_emoji.svg";

type BookmarkedRecipeDisplayerProps = Pick<ModalProps, "isOpen" | "setIsOpen">;

export default function BookmarkedRecipeDisplayer({
    isOpen,

    setIsOpen,
}: BookmarkedRecipeDisplayerProps): React.ReactElement {
    const RECIPE_WIDTH_IN_REM: number = 9;

    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const FILTERED_BOOKMARKED_RECIPES: Array<BookmarkedRecipe> = MainState.bookmarkedRecipes
        ?.filter(bookmarkedRecipe => bookmarkedRecipe.usernames.includes(MainState.loggedUser?.username)) ?? [];

    return (
        <Modal
            id="bookmarked-recipe-displayer"

            isPopUp
            isOpen={isOpen}

            setIsOpen={setIsOpen}
        >
            <main> {
                FILTERED_BOOKMARKED_RECIPES.length ?
                    FILTERED_BOOKMARKED_RECIPES.map((bookmarkedRecipe, i) =>
                        <RecipeCard
                            key={i}

                            recipe={bookmarkedRecipe.recipe}
                            width={`${RECIPE_WIDTH_IN_REM}rem`}
                            defaultColour={COLOURS[i % COLOURS.length]}

                            buttonEvents={{ onClick: _ => setIsOpen(false) }}
                        />
                    ) :
                    <TextWithIcon
                        iconURL={sad_emoji_icon}
                        iconAlt="sad_emoji_icon"
                        text="There isn't any bookmarked recipe yet, search for some and add what you like!"
                    />
            } </main>
        </Modal>
    );
}