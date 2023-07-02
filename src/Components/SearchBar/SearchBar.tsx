import React, { useState } from "react";

import "../../Utilities/Extensions/TrimAllSpaces";
import CustomInput from "../CustomInput/CustomInput";
import CustomButton from "../CustomButton/CustomButton";
import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";

import "./SearchBar.scss";

import search_icon from "../../Assets/Icons/search.svg";

type SearchBarProps = Omit<ComponentProps, "children"> & {
    placeholder?: string;

    onSearch?: (text: string) => void;
    inputEvents?: ComponentEventProps<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>;
    buttonEvents?: ComponentEventProps<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>;
};

export default function SearchBar({
    id,
    className,

    placeholder = "",

    onSearch,
    inputEvents,
    buttonEvents,
}: SearchBarProps): React.ReactElement {
    const [inputText, setInputText] = useState("");

    function OnInputKeydown(e: React.KeyboardEvent<HTMLInputElement>): void {
        inputEvents?.onKeyDown?.(e);

        if (e.key != "Enter") { return; }

        e.currentTarget
            .closest(".search-bar")!
            .querySelector("button")?.click();
    }

    function OnInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
        inputEvents?.onChange?.(e);

        setInputText(e.target.value);
    }

    function OnInputBlur(e: React.FocusEvent<HTMLInputElement, Element>): void {
        inputEvents?.onBlur?.(e);

        setInputText(previousValue => previousValue.trimAll());
    }

    function OnButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        setInputText(previousValue => previousValue.trimAll());

        buttonEvents?.onClick?.(e);

        onSearch?.(inputText);

        setInputText("");
    }

    return (
        <div
            id={id}
            className={[
                "search-bar",
                className
            ].toClassName()}
        >
            <CustomInput
                type="text"
                value={inputText}
                placeholder={placeholder}

                events={{
                    ...inputEvents,
                    onBlur: OnInputBlur,
                    onChange: OnInputChange,
                    onKeyDown: OnInputKeydown,
                }}
            />

            <CustomButton
                isStatic
                isEmphasized
                text="Search"
                iconPlace="left"
                iconURL={search_icon}
                iconAlt="search_icon"

                events={{ ...buttonEvents, onClick: OnButtonClick }}
            />
        </div>
    );
}