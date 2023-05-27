import React from "react";

import TextWithIcon from "../TextWithIcon/TextWithIcon";

import "./RecipeIngredientDisplayer.scss";

import checked_icon from "../../Assets/Icons/checked.svg";

export default function RecipeIngredientDisplayer(): React.ReactElement {
    return (
        <main id="recipe-ingredient-displayer">
            <h2>Recipe Ingredients</h2>
            <section>
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
                <TextWithIcon text="dddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxx" number={33.4} iconURL={checked_icon} iconAlt="checked_icon" />
            </section>
        </main>
    );
}