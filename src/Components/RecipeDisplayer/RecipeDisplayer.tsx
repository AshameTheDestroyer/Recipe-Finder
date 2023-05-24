import React from "react";

import RecipeCard from "../RecipeCard/RecipeCard";
import COLOURS from "../../Utilities/Constants/Colours";
import CustomButton from "../CustomButton/CustomButton";

import "./RecipeDisplayer.scss";

type ScrollDirection = "left" | "right";

export default function RecipeDisplayer(): React.ReactElement {
    return (
        <aside id="recipe-displayer">
            <RecipeSlider />
            <PageButtons />
        </aside>
    );
}

function RecipeSlider(): React.ReactElement {
    const RECIPE_WIDTH_IN_REM = 9;

    return (
        <main>
            <RecipeSlidingButton direction="left" recipeWidthInRem={RECIPE_WIDTH_IN_REM} />
            <section> {
                Array(20).fill(null).map((_, i) =>
                    <RecipeCard
                        key={i}
                        name={`Cake${i == 4 ? "hello i am hashem okldwoakdwo" : i}`}
                        author={`Cake${i == 4 ? "hello i am hashem okldwwwwwwwwwwwwwwwwwwoakdwo" : i}`}
                        width={`${RECIPE_WIDTH_IN_REM}rem`}
                        defaultColour={COLOURS[i % COLOURS.length]}
                    />)
            } </section>
            <RecipeSlidingButton direction="right" recipeWidthInRem={RECIPE_WIDTH_IN_REM} />
        </main>
    );
}

type RecipeSlidingButtonProps = {
    direction: ScrollDirection;
    recipeWidthInRem: number;
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

function PageButtons(): React.ReactElement {
    return (
        <div className="button-displayer">
            <CustomButton id="previous-recipe-page-button" text="Page 8" isArrowed iconPlace="left" isEmphasized isStatic />
            <CustomButton id="next-recipe-page-button" text="Page 10" isArrowed iconPlace="right" isEmphasized isStatic />
        </div>
    );
}