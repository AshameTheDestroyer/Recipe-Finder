import React from "react";
import { createPortal } from "react-dom";

import "../../Utilities/Extensions/ToClassName";
import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";
import EitherOrNeither from "../../Utilities/Types/EitherOrNeither";

import "./Modal.scss";

type FormMethods = "GET" | "POST";

export type ModalProps = ComponentProps & {
    isPopUp?: true;
    isOpen: boolean;

    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & EitherOrNeither<
    { isForm: false },
    {
        isForm: true;
        action: string;
        method: FormMethods;
        events?: ComponentEventProps<HTMLFormElement, React.HTMLAttributes<HTMLFormElement>>;
    }
>;

const MODAL_CONTAINER: HTMLElement | null = document.querySelector("#modal-container");

export default function Modal({
    id,
    children,
    className,

    isOpen,
    isForm,
    method,
    action,
    isPopUp,

    events,
    setIsOpen,
}: ModalProps): React.ReactElement {
    const INNER_ELEMENT_PROPS = {
        id,
        className: [
            "modal",
            isPopUp && "pop-up-modal",
            className,
        ].toClassName(),
        children,
    };

    function OnOutsideClick(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        if (e.currentTarget != e.target) { return; }

        setIsOpen(false);
    }

    function OnOutsideKeydown(e: React.KeyboardEvent<HTMLElement>): void {
        if (e.key != "Escape") { return; }

        setIsOpen(false);
    }

    const OUTPUT: React.ReactElement = (
        <>
            <section
                className={[
                    "modal-background",
                    isPopUp && "pop-up-modal-background",
                ].toClassName()}

                onClick={OnOutsideClick}
                onKeyDown={OnOutsideKeydown}
            />
            {
                isForm ?
                    <form {...INNER_ELEMENT_PROPS} method={method} action={action} {...events} /> :
                    <article {...INNER_ELEMENT_PROPS} />
            }
        </>
    );

    return !isOpen ? null :
        isPopUp ? OUTPUT :
            createPortal(OUTPUT, MODAL_CONTAINER ?? document.body);
}