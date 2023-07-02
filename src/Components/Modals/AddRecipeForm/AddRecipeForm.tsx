import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { StoreType } from "../../../store";
import "../../../Utilities/Extensions/ToNth";
import Modal, { ModalProps } from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";
import CustomButton from "../../CustomButton/CustomButton";
import TextWithIcon from "../../TextWithIcon/TextWithIcon";
import { Ingredient } from "../../../Utilities/Classes/Recipe";
import { MainActions, MainStateProps } from "../../../MainState";
import REGEX_PATTERNS from "../../../Utilities/Constants/RegexPatterns";

import "./AddRecipeForm.scss";

import plus_icon from "../../../Assets/Icons/plus.svg";
import minus_icon from "../../../Assets/Icons/minus.svg";
import delete_icon from "../../../Assets/Icons/delete.svg";
import fork_and_knife_icon from "../../../Assets/Icons/fork_and_knife.svg";
import trash_icon from "../../../Assets/Icons/trash_can.svg";

type AddRecipeFormProps = Pick<ModalProps, "isOpen" | "setIsOpen">;

export default function AddRecipeForm({
    isOpen,

    setIsOpen,
}: AddRecipeFormProps): React.ReactElement {
    const Dispatcher = useDispatch();
    const MainState = useSelector<StoreType, MainStateProps>(state => state.main);

    const [recipeName, setRecipeName] = useState("");
    const [recipeMinutes, setRecipeMinutes] = useState(0);
    const [recipeIngredients, setRecipeIngredients] = useState<Array<Ingredient>>(null);

    function OnSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        Dispatcher(MainActions.AddRecipe({
            name: recipeName,
            publisher: MainState.loggedUser.username,
            extraInformation: {
                cookingTime: recipeMinutes,
                ingredients: recipeIngredients,
            },
        }));

        setIsOpen(false);

        setRecipeName("");
        setRecipeMinutes(0);
        setRecipeIngredients(null);
    }

    return (
        <Modal
            id="add-recipe-form"

            isForm
            method="POST"
            isOpen={isOpen}
            action="../../../../index.html"

            setIsOpen={setIsOpen}
            events={{
                onSubmit: OnSubmit,
                onReset: _ => (setRecipeName(""), setRecipeIngredients(null), setRecipeMinutes(0)),
            }}
        >
            <h2>Add Recipe</h2>

            <InputFieldContainer
                recipeName={recipeName}
                recipeMinutes={recipeMinutes}
                recipeIngredients={recipeIngredients}

                setRecipeName={setRecipeName}
                setRecipeMinutes={setRecipeMinutes}
                setRecipeIngredients={setRecipeIngredients}
            />

            <ButtonDisplayer setIsOpen={setIsOpen} />
        </Modal>
    );
}

type InputFieldContainerProps = {
    recipeName: string;
    recipeMinutes: number;
    recipeIngredients: Array<Ingredient>;

    setRecipeName: React.Dispatch<React.SetStateAction<string>>;
    setRecipeMinutes: React.Dispatch<React.SetStateAction<number>>;
    setRecipeIngredients: React.Dispatch<React.SetStateAction<Array<Ingredient>>>;
};

function InputFieldContainer({
    recipeMinutes,
    recipeName,
    recipeIngredients,

    setRecipeMinutes,
    setRecipeName,
    setRecipeIngredients,
}: InputFieldContainerProps): React.ReactElement {
    return (
        <main>
            <CustomInput
                isRequired
                type="text"
                isTransparent
                placeholder="Name"
                value={recipeName}
                isPlaceholderAlwaysShown
                pattern={REGEX_PATTERNS.username}
                title="Cannot have consecutive special characters, and special characters that are not (_-.)."

                events={{ onChange: e => setRecipeName(e.target.value) }}
            />

            <CustomInput
                isRequired
                type="number"
                isTransparent
                placeholder="Cooking Time"
                isPlaceholderAlwaysShown
                value={recipeMinutes.toString()}
                title="Cannot have consecutive special characters, and special characters that are not (_-.)."

                events={{ onChange: e => setRecipeMinutes(Number.parseFloat(e.target.value)) }}
            />

            <IngredientInputFieldContainer
                recipeIngredients={recipeIngredients}

                setRecipeIngredients={setRecipeIngredients}
            />
        </main>
    );
}

