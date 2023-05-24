import React, { useState } from "react";

import Modal, { ModalProps } from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";
import CustomButton from "../../CustomButton/CustomButton";
import REGEX_PATTERNS from "../../../Utilities/Constants/RegexPatterns";

import "./SigningForm.scss";

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
    const [passwordValue, setPasswordValue] = useState("");

    return (
        <Modal
            className="signing-form"
            isForm
            method="POST"
            isOpen={isOpen}
            action="../../../index.html"

            setIsOpen={setIsOpen}
            events={{ onReset: _ => setPasswordValue("") }}
        >
            <BigFigure />

            <main>
                <h2>{type == "signUp" ? "Sign up" : "Login"}</h2>

                <InputFieldContainer
                    type={type}
                    passwordValue={passwordValue}

                    setPasswordValue={setPasswordValue}
                />

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

type InputFieldContainerProps = Pick<SigningFormProps, "type"> & {
    passwordValue: string;
    setPasswordValue: React.Dispatch<React.SetStateAction<string>>;
};

function InputFieldContainer({
    type,
    passwordValue,

    setPasswordValue,
}: InputFieldContainerProps ): React.ReactElement {
    return (
        <section>
            <CustomInput
                isRequired
                type="text"
                isTransparent
                placeholder="username"
                isPlaceholderAlwaysShown
                pattern={REGEX_PATTERNS.username}
                title="Cannot have consecutive special characters, and special characters that are not (_-.)."
            />

            {
                type == "signUp" &&
                <CustomInput
                    isRequired
                    type="email"
                    isTransparent
                    placeholder="email"
                    isPlaceholderAlwaysShown
                    pattern={REGEX_PATTERNS.mail}
                    title={"Follow this pattern: \"example@organization.xxx\""}
                />
            }

            <CustomInput
                isRequired
                isTransparent
                type="password"
                value={passwordValue}
                placeholder="password"
                isPlaceholderAlwaysShown
                pattern={REGEX_PATTERNS.password}
                title={
                    "Should at least contain one lowercase "
                    + "character, one uppercase character, one digit, and one special character,"
                    + "and is between 8 and 20 characters long."
                }

                events={{ onChange: e => setPasswordValue(e.target.value) }}
            />

            {
                type == "signUp" &&
                <CustomInput
                    isRequired
                    isTransparent
                    type="password"
                    pattern={passwordValue}
                    isPlaceholderAlwaysShown
                    placeholder="confirm password"
                    title="The exact same password written above should be rewritten here too."
                />
            }
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