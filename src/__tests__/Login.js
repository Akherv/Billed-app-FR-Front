/**
 * @jest-environment jsdom
 */
import { fireEvent, screen } from "@testing-library/dom";

import Login from "../containers/Login.js";

import { ROUTES } from "../constants/routes";
import LoginUI from "../views/LoginUI";


describe("Given that I am a user on login page", () => {

  describe("When I do not fill fields and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const form = screen.getByTestId("form-employee");
      const inputEmailUser = screen.getByTestId("employee-email-input");
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      const handleSubmitEmployee = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmitEmployee);

      fireEvent.submit(form);

      expect(screen.getByTestId("loginTitle")).toBeTruthy();
      expect(screen.getByTestId("form-employee")).toBeTruthy();
      expect(inputEmailUser.value).toBe("");
      expect(inputPasswordUser.value).toBe("");
    });
  });

  describe("When I do fill fields in incorrect format and I click on employee button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const form = screen.getByTestId("form-employee");
      const inputEmailUser = screen.getByTestId("employee-email-input");
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      const handleSubmitEmployee = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmitEmployee);

      fireEvent.change(inputEmailUser, {
        target: {
          value: "pasunemail"
        }
      });
      fireEvent.change(inputPasswordUser, {
        target: {
          value: "azerty"
        }
      });
      fireEvent.submit(form);

      expect(screen.getByTestId("loginTitle")).toBeTruthy();
      expect(screen.getByTestId("form-employee")).toBeTruthy();
      expect(inputEmailUser.value).toBe("pasunemail");
      expect(inputPasswordUser.value).toBe("azerty");
    });
  });

  describe("When I do fill fields in correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an Employee in app", () => {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };
      let PREVIOUS_LOCATION = "";
      const store = jest.fn();
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      document.body.innerHTML = LoginUI();

      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };

      const form = screen.getByTestId("form-employee");
      const inputEmailUser = screen.getByTestId("employee-email-input");
      const inputPasswordUser = screen.getByTestId("employee-password-input");
      const handleSubmitEmployee = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});

      form.addEventListener("submit", handleSubmitEmployee);

      fireEvent.change(inputEmailUser, {
        target: {
          value: inputData.email
        }
      });
      fireEvent.change(inputPasswordUser, {
        target: {
          value: inputData.password
        }
      });
      fireEvent.submit(form);

      expect(inputEmailUser.value).toBe(inputData.email);
      expect(inputPasswordUser.value).toBe(inputData.password);
      expect(handleSubmitEmployee).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });

  // describe("When I do fill fields in correct format and I click on employee button Login In, nut an error occur in API", () => {
  //   test.only("Then it should catch the error", () => {
  //     Object.defineProperty(window, "localStorage", {
  //       value: {
  //         getItem: jest.fn(() => null),
  //         setItem: jest.fn(() => null),
  //       },
  //       writable: true,
  //     });
  //     const onNavigate = (pathname) => {
  //       document.body.innerHTML = ROUTES({
  //         pathname
  //       });
  //     };
  //     let PREVIOUS_LOCATION = "";
  //     const store = jest.fn();
  //     const login = new Login({
  //       document,
  //       localStorage: window.localStorage,
  //       onNavigate,
  //       PREVIOUS_LOCATION,
  //       store,
  //     });

  //     document.body.innerHTML = LoginUI();

  //     const inputData = {
  //       email: "johndoe@email.com",
  //       password: "azerty",
  //     };

  //     const form = screen.getByTestId("form-employee");
  //     const inputEmailUser = screen.getByTestId("employee-email-input");
  //     const inputPasswordUser = screen.getByTestId("employee-password-input");
  //     const handleSubmitEmployee = jest.fn(login.handleSubmitEmployee);

  //     const spy = jest.spyOn(login, 'login')
  //     const isSpying = login.login()

     
  //     form.addEventListener("submit", handleSubmitEmployee);

  //     fireEvent.change(inputEmailUser, {
  //       target: {
  //         value: inputData.email
  //       }
  //     });
  //     fireEvent.change(inputPasswordUser, {
  //       target: {
  //         value: inputData.password
  //       }
  //     });
  //     fireEvent.submit(form);

  //    expect(isSpying).toHaveBeenCalled()
      
  //   });
  //   test("It should renders Bills page", () => {
  //     expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
  //   });
  // });
});

describe("Given that I am a user on login page", () => {
  describe("When I do not fill fields and I click on admin button Login In", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const form = screen.getByTestId("form-admin");
      const inputEmailUser = screen.getByTestId("admin-email-input");
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      const handleSubmitAdmin = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmitAdmin);

      fireEvent.submit(form);

      expect(screen.getByTestId("loginTitle")).toBeTruthy();
      expect(screen.getByTestId("form-admin")).toBeTruthy();
      expect(inputEmailUser.value).toBe("");
      expect(inputPasswordUser.value).toBe("");
    });
  });

  describe("When I do fill fields in incorrect format and I click on admin button Login In", () => {
    test("Then it should renders Login page", () => {
      document.body.innerHTML = LoginUI();

      const form = screen.getByTestId("form-admin");
      const inputEmailUser = screen.getByTestId("admin-email-input");
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      const handleSubmitAdmin = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmitAdmin);

      fireEvent.change(inputEmailUser, {
        target: {
          value: "pasunemail"
        }
      });
      fireEvent.change(inputPasswordUser, {
        target: {
          value: "azerty"
        }
      });
      fireEvent.submit(form);

      expect(screen.getByTestId("loginTitle")).toBeTruthy();
      expect(screen.getByTestId("form-admin")).toBeTruthy();
      expect(inputEmailUser.value).toBe("pasunemail");
      expect(inputPasswordUser.value).toBe("azerty");
    });
  });

  describe("When I do fill fields in correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an HR admin in app", () => {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };
      let PREVIOUS_LOCATION = "";
      const store = jest.fn();
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      document.body.innerHTML = LoginUI();

      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      };

      const form = screen.getByTestId("form-admin");
      const inputEmailUser = screen.getByTestId("admin-email-input");
      const inputPasswordUser = screen.getByTestId("admin-password-input");
      const handleSubmitAdmin = jest.fn(login.handleSubmitAdmin);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmitAdmin);

      fireEvent.change(inputEmailUser, {
        target: {
          value: inputData.email
        }
      });
      fireEvent.change(inputPasswordUser, {
        target: {
          value: inputData.password
        }
      });
      fireEvent.submit(form);

      expect(inputEmailUser.value).toBe(inputData.email);
      expect(inputPasswordUser.value).toBe(inputData.password);
      expect(handleSubmitAdmin).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
    test("It should renders HR dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy();
    });
  });
});