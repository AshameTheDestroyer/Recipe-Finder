import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Modal, { ModalProps } from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";
import CustomButton from "../../CustomButton/CustomButton";
import { MainActions, User } from "../../../MainState";
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
    const Dispatcher = useDispatch();

    const userData: Array<User> = JSON.parse(localStorage.getItem("signed-users"));

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);

    function OnSubmit(e: React.FormEvent<HTMLFormElement>): void {
        if (type == "login") {
            let loggedUser: User = userData?.find(
                user => user.username == username || user.email == username);

            if (!loggedUser || loggedUser?.password != password) {
                e.preventDefault();

                setErrorMessage(!loggedUser ?
                    "Username or email doesn't exist." :
                    "Invalid password, try again...");
                return;
            }

            Dispatcher(MainActions.LogUserIn(loggedUser));
            setErrorMessage(null);
            return;
        }

        let loggedUser: User = userData?.find(
            user => user.username == username || user.email == email);

        if (loggedUser) {
            e.preventDefault();

            setErrorMessage((loggedUser.username == username ? "Username" : "Email")
                + " already exists, pick another one.");

            return;
        }

        Dispatcher(MainActions.SignUserIn({
            email,
            username,
            password,
        }));
        setErrorMessage(null);
    }

    return (
        <Modal
            className="signing-form"

            isForm
            action="/"
            method="POST"
            isOpen={isOpen}

            setIsOpen={previousValue => (setIsOpen(previousValue), setErrorMessage(null))}
            events={{
                onSubmit: OnSubmit,
                onReset: _ => (setUsername(""), setEmail(""), setPassword(""), setErrorMessage(null)),
            }}
        >
            <BigFigure />

            <main>
                <h2>{type == "signUp" ? "Sign up" : "Login"}</h2>

                <InputFieldContainer
                    type={type}
                    mail={email}
                    username={username}
                    password={password}

                    setMail={setEmail}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />

                {errorMessage && <p id="error-indicator-paragraph">{errorMessage}</p>}

                {
                    type == "signUp" ?
                        <TermsAndConditionsConfirmation /> :
                        <Link to="/NotFound">Forgot your password?</Link>
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
    mail: string;
    username: string;
    password: string;

    setMail: React.Dispatch<React.SetStateAction<string>>;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
};

function InputFieldContainer({
    type,
    mail,
    username,
    password,

    setMail,
    setUsername,
    setPassword,
}: InputFieldContainerProps): React.ReactElement {
    return (
        <section>
            <CustomInput
                isRequired
                type="text"
                isTransparent
                value={username}
                isPlaceholderAlwaysShown
                placeholder={type == "signUp" ? "username" : "username or email"}
                pattern={type == "signUp" ? REGEX_PATTERNS.username : REGEX_PATTERNS.usernameOrMail}
                title="Cannot have consecutive special characters, and special characters that are not (_-.)."

                events={{ onChange: e => setUsername(e.target.value) }}
            />

            {
                type == "signUp" &&
                <CustomInput
                    isRequired
                    type="email"
                    isTransparent
                    value={mail}
                    placeholder="email"
                    isPlaceholderAlwaysShown
                    pattern={REGEX_PATTERNS.mail}
                    title={"Follow this pattern: \"example@organization.xxx\""}

                    events={{ onChange: e => setMail(e.target.value) }}
                />
            }

            <CustomInput
                isRequired
                isTransparent
                type="password"
                value={password}
                placeholder="password"
                isPlaceholderAlwaysShown
                pattern={REGEX_PATTERNS.password}
                title={
                    "Should at least contain one lowercase "
                    + "character, one uppercase character, one digit, and one special character,"
                    + "and is between 8 and 20 characters long."
                }

                events={{ onChange: e => setPassword(e.target.value) }}
            />

            {
                type == "signUp" &&
                <CustomInput
                    isRequired
                    isTransparent
                    type="password"
                    pattern={password}
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
                I agree all statements in <Link to="/NotFound"><q>Terms and Conditions.</q></Link>
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