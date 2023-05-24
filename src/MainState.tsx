import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ROOT, ROOT_DIV_ELEMENT, darkThemeStyle, lightThemeStyle } from "./main";

import "./Utilities/Extensions/GetFocusableElements";

type ThemeType = "dark" | "light";
type ModalType = "signUp" | "login";

export type MainStateProps = {
    appliedTheme: ThemeType;
    currentOpenModal: ModalType;
    currentUsername: string;
};

const INITIAL_MAIN_STATE: MainStateProps = {
    appliedTheme: "dark",
    currentUsername: "hashem" && null,
    currentOpenModal: null,
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
            if ((state.currentOpenModal == null) != (action.payload == null)) {
                if (action.payload != null) {
                    (FrozenFocusableElements = ROOT_DIV_ELEMENT.getFocusableElements())
                        .forEach(element => element.setAttribute("tabindex", "-1"));
                } else {
                    FrozenFocusableElements?.forEach(element => element.attributes.removeNamedItem("tabindex"));
                }
            }

            return {
                ...state,
                currentOpenModal: action.payload,
            }
        }
    },

});

export default MainState.reducer;
export const MainStateActions = MainState.actions;