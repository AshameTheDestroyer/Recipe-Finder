import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Recipe from "./Utilities/Classes/Recipe";
import "./Utilities/Functions/GetFocusableElements";
import APIHandler from "./Utilities/Classes/APIHandler";
import { ROOT, ROOT_DIV_ELEMENT, darkThemeStyle, lightThemeStyle } from "./main";

type ThemeType = "dark" | "light";
type ModalType = "signUpForm" | "loginForm" | "bookmarkedRecipeDisplayerPopUp" | "addRecipeForm";

export type User = {
    email: string;
    username: string;
    password: string;
};

export type BookmarkedRecipe = {
    recipe: Recipe;
    usernames: Array<string>;
};

export type MainStateProps = {
    loggedUser?: User;
    openModal?: ModalType;
    searchedText?: string;
    appliedTheme: ThemeType;
    selectedRecipe?: Recipe;
    recipes?: Array<Recipe>;
    isLoadingRecipes?: boolean;
    isThereNetworkIssue?: boolean;
    userAddedRecipes?: Array<Recipe>;
    bookmarkedRecipes?: Array<BookmarkedRecipe>;
};

export const TEXT_KEY_TO_ALL_RECIPES: string = "user-made";

var FrozenFocusableElements: Array<HTMLElement>;

const
    LOGGED_USER: User = GetItemFromLocalStorage("logged-user"),
    INITIAL_MAIN_STATE: MainStateProps = {
        appliedTheme: "dark",
        loggedUser: LOGGED_USER,
        userAddedRecipes: GetItemFromLocalStorage("user-added-recipes"),
        bookmarkedRecipes: GetItemFromLocalStorage("bookmarked-recipes"),
    };

function GetItemFromLocalStorage<T>(key: string): T {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
}