type IngredientInputFieldContainerProps = {
    recipeIngredients: Array<Ingredient>;

    setRecipeIngredients: React.Dispatch<React.SetStateAction<Array<Ingredient>>>;
};

function IngredientInputFieldContainer({
    recipeIngredients,

    setRecipeIngredients,
}: IngredientInputFieldContainerProps): React.ReactElement {
    return (
        <section id="ingredient-input-field-container">
            <main> {
                recipeIngredients?.length ?
                    recipeIngredients.map((_, i) =>
                        <IngredientInputField
                            key={i}

                            index={i}
                            recipeIngredients={recipeIngredients}

                            setRecipeIngredients={setRecipeIngredients}
                        />
                    ) :
                    <TextWithIcon
                        iconURL={fork_and_knife_icon}
                        iconAlt="fork_and_knife_icon"
                        text="No ingredients were added to this recipe yet, try and add some"
                    />
            } </main>

            <div className="button-displayer">
                <CustomButton
                    isStatic
                    isIconOnly
                    isEmphasized
                    iconURL={plus_icon}
                    iconAlt="plus_icon"
                    title="Adds new ingredient"

                    events={{
                        onClick: _ => setRecipeIngredients(previousValue => [
                            ...previousValue ?? [],
                            { description: "", quantity: 0, unit: "" },
                        ]),
                    }}
                />

                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={minus_icon}
                    iconAlt="minus_icon"
                    title="Removes last ingredient"

                    events={{
                        onClick: _ => setRecipeIngredients(previousValue =>
                            previousValue?.length > 0 ? previousValue.slice(0, -1) : previousValue),
                    }}
                />

                <CustomButton
                    isStatic
                    isIconOnly
                    iconURL={trash_icon}
                    iconAlt="trash_icon"
                    title="Clears all ingredients"

                    events={{ onClick: _ => setRecipeIngredients(_ => []) }}
                />
            </div>
        </section>
    );
}

type IngredientInputFieldProps = {
    index: number;
} & IngredientInputFieldContainerProps;

function IngredientInputField({
    index,
    recipeIngredients,

    setRecipeIngredients,
}: IngredientInputFieldProps): React.ReactElement {
    return (
        <div>
            <div className="input-displayer">
                <CustomInput
                    isRequired
                    type="text"
                    isTransparent
                    isPlaceholderAlwaysShown
                    pattern={REGEX_PATTERNS.username}
                    value={recipeIngredients[index].description}
                    placeholder={`${(index + 1).toNth()} Ingredient`}
                    title="Cannot have consecutive special characters, and special characters that are not (_-.)."

                    events={{
                        onChange: e => setRecipeIngredients(previousValue =>
                            previousValue.map((item, i) =>
                                i == index ? { ...recipeIngredients[index], description: e.target.value } : item)),
                    }}
                />

                <CustomInput
                    type="text"
                    isTransparent
                    placeholder="Unit"
                    isPlaceholderAlwaysShown
                    pattern={REGEX_PATTERNS.username}
                    value={recipeIngredients[index].unit}
                    title="Cannot have consecutive special characters, and special characters that are not (_-.)."

                    events={{
                        onChange: e => setRecipeIngredients(previousValue =>
                            previousValue.map((item, i) =>
                                i == index ? { ...recipeIngredients[index], unit: e.target.value } : item)),
                    }}
                />

                <CustomInput
                    isRequired
                    type="number"
                    isTransparent
                    placeholder="Quantity"
                    isPlaceholderAlwaysShown
                    value={recipeIngredients[index].quantity.toString()}

                    events={{
                        onChange: e => setRecipeIngredients(previousValue =>
                            previousValue.map((item, i) =>
                                i == index ? { ...recipeIngredients[index], quantity: Number.parseFloat(e.target.value) } : item)),
                    }}
                />
            </div>

            <CustomButton
                isStatic
                isIconOnly
                iconURL={delete_icon}
                iconAlt="delete_icon"

                events={{
                    onClick: _ => setRecipeIngredients(previousValue =>
                        previousValue.filter((_, i) => i != index)),
                }}
            />
        </div>
    );
}

function ButtonDisplayer({
    setIsOpen,
}: Pick<AddRecipeFormProps, "setIsOpen">): React.ReactElement {
    return (
        <footer className="button-displayer">
            <CustomButton
                isStatic
                text="Add"
                isEmphasized
                type="submit"
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