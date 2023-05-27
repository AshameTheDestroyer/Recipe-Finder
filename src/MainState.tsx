import { PayloadAction, createSlice } from "@reduxjs/toolkit";


import Recipe from "./Utilities/Classes/Recipe";
import "./Utilities/Extensions/GetFocusableElements";
import { ROOT, ROOT_DIV_ELEMENT, darkThemeStyle, lightThemeStyle } from "./main";

type ThemeType = "dark" | "light";
type ModalType = "signUp" | "login";

export type MainStateProps = {
    username?: string;
    openModal?: ModalType;
    appliedTheme: ThemeType;
    selectedRecipe?: Recipe;
    recipes?: Array<Recipe>;
    bookmarkedRecipes?: Array<Recipe>;
};

const a = Array(23).fill(null).map((_, i) =>
    new Recipe(
        "Bwwwwwwwwwwwwwwwwxxxxxxxxxxxxxxxwwwwwwwwwwwwwwwww" + (i + 1),
        "dwadwwwwwwwwwwwwwwwwwwxxxxxxxxxxxxxx",
        "../src/Assets/Icons/arrow_thick.svg",
        i % 2 == 0,
    )
);

const INITIAL_MAIN_STATE: MainStateProps = {
    appliedTheme: "dark",
    // username: "hashem",
    recipes: a,
};

var FrozenFocusableElements: Array<HTMLElement>;

const MainState = createSlice({
    name: "main_state",
    initialState: INITIAL_MAIN_STATE,

    reducers: {
        SetTheme: (state: MainStateProps, action: PayloadAction<ThemeType>): MainStateProps => {
            if (action.payload == "dark") {
                document.body.classList.add("dark-themed");
                document.body.classList.remove("light-themed");
            } else {
                document.body.classList.remove("dark-themed");
                document.body.classList.add("light-themed");
            }

            let style: React.CSSProperties = action.payload == "dark" ? darkThemeStyle : lightThemeStyle;
            for (const [key, value] of Object.entries(style)) {
                ROOT.style.setProperty(key, value);
            }

            return {
                ...state,
                appliedTheme: action.payload,
            };
        },

        OpenModal: (state: MainStateProps, action: PayloadAction<ModalType>): MainStateProps => {
            if ((state.openModal == null) != (action.payload == null)) {
                if (action.payload != null) {
                    (FrozenFocusableElements = ROOT_DIV_ELEMENT.getFocusableElements())
                        .forEach(element => element.setAttribute("tabindex", "-1"));
                } else {
                    FrozenFocusableElements?.forEach(element => element.attributes.removeNamedItem("tabindex"));
                }
            }

            return {
                ...state,
                openModal: action.payload,
            }
        },

        DeselectRecipe: (state: MainStateProps): MainStateProps => {
            return {
                ...state,
                selectedRecipe: null,
            };
        },

        SelectRecipe: (state: MainStateProps, action: PayloadAction<Recipe>): MainStateProps => {
            return {
                ...state,
                selectedRecipe: action.payload,
            };
        },

        ToggleBookmarkingRecipe: (state: MainStateProps, action: PayloadAction<Recipe>): MainStateProps => {
            let bookmarkedRecipes: Array<Recipe> = state.bookmarkedRecipes ?? new Array<Recipe>();

            if (bookmarkedRecipes.includes(action.payload)) {
                bookmarkedRecipes = bookmarkedRecipes.filter(recipe => recipe != action.payload);
            } else {
                bookmarkedRecipes = [...bookmarkedRecipes, action.payload];
            }

            return {
                ...state,
                bookmarkedRecipes: bookmarkedRecipes,
            };
        },
    },

});

export default MainState.reducer;
export const MainStateActions = MainState.actions;