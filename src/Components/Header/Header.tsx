import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../store";
import SearchBar from "../SearchBar/SearchBar";
import CustomButton from "../CustomButton/CustomButton";
import ToggleButton from "../ToggleButton/ToggleButton";
import SigningForm from "../Modals/SigningForm/SigningForm";
import { MainStateActions, MainStateProps } from "../../MainState";

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
    const [isLoginFormOpen, setIsLoginFormOpen] = useState(MainState.openModal == "login");
    const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(MainState.openModal == "signUp");

    useEffect(() => {
        Dispatcher(
            MainStateActions.SetTheme(isDarkThemed ? "dark" : "light"));
    }, [isDarkThemed]);

    useEffect(() => {
        Dispatcher(
            MainStateActions.OpenModal(isSignUpFormOpen ? "signUp" : null));
    }, [isSignUpFormOpen]);

    useEffect(() => {
        Dispatcher(
            MainStateActions.OpenModal(isLoginFormOpen ? "login" : null));
    }, [isLoginFormOpen]);

    return (
        <header>
            <Logo />

            {
                MainState.username ?
                    <UserInteractionButtonDisplayer /> :
                    <SigningButtonDisplayer
                        setIsLoginFormOpen={setIsLoginFormOpen}
                        setIsSignUpFormOpen={setIsSignUpFormOpen}
                    />
            }

            <SearchBar id="recipe-search-bar" placeholder="Write a recipe here..." />

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
                isArrowed
                isEmphasized
                text="Sign up"
                iconPlace="right"

                events={{ onClick: _ => setIsSignUpFormOpen(true) }}
            />

            <CustomButton
                isStatic
                text="Login"

                events={{ onClick: _ => setIsLoginFormOpen(true) }}
            />
        </div>
    );
}

function UserInteractionButtonDisplayer(): React.ReactElement {
    return (
        <div className="button-displayer">
            <CustomButton
                isStatic
                iconPlace="left"
                text="Add Recipe"
                iconURL={add_recipe_icon}
                iconAlt="add_recipe_icon"
            />

            <CustomButton
                isStatic
                text="Bookmarks"
                iconPlace="left"
                iconURL={bookmark_icon}
                iconAlt="bookmark_icon"
            />
        </div>
    );
}