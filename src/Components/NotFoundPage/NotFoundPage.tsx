import React from "react";

import "./NotFoundPage.scss";

export default function NotFoundPage(): React.ReactElement {
    return (
        <main id="not-found-page">
            <section>
                <h1>Not Found 404</h1>
                <p>Looks like you're lost, there's no content over here...</p>
            </section>
        </main>
    );
}