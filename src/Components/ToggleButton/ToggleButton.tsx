import React from "react";

import EitherOrNeither from "../../Utilities/Types/EitherOrNeither";
import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";

import "./ToggleButton.scss";

type ToggleButtonProps = Omit<ComponentProps, "children"> & {
    isChecked: boolean;

    setIsChecked?: React.Dispatch<React.SetStateAction<boolean>>;
    events?: ComponentEventProps<HTMLButtonElement, React.InputHTMLAttributes<HTMLButtonElement>>;
} & EitherOrNeither<
    { iconURL: never },
    { iconURL: string; iconAlt: string }
>;

export default function ToggleButton({
    id,
    className,

    isChecked,
    iconURL,
    iconAlt,

    events,
    setIsChecked,
}: ToggleButtonProps): React.ReactElement {

    function ButtonOnClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        setIsChecked?.(previousValue => !previousValue);

        events?.onClick?.(e);
    }

    return (
        <button
            id={id}
            className={[
                "toggle-button",
                className,
            ].toClassName()}

            role="button"
            type="button"

            {...events}

            onClick={ButtonOnClick}
        >
            <input type="checkbox" checked={isChecked} readOnly />

            <figure>
                {iconURL && <img src={iconURL} alt={iconAlt} />}
            </figure>
        </button>
    );
}