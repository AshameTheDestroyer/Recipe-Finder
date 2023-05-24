import React from "react";

import Main from "../Main/Main";
import Header from "../Header/Header";

import "./Page.scss";

export default function Page(): React.ReactElement {
    return (
        <main id="page">
            <Header />
            <Main />
        </main>
    );
}