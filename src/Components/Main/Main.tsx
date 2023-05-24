import React from "react";

import RecipeDisplayer from "../RecipeDisplayer/RecipeDisplayer";

import "./Main.scss";
import RecipeInformationSection from "../RecipeInformationSection/RecipeInformationSection";

export default function Main(): React.ReactElement {
    return (
        <main>
            <RecipeDisplayer />
            <RecipeInformationSection />
        </main>
    );
}