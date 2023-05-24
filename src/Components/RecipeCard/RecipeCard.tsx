import React from "react";

import "./RecipeCard.scss";

type RecipeCardProps = {
    name: string;
    author: string;
    width?: string;
    imageURL?: string;
    defaultColour?: string;
};

export default function RecipeCard({
    name,
    width,
    author,
    imageURL,
    defaultColour,
}: RecipeCardProps): React.ReactElement {

    function OnButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        let selectedRecipeCard: HTMLElement = document.querySelector(".recipe-card.selected-recipe-card");

        if ((e.target as HTMLElement).parentElement == selectedRecipeCard) {
            selectedRecipeCard.classList.remove("selected-recipe-card");
            return;
        }

        (e.target as HTMLElement).parentElement.classList.toggle("selected-recipe-card");
        selectedRecipeCard?.classList.toggle("selected-recipe-card");
    }

    return (
        <div className={"recipe-card"}
            style={{
                "--width": width,
                "--default-colour": defaultColour,
            } as React.CSSProperties}
        >
            <button onClick={OnButtonClick}> {
                imageURL ?
                    <img src={imageURL} alt={`${name}_recipe_image`} /> :
                    <p>{name[0]}</p>
            } </button>

            <h3>{name}</h3>
            <p>{author}</p>
        </div>
    );
}