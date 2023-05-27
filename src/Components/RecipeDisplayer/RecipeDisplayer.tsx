import React, { useState } from "react";
import { useSelector } from "react-redux";

import { StoreType } from "../../store";
import { MainStateProps } from "../../MainState";
import RecipeCard from "../RecipeCard/RecipeCard";
import COLOURS from "../../Utilities/Constants/Colours";
import CustomButton from "../CustomButton/CustomButton";

import "./RecipeDisplayer.scss";

type ScrollDirection = "left" | "right";

export default function RecipeDisplayer(): React.ReactElement {
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const
        SHOWN_RECIPE_COUNT: number = 10,
        PAGE_COUNT: number = Math.ceil(MainState.recipes?.length / SHOWN_RECIPE_COUNT);

    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    return (
        <aside id="recipe-displayer"> {
            MainState.recipes && MainState.recipes?.length > 0 &&
            <>
                <RecipeSlider
                    recipes={MainState.recipes}
                    shownRecipeCount={SHOWN_RECIPE_COUNT}
                    currentPageIndex={currentPageIndex}
                />

                <PageButtons
                    pageCount={PAGE_COUNT}
                    currentPageIndex={currentPageIndex}

                    setCurrentPageIndex={setCurrentPageIndex}
                />
            </>
        } </aside>
    );
}

type RecipeSliderProps = Required<Pick<MainStateProps, "recipes">> & {
    shownRecipeCount: number;
    currentPageIndex: number;
};

function RecipeSlider({
    recipes,
    shownRecipeCount,
    currentPageIndex,
}: RecipeSliderProps): React.ReactElement {
    const RECIPE_WIDTH_IN_REM: number = 9;

    return (
        <main>
            <RecipeSlidingButton direction="left" recipeWidthInRem={RECIPE_WIDTH_IN_REM} />

            <section> {
                recipes
                    .slice(currentPageIndex * shownRecipeCount,
                        currentPageIndex * shownRecipeCount + shownRecipeCount)
                    .map((recipe, i) =>
                        <RecipeCard
                            key={recipe.name + recipe.chef + i}

                            recipe={recipe}
                            width={`${RECIPE_WIDTH_IN_REM}rem`}
                            defaultColour={COLOURS[i % COLOURS.length]}
                        />)
            } </section>

            <RecipeSlidingButton direction="right" recipeWidthInRem={RECIPE_WIDTH_IN_REM} />
        </main>
    );
}

type RecipeSlidingButtonProps = {
    recipeWidthInRem: number;
    direction: ScrollDirection;
};

function RecipeSlidingButton({
    direction,
    recipeWidthInRem,
}: RecipeSlidingButtonProps): React.ReactElement {
    const REM_TO_PIXEL = 10;
    let recipeContainerElement: HTMLElement = null;

    function Scroll(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, scrollAllWay?: true): void {
        recipeContainerElement ??= (e.target as HTMLElement)
            .closest("main")
            .querySelector("section")!;

        if (scrollAllWay) {
            recipeContainerElement
                .querySelector(`.recipe-card:${direction == "left" ? "first" : "last"}-child`)
                .scrollIntoView({ block: "nearest" });

            return;
        }

        recipeContainerElement.scrollBy(
            recipeWidthInRem * REM_TO_PIXEL * (direction == "left" ? -1 : +1), 0);
    }

    return (
        <CustomButton
            id={`slide-${direction}-recipe-button`}

            isStatic
            isArrowed
            isIconOnly
            title={`Double click to slide to the ${direction == "left" ? "first" : "last"} recipe.`}

            events={{
                onClick: e => Scroll(e),
                onDoubleClick: e => Scroll(e, true),
            }}
        />
    );
}

type PageButtonsProps = {
    pageCount: number;
    currentPageIndex: number;

    setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>;
};

function PageButtons({
    pageCount,
    currentPageIndex,

    setCurrentPageIndex,
}: PageButtonsProps): React.ReactElement {
    const PAGE_BUTTON_RAW_VALUES: Array<ScrollDirection> = ["left", "right"];

    return (
        <div id="page-button-displayer">
            <p>{currentPageIndex + 1}</p>

            {
                PAGE_BUTTON_RAW_VALUES.map(pageButtonRawValue => {
                    const
                        DISPLAYED_PAGE_NUMBER: number =
                            currentPageIndex + 1 + (pageButtonRawValue == "left" ? -1 : +1),
                        ID: string = (pageButtonRawValue == "left" ? "previous" : "next")
                            + "-recipe-page-button",
                        CLASS_NAME: string = DISPLAYED_PAGE_NUMBER <= 0 || DISPLAYED_PAGE_NUMBER > pageCount ?
                            "hidden-page-button" : "";

                    return (
                        <CustomButton
                            id={ID}
                            className={CLASS_NAME}
                            key={pageButtonRawValue}

                            isArrowed
                            href={`#${ID}`}
                            iconPlace={pageButtonRawValue}
                            text={"Page " + DISPLAYED_PAGE_NUMBER}

                            events={{
                                onClick: _ => setCurrentPageIndex(previousValue =>
                                    previousValue + (pageButtonRawValue == "left" ? -1 : +1)),
                            }}
                        />
                    )
                })
            }
        </div>
    );
}