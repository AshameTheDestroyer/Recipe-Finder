import React from "react";
import { Link } from "react-router-dom";

import "../../Utilities/Extensions/ToClassName";
import Either from "../../Utilities/Types/Either";
import EitherOrNeither from "../../Utilities/Types/EitherOrNeither";
import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";

import "./CustomButton.scss";

import arrow_thin_icon from "../../Assets/Icons/arrow_thin.svg";

type IconPlace = "left" | "right";
type ButtonType = "button" | "submit" | "reset";
type AnchorTarget = React.HTMLAttributeAnchorTarget;
type IconDecision = Either<
    { iconPlace: IconPlace },
    { isIconOnly: true }
>;

type CustomButtonProps = ComponentProps & {
    text?: string;
    title?: string;
    isDisabled?: boolean;
    isEmphasized?: boolean;
    confirmationMessage?: string;
    requireDoubleClicking?: true;

    events?: ComponentEventProps<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>;
} & EitherOrNeither<
    { isArrowed: true } & IconDecision,
    { iconURL: string; iconAlt: string } & IconDecision
> & EitherOrNeither<
    EitherOrNeither<
        { isStatic: true; type?: ButtonType },
        { href: string; target?: AnchorTarget }
    >,
    { section: string }
>;

export default function CustomButton({
    id,
    children,
    className,

    text,
    href,
    type,
    title,
    iconAlt,
    iconURL,
    section,
    isStatic,
    isArrowed,
    iconPlace,
    isDisabled,
    isIconOnly,
    isEmphasized,
    target = "_self",
    confirmationMessage,
    requireDoubleClicking,

    events,
}: CustomButtonProps): React.ReactElement {

    function CreateOnClickEvent(eventType: "click" | "doubleClick"):
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
        return function (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
            const ANCHOR: HTMLAnchorElement = e.currentTarget.querySelector("a")!;

            if (e.target == ANCHOR) { return; }
            if (eventType == "click" && requireDoubleClicking) { return; }
            if (confirmationMessage && !confirm(confirmationMessage)) { return; }

            if (eventType == "doubleClick" || requireDoubleClicking) { events?.onDoubleClick?.(e); }
            else { events?.onClick?.(e); }

            if (!isStatic) { ANCHOR.click(); }
        }
    }

    return (
        <button
            id={id}
            className={[
                "custom-button",
                isArrowed && "arrowed-button",
                isIconOnly && "icon-only-button",
                isEmphasized && "emphasized-button",
                (iconURL || isArrowed) && "icon-button",
                (iconURL || isArrowed) && `icon-button-${iconPlace}`,
                className,
            ].toClassName()}

            title={title}
            disabled={isDisabled}
            type={type ?? "button"}

            {...events}
            onClick={CreateOnClickEvent("click")}
            onDoubleClick={CreateOnClickEvent("doubleClick")}
        >
            <LinkOrAnchor
                href={href}
                text={text}
                target={target}
                section={section}
            />

            <Icon
                iconURL={iconURL}
                iconAlt={iconAlt}
                isArrowed={isArrowed}
            />

            {children}
        </button>
    );
}

function LinkOrAnchor({
    href,
    text,
    target,
    section,
}: Required<Pick<CustomButtonProps, "href" | "target" | "text" | "section">>): React.ReactElement {
    return (
        href ?
            <a href={href} tabIndex={-1} target={target}>{text}</a> :
            <Link to={section ?? "/NotFound"} tabIndex={-1}>{text}</Link>
    );
}

function Icon({
    iconURL,
    iconAlt,
    isArrowed,
}: Required<Pick<CustomButtonProps, "isArrowed" | "iconURL" | "iconAlt">>): React.ReactElement {
    return (
        !iconURL && !isArrowed ? null :
            <img src={iconURL ?? arrow_thin_icon} alt={iconAlt ?? "arrow_icon"} />
    );
}