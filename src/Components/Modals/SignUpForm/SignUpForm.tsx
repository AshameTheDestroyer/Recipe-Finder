import React from "react";

import Modal, { ModalProps } from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";
import CustomButton from "../../CustomButton/CustomButton";

import "./SignUpForm.scss";

import github_icon from "../../../Assets/Icons/github.svg";

type SigningFormType = "signUp" | "login";

type SigningFormProps = Pick<ModalProps, "isOpen" | "setIsOpen"> & {
    type: SigningFormType;
};

export default function SigningForm({
    type,
    isOpen,

    setIsOpen,
}: SigningFormProps): React.ReactElement {
    return (
        <Modal
            className="signing-form"
            isForm
            method="POST"
            isOpen={isOpen}
            action="../../../index.html"

            setIsOpen={setIsOpen}
        >
            <BigFigure />

            <main>
                <h2>{type == "signUp" ? "Sign up" : "Login"}</h2>

                <InputFieldContainer type={type} />

                {
                    type == "signUp" ?
                        <TermsAndConditionsConfirmation /> :
                        <a href="">Forgot your password?</a>
                }

                <ButtonDisplayer type={type} setIsOpen={setIsOpen} />
            </main>
        </Modal>
    );
}

function BigFigure(): React.ReactElement {
    return (
        <figure>
            <img src={github_icon} alt="github_logo" />

            <p>
                Consider starring this project on my GitHub: <a
                    href="https://www.github.com/AshameTheDestroyer"
                    target="_blank"
                    children="@AshameTheDestroyer!" />
            </p>
        </figure>
    );
}

function InputFieldContainer({
    type,
}: Pick<SigningFormProps, "type">): React.ReactElement {
    return (
        <section>
            <CustomInput isPlaceholderAlwaysShown isTransparent isRequired type="text" placeholder="username" />
            {type == "signUp" && <CustomInput isPlaceholderAlwaysShown isTransparent isRequired type="email" placeholder="email" />}
            <CustomInput isPlaceholderAlwaysShown isTransparent isRequired type="password" placeholder="password" />
            {type == "signUp" && <CustomInput isPlaceholderAlwaysShown isTransparent isRequired type="password" placeholder="confirm password" />}
        </section>
    );
}

function TermsAndConditionsConfirmation(): React.ReactElement {
    return (
        <div id="terms-and-conditions-confirmation">
            <input type="checkbox" id="terms-and-conditions-checkbox" required />
            <label htmlFor="terms-and-conditions-checkbox">
                I agree all statements in <a href=""><q>Terms and Conditions.</q></a>
            </label>
        </div>
    );
}

function ButtonDisplayer({
    type,

    setIsOpen,
}: Pick<SigningFormProps, "type" | "setIsOpen">): React.ReactElement {
    return (
        <footer className="button-displayer">
            <CustomButton
                isStatic
                isEmphasized
                type="submit"
                text={type == "signUp" ? "Sign up" : "Login"}
            />

            <CustomButton
                isStatic
                type="reset"
                text="Reset"
            />

            <CustomButton
                isStatic
                type="reset"
                text="Cancel"

                events={{ onClick: _ => setIsOpen(false) }}
            />
        </footer>
    );
}