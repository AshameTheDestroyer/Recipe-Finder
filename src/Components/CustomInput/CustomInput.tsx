import React from "react";

import EitherOrNeither from "../../Utilities/Types/EitherOrNeither";
import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";

import "./CustomInput.scss";

type CustomInputType = React.HTMLInputTypeAttribute;
type CustomInputPatternType = "text" | "password" | "email" | "search" | "telephone" | "url";

type CustomInputProps = Omit<ComponentProps, "children"> & {
    name?: string;
    value?: string;
    title?: string;
    isReadOnly?: true;
    isRequired?: true;
    placeholder?: string;
    isTransparent?: true;
    minimumLength?: number;
    maximumLength?: number;
    isPlaceholderAlwaysShown?: true;

    events?: ComponentEventProps<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>;
} & EitherOrNeither<
    EitherOrNeither<
        { type: Exclude<CustomInputType, "number" | CustomInputPatternType> },
        { type: "number"; minimumNumber?: number; maximumNumber?: number }
    >,
    { type?: CustomInputPatternType; pattern?: string }
>;

export default function CustomInput({
    id,
    className,

    name,
    type,
    value,
    title,
    pattern,
    isReadOnly,
    isRequired,
    placeholder,
    isTransparent,
    minimumLength,
    maximumLength,
    minimumNumber,
    maximumNumber,
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
                title={title}
                placeholder=" "
                pattern={pattern}
                name={name ?? id}
                min={minimumNumber}
                max={maximumNumber}
                type={type ?? "text"}
                readOnly={isReadOnly}
                required={isRequired}
                minLength={minimumLength}
                maxLength={maximumLength}

                {...events}
            />

            <label htmlFor={name ?? id}>{placeholder}</label>
        </div>
    );
}