import React from "react";

import ComponentProps from "../../Utilities/Types/ComponentProps";

import "./TextWithIcon.scss";

type TextWithIconProps = Pick<ComponentProps, "id"> & {
    text: string;
    iconURL: string;
    iconAlt: string;
};

export default function TextWithIcon({
    id,

    text,
    iconURL,
    iconAlt,
}: TextWithIconProps): React.ReactElement {
    return (
        <div
            id={id}
            className="text-with-icon"

            title={text}
        >
            <img src={iconURL} alt={iconAlt} />
            <p>{text}</p>
        </div>
    );
}