import React from "react";

import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";

import "./CustomInput.scss";

type CustomInputType = React.HTMLInputTypeAttribute;

type CustomInputProps = Omit<ComponentProps, "children"> & {
    name?: string;
    value?: string;
    readOnly?: true;
    isRequired?: true;
    placeholder?: string;
    isTransparent?: true;
    type?: CustomInputType;
    isPlaceholderAlwaysShown?: true;

    events?: ComponentEventProps<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>;
};

export default function CustomInput({
    id,
    className,

    name,
    type,
    value,
    readOnly,
    placeholder,
    isTransparent,
    isRequired,
    isPlaceholderAlwaysShown,

    events,
}: CustomInputProps): React.ReactElement {
    return (
        <div className={[
            "custom-input-container",
            isTransparent && "transparent",
            isPlaceholderAlwaysShown && "placeholder-always-shown",
        ].toClassName()}>
            <input
                id={id}
                className={[
                    "custom-input",
                    className,
                ].toClassName()}

                value={value}
                placeholder=" "
                name={name ?? id}
                readOnly={readOnly}
                type={type ?? "text"}
                required={isRequired}

                {...events}
            />

            <label htmlFor={name ?? id}>{placeholder}</label>
        </div>
    );
}