import React from "react";

import RecipeDisplayer from "../RecipeDisplayer/RecipeDisplayer";
import RecipeInformationSection from "../RecipeInformationSection/RecipeInformationSection";

import "./Main.scss";

export default function Main(): React.ReactElement {
    return (
        <main>
            <RecipeDisplayer />
            <RecipeInformationSection />
        </main>
    );
}