import React from "react";
import { createPortal } from "react-dom";

import "../../Utilities/Extensions/ToClassName";
import ComponentProps, { ComponentEventProps } from "../../Utilities/Types/ComponentProps";
import EitherOrNeither from "../../Utilities/Types/EitherOrNeither";

import "./Modal.scss";

type FormMethods = "GET" | "POST";

export type ModalProps = ComponentProps & {
    isOpen: boolean;

    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & EitherOrNeither<
    { isForm: false },
    {
        isForm: true;
        method: FormMethods;
        action: string;
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

    setIsOpen,
    events,
}: ModalProps): React.ReactElement {
    const INNER_ELEMENT_PROPS = {
        id,
        className: [
            "modal",
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

    return isOpen ? createPortal(
        <section
            className="modal-background"
            onClick={OnOutsideClick}
            onKeyDown={OnOutsideKeydown}
        >
            {
                isForm ?
                    <form {...INNER_ELEMENT_PROPS} method={method} action={action} {...events} /> :
                    <article {...INNER_ELEMENT_PROPS} />
            }
        </section>,
        MODAL_CONTAINER ?? document.body
    ) : null;
}