const MainState = createSlice({
    name: "MainState",
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

        SelectRecipe: (state: MainStateProps, action: PayloadAction<Recipe>): MainStateProps => {
            return {
                ...state,
                selectedRecipe: action.payload,
            };
        },

        DeselectRecipe: (state: MainStateProps): MainStateProps => {
            return {
                ...state,
                selectedRecipe: null,
            };
        },

        ToggleBookmarkingRecipe: (state: MainStateProps, action: PayloadAction<Recipe>): MainStateProps => {
            let bookmarkedRecipes: Array<BookmarkedRecipe> = [...state.bookmarkedRecipes ?? []];

            if (bookmarkedRecipes.some(bookmarkedRecipe => bookmarkedRecipe.recipe.id == action.payload.id)) {
                if (bookmarkedRecipes
                    .find(bookmarkedRecipe => bookmarkedRecipe.recipe.id == action.payload.id)
                    .usernames.includes(state.loggedUser.username)
                ) {
                    bookmarkedRecipes = bookmarkedRecipes.map(bookmarkedRecipe => {
                        if (bookmarkedRecipe.recipe.id != action.payload.id) { return bookmarkedRecipe; }
                        return {
                            ...bookmarkedRecipe,
                            usernames: bookmarkedRecipe.usernames
                                .filter(username => username != state.loggedUser.username),
                        };
                    });
                } else {
                    bookmarkedRecipes = bookmarkedRecipes.map(bookmarkedRecipe => {
                        if (bookmarkedRecipe.recipe.id != action.payload.id) { return bookmarkedRecipe; }
                        return {
                            ...bookmarkedRecipe,
                            usernames: [...bookmarkedRecipe.usernames, state.loggedUser.username],
                        };
                    });
                }
            } else {
                bookmarkedRecipes.push({
                    recipe: action.payload,
                    usernames: [state.loggedUser.username],
                });
            }

            localStorage.setItem("bookmarked-recipes", JSON.stringify(bookmarkedRecipes));

            return {
                ...state,
                bookmarkedRecipes: [...bookmarkedRecipes ?? []],
            };
        },

        AddRecipe: (state: MainStateProps, action: PayloadAction<Omit<Recipe, "id" | "isUserMade">>): MainStateProps => {
            let recipe = new Recipe(
                action.payload.name,
                action.payload.publisher,
                (state.recipes?.length + state.userAddedRecipes?.length).toString(),
                action.payload.imageURL,
                true,
                action.payload.extraInformation,
            );

            let userAddedRecipes: Array<Recipe> = [...state.userAddedRecipes ?? [], recipe];
            localStorage.setItem("user-added-recipes", JSON.stringify(userAddedRecipes));

            return {
                ...state,
                userAddedRecipes,
            };
        },

        DeleteRecipe: (state: MainStateProps, action: PayloadAction<Recipe>): MainStateProps => {
            let recipes: Array<Recipe> = state.recipes?.filter(recipe => recipe.id != action.payload.id) ?? [],
                userAddedRecipes: Array<Recipe> = state.userAddedRecipes.filter(recipe => recipe.id != action.payload.id),
                bookmarkedRecipes: Array<BookmarkedRecipe> = state.bookmarkedRecipes.filter(bookmarkedRecipe => bookmarkedRecipe.recipe.id != action.payload.id);

            localStorage.setItem("user-added-recipes", JSON.stringify(userAddedRecipes));
            localStorage.setItem("bookmarked-recipes", JSON.stringify(bookmarkedRecipes));

            return {
                ...state,
                recipes,
                userAddedRecipes,
                bookmarkedRecipes,
            };
        },

        LogUserIn: (state: MainStateProps, action: PayloadAction<User>): MainStateProps => {
            localStorage.setItem("logged-user", JSON.stringify(action.payload));

            return {
                ...state,
            };
        },

        SignUserIn: (state: MainStateProps, action: PayloadAction<User>): MainStateProps => {
            let signedUsers: Array<User> = JSON.parse(localStorage.getItem("signed-users"));

            localStorage.setItem("signed-users", JSON.stringify([...signedUsers ?? [], action.payload]));
            localStorage.setItem("logged-user", JSON.stringify(action.payload));

            return {
                ...state,
            };
        },

        LogUserOut: (state: MainStateProps): MainStateProps => {
            localStorage.setItem("logged-user", "");

            return {
                ...state,
            };
        },

        StartLoadingRecipes: (state: MainStateProps): MainStateProps => {
            return {
                ...state,
                isLoadingRecipes: true,
            };
        },
    },

    extraReducers: builder => {
        builder.addCase(SearchRecipes.fulfilled, (state, action) => {
            if (action.payload.text.toLowerCase() == TEXT_KEY_TO_ALL_RECIPES) {
                return {
                    ...state,
                    isLoadingRecipes: false,
                    recipes: state.userAddedRecipes ?? [],
                    searchedText: action.payload.text,
                };
            }

            let recipes: Array<Recipe> =
                state.userAddedRecipes?.filter(recipe =>
                    recipe.name.toLowerCase().includes(action.payload.text.toLowerCase()) ||
                    recipe.publisher.toLowerCase().includes(action.payload.text.toLowerCase())) ?? [];

            if (action.payload.recipes === undefined) {
                return {
                    ...state,
                    recipes,
                    isLoadingRecipes: false,
                    isThereNetworkIssue: true,
                    searchedText: action.payload.text,
                }
            }

            if (!action.payload.recipes) {
                return {
                    ...state,
                    recipes,
                    isLoadingRecipes: false,
                    isThereNetworkIssue: false,
                    searchedText: action.payload.text,
                };
            }

            if (!action.payload.text?.length) {
                return {
                    ...state,
                    recipes,
                    isLoadingRecipes: false,
                    isThereNetworkIssue: false,
                    searchedText: action.payload.text,
                };
            }

            return {
                ...state,
                isLoadingRecipes: false,
                isThereNetworkIssue: false,
                searchedText: action.payload.text,
                recipes: [...recipes, ...action.payload.recipes ?? []],
            };
        });

        builder.addCase(SetRecipeExtraInformation.fulfilled, (state, action) => {
            if (action.payload === undefined) {
                return {
                    ...state,
                    isLoadingRecipes: false,
                    isThereNetworkIssue: true,
                }
            }

            return {
                ...state,
                isLoadingRecipes: false,
                isThereNetworkIssue: false,
                selectedRecipe: action.payload,
            };
        });
    },
});

export const SearchRecipes = createAsyncThunk(
    "MainState/SearchRecipes",
    async (text: string): Promise<{
        text: string,
        recipes: Array<Recipe>,
    }> => {
        if (!text?.length) {
            return {
                text,
                recipes: [],
            };
        }

        try {
            return {
                text,
                recipes: text == TEXT_KEY_TO_ALL_RECIPES ? [] : await APIHandler.SearchRecipes(text),
            };
        }
        catch {
            return {
                text,
                recipes: undefined,
            };
        }
    }
);

export const SetRecipeExtraInformation = createAsyncThunk(
    "MainState/SetRecipeExtraInformation",
    async (recipe: Recipe): Promise<Recipe> => {
        try {
            recipe.extraInformation = await APIHandler.SearchRecipeExtraInformation(recipe.id);
            return recipe;
        }
        catch { return undefined; }
    }
);

export default MainState.reducer;
export const MainActions = MainState.actions;