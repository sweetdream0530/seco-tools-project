import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import LoginView from "./LoginView";

import { store } from "../../store/index";

// Mock the API call because we use this function in redux-saga authWorker
jest.mock("../../store/auth/helpers", () => ({
    signInRequest: jest.fn(() => true),
}));

// Wrap the LoginView component with the Redux Provider
const renderWithRedux = (component: JSX.Element) => {
    return {
        ...render(<Provider store={store}>{component}</Provider>),
    };
};

describe("Unit tests for LoginView component", () => {
    it("renders the LoginView component", () => {
        renderWithRedux(<LoginView />);

        const pageText = "Enter the password to access this page";
        const title = screen.getByText(pageText);
        const button = screen.getByRole("button");
        const input = screen.getByRole("textbox");
        expect(title).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(input).toBeInTheDocument();
    });

    it("allows entering a value into the input field", () => {
        renderWithRedux(<LoginView />);

        const secretPassword = "Secret Password";
        const input = screen.getByRole("textbox") as HTMLInputElement;
        fireEvent.change(input, { target: { value: secretPassword } });

        expect(input.value).toBe(secretPassword);
    });

    it("Clicking submit button sets isUserLoggedIn to true", async () => {
        renderWithRedux(<LoginView />);
        const button = screen.getByRole("button");
        expect(store.getState().auth.isUserLoggedIn).toBe(false);
        fireEvent.click(button);

        // Wait for the Redux-Saga authenticateUser worker
        // and SET_USER action to complete
        await waitFor(() => {
            expect(store.getState().auth.isUserLoggedIn).toBe(true);
        });
    });
});
