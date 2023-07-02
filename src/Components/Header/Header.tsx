import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../store";
import SearchBar from "../SearchBar/SearchBar";
import CustomButton from "../CustomButton/CustomButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import SigningForm from "../Modals/SigningForm/SigningForm";
import AddRecipeForm from "../Modals/AddRecipeForm/AddRecipeForm";
import { MainActions, MainStateProps, SearchRecipes } from "../../MainState";
import BookmarkedRecipeDisplayer from "../Modals/BookmarkedRecipeDisplayer/BookmarkedRecipeDisplayer";

import "./Header.scss";

import add_recipe_icon from "../../Assets/Icons/create.svg";
import bookmark_icon from "../../Assets/Icons/bookmark.svg";
import dark_mode_icon from "../../Assets/Icons/dark_mode_2.svg";
import light_mode_icon from "../../Assets/Icons/light_mode.svg";
import fork_and_knife_icon from "../../Assets/Icons/fork_and_knife.svg";

export default function Header(): React.ReactElement {
    const Dispatcher = useDispatch();
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const [isDarkThemed, setIsDarkThemed] = useState(MainState.appliedTheme == "dark");
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(MainState.openModal == "loginForm");
    const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(MainState.openModal == "signUpForm");
    const [isAddRecipeFormOpen, setIsAddRecipeFormOpen] = useState(MainState.openModal == "addRecipeForm");
    const [isBookmarkedRecipeDisplayerOpen, setIsBookmarkedRecipeDisplayerOpen] = useState(MainState.openModal == "bookmarkedRecipeDisplayerPopUp");

    useEffect(() => {
        Dispatcher(
            MainActions.SetTheme(isDarkThemed ? "dark" : "light"));
    }, [isDarkThemed]);

    useEffect(() => {
        Dispatcher(
            MainActions.OpenModal(isLoginFormOpen ? "loginForm" : null));
    }, [isLoginFormOpen]);

    useEffect(() => {
        Dispatcher(
            MainActions.OpenModal(isSignUpFormOpen ? "signUpForm" : null));
    }, [isSignUpFormOpen]);

    useEffect(() => {
        Dispatcher(
            MainActions.OpenModal(isAddRecipeFormOpen ? "addRecipeForm" : null));
    }, [isAddRecipeFormOpen]);

    useEffect(() => {
        Dispatcher(
            MainActions.OpenModal(isBookmarkedRecipeDisplayerOpen ? "bookmarkedRecipeDisplayerPopUp" : null));
    }, [isBookmarkedRecipeDisplayerOpen]);

    function OnSearchBarSearch(text: string): void {
        Dispatcher(MainActions.DeselectRecipe());
        Dispatcher(MainActions.StartLoadingRecipes());

        // @ts-ignore
        Dispatcher(SearchRecipes(text));
    }

    function onSearchBarKeydown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.key != "ArrowUp") { return; }

        e.preventDefault();
        e.currentTarget.value = MainState.searchedText ?? "";
    }

    return (
        <header>
            <Logo />

            {
                MainState.loggedUser ?
                    <UserInteractionButtonDisplayer
                        setIsAddRecipeFormOpen={setIsAddRecipeFormOpen}
                        setIsBookmarkedRecipeDisplayerOpen={setIsBookmarkedRecipeDisplayerOpen}
                    /> :
                    <SigningButtonDisplayer
                        setIsLoginFormOpen={setIsLoginFormOpen}

                        setIsSignUpFormOpen={setIsSignUpFormOpen}
                    />
            }

            <SearchBar
                id="recipe-search-bar"

                placeholder="Write a recipe here..."

                onSearch={OnSearchBarSearch}
                inputEvents={{ onKeyDown: onSearchBarKeydown }}
            />

            <ToggleButton
                id="theme-toggle-button"
                isChecked={isDarkThemed}
                iconURL={MainState.appliedTheme == "dark" ? light_mode_icon : dark_mode_icon}
                iconAlt={MainState.appliedTheme == "dark" ? "light_icon" : "dark_icon"}

                setIsChecked={setIsDarkThemed}
            />

            <SigningForm
                type="signUp"
                isOpen={isSignUpFormOpen}

                setIsOpen={setIsSignUpFormOpen}
            />

            <SigningForm
                type="login"
                isOpen={isLoginFormOpen}

                setIsOpen={setIsLoginFormOpen}
            />

            <AddRecipeForm
                isOpen={isAddRecipeFormOpen}

                setIsOpen={setIsAddRecipeFormOpen}
            />

            <BookmarkedRecipeDisplayer
                isOpen={isBookmarkedRecipeDisplayerOpen}

                setIsOpen={setIsBookmarkedRecipeDisplayerOpen}
            />
        </header>
    );
}

function Logo(): React.ReactElement {
    return (
        <div id="logo">
            <figure>
                <img src={fork_and_knife_icon} alt="website-logo" />
            </figure>

            <p>Recipe Finder</p>
        </div>
    );
}

type SigningButtonsProps = {
    setIsLoginFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSignUpFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SigningButtonDisplayer({
    setIsLoginFormOpen,
    setIsSignUpFormOpen,
}: SigningButtonsProps): React.ReactElement {
    return (
        <div className="button-displayer">
            <CustomButton
                isStatic
                text="Login"

                events={{ onClick: _ => setIsLoginFormOpen(true) }}
            />

            <CustomButton
                isStatic
                isArrowed
                isEmphasized
                text="Sign up"
                iconPlace="right"

                events={{ onClick: _ => setIsSignUpFormOpen(true) }}
            />

        </div>
    );
}

type UserInteractionButtonDisplayerProps = {
    setIsAddRecipeFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsBookmarkedRecipeDisplayerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function UserInteractionButtonDisplayer({
    setIsAddRecipeFormOpen,
    setIsBookmarkedRecipeDisplayerOpen,
}: UserInteractionButtonDisplayerProps): React.ReactElement {
    const Dispatcher = useDispatch();

    return (
        <div className="button-displayer">
            <CustomButton
                isStatic
                text="Bookmarks"
                iconPlace="left"
                iconURL={bookmark_icon}
                iconAlt="bookmark_icon"

                events={{ onClick: _ => setIsBookmarkedRecipeDisplayerOpen(true) }}
            />

            <CustomButton
                isStatic
                text="Add"
                iconPlace="left"
                iconURL={add_recipe_icon}
                iconAlt="add_recipe_icon"

                events={{ onClick: _ => setIsAddRecipeFormOpen(true) }}
            />

            <CustomButton
                href="/"
                isArrowed
                text="Log out"
                iconPlace="right"

                events={{ onClick: _ => Dispatcher(MainActions.LogUserOut()) }}
            />
        </div>
    );
}