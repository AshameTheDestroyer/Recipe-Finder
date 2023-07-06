import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import store from "./store";
import Page from "./Components/Page/Page";
import NotFoundPage from "./Components/NotFoundPage/NotFoundPage";

import "./index.scss";

export const darkThemeStyle: React.CSSProperties = {
    "--fore-colour": "#FFFFFF",
    "--background-colour": "#222222",
    "--fore-darker-colour": "#999999",
    "--background-darker-colour": "#111111",
} as React.CSSProperties;

export const lightThemeStyle: React.CSSProperties = {
    "--fore-colour": "#000000",
    "--background-colour": "#EEEEEE",
    "--fore-darker-colour": "#222222",
    "--background-darker-colour": "#CCCCCC",
} as React.CSSProperties;

export const
    ROOT: HTMLElement = document.querySelector(":root")!,
    ROOT_DIV_ELEMENT: HTMLElement | null = document.querySelector("#root");

ReactDOM.createRoot(ROOT_DIV_ELEMENT ?? document.body).render(<Index />);

function Index(): React.ReactElement {

    useEffect(() => {
        document.body.classList.toggle("dark-themed");
    }, []);

    return (
        <BrowserRouter basename={window.location.pathname || ""}>
            <Provider store={store}>
                <Routes>
                    <Route path="/" element={<Page />} />
                    <Route path="/NotFound" element={<NotFoundPage />} />
                </Routes>
            </Provider>
        </BrowserRouter>
    );
}