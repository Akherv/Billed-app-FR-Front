/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"

import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store"
jest.mock("../app/store", () => mockStore)
import router from "../app/Router.js";


describe(" Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
    })
    test("Then it should renders newBills page", () => {
      document.body.innerHTML = NewBillUI();
      const title = screen.getAllByText('Envoyer une note de frais');
      expect(title).toBeTruthy();
    });
    test("Then bill icon mail in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      //expect(mailIcon.classList.contains('active-icon')).toBe(true)
      expect(mailIcon).toHaveClass('active-icon')
    })
    test("Then it should renders newBill form", () => {
      document.body.innerHTML = NewBillUI();
      const form = screen.getByTestId('form-new-bill');
      expect(form).toBeTruthy();
    });
    test("Then it should renders an expense type input", () => {
      document.body.innerHTML = NewBillUI();
      const inputType = screen.getByTestId('expense-type');
      expect(inputType).toBeTruthy();
    });
    test("Then it should renders an expense name input ", () => {
      document.body.innerHTML = NewBillUI();
      const inputExpense = screen.getByTestId('expense-name');
      expect(inputExpense).toBeTruthy();
    });
    test("Then it should renders a datepicker input", () => {
      document.body.innerHTML = NewBillUI();
      const inputDate = screen.getByTestId('datepicker');
      expect(inputDate).toBeTruthy();
    });
    test("Then it should renders an amount input", () => {
      document.body.innerHTML = NewBillUI();
      const inputAmount = screen.getByTestId('amount');
      expect(inputAmount).toBeTruthy();
    });
    test("Then it should renders a vat input", () => {
      document.body.innerHTML = NewBillUI();
      const inputVat = screen.getByTestId('vat');
      expect(inputVat).toBeTruthy();
    });
    test("Then it should renders pct input", () => {
      document.body.innerHTML = NewBillUI();
      const inputPct = screen.getByTestId('pct');
      expect(inputPct).toBeTruthy();
    });
    test("Then it should renders a commentary textarea", () => {
      document.body.innerHTML = NewBillUI();
      const textareaCommentary = screen.getByTestId('commentary');
      expect(textareaCommentary).toBeTruthy();
    });
    test("Then it should renders a file input", () => {
      document.body.innerHTML = NewBillUI();
      const inputFile = screen.getByTestId('file');
      expect(inputFile).toBeTruthy();
    });
    test("Then it should renders submit button", () => {
      document.body.innerHTML = NewBillUI();
      const submitButton = screen.getByRole('button', {
        type: /submit/i
      });
      expect(submitButton).toBeTruthy();
    });
  })

  describe('When I select a file input', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
    })
    test("Then file input have to be only of type (jpg | jpeg | png)", () => {
      document.body.innerHTML = NewBillUI();
      const inputFile = screen.getByTestId('file');
      expect(inputFile).toHaveAttribute('accept', 'image/jpg, image/jpeg, image/png');
    });
    test('Then if I choose a file of type jpg, handleChangeFile should be call and the type of file should match the pattern validation ', async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })
      document.body.innerHTML = NewBillUI();

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      inputFile.addEventListener('change', handleChangeFile)

      await waitFor(() =>
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['(--[IMG]--)'], 'testFile.jpg', {
              type: 'image/jpg'
            })],
          },
        })
      )
      expect(handleChangeFile).toHaveBeenCalled()

      expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
    })

    test('Then if I choose a file of type jpeg, handleChangeFile should be call and the type of file should match the pattern validation ', async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI();

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      inputFile.addEventListener('change', handleChangeFile)

      await waitFor(() =>
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['(--[IMG]--)'], 'testFile.jpeg', {
              type: 'image/jpeg'
            })],
          },
        })
      )
      expect(handleChangeFile).toHaveBeenCalled()

      expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
    })

    test('Then if I choose a file of type png, handleChangeFile should be call and the type of file should match the pattern validation ', async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })
      document.body.innerHTML = NewBillUI();

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      inputFile.addEventListener('change', handleChangeFile)

      await waitFor(() =>
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['(--[IMG]--)'], 'testFile.png', {
              type: 'image/png'
            })],
          },
        })
      )
      expect(handleChangeFile).toHaveBeenCalled()

      expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
    })
  })

  describe('When I fill fields file with incorrect format and I click on submit button', () => {
    test('it should not call the submit handler and add an invalid class', () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI();

      const inputType = screen.getByTestId("expense-type");
      userEvent.type(inputType, 'Transport')
      const inputExpense = screen.getByTestId("expense-name");
      userEvent.type(inputExpense, 'Vol Paris Londres')
      const inputDate = screen.getByTestId("datepicker");
      userEvent.type(inputDate, "2022-04-04");
      const inputAmount = screen.getByTestId("amount");
      userEvent.type(inputAmount, '348');
      const inputVat = screen.getByTestId("vat");
      userEvent.type(inputVat, '70');
      const inputPct = screen.getByTestId("pct");
      userEvent.type(inputPct, '20');
      const inputCommentary = screen.getByTestId("commentary");
      userEvent.type(inputCommentary, "...");
      const inputFile = screen.getByTestId("file");
      fireEvent.change(inputFile, {
        target: {
          files: [new File(['(--[IMG]--)'], 'testFile.pdf', {
            type: 'application/pdf'
          })]
        }
      });

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      const formNewBill = screen.getByTestId('form-new-bill')

      formNewBill.addEventListener('submit', handleSubmit)

      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(inputFile).toHaveClass('invalid')

    })
  })

  describe('When I do fill fields in correct format and I click on submit button', () => {
    test('it should call the submit handler', () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI();

      const inputType = screen.getByTestId("expense-type");
      userEvent.type(inputType, 'Transports')
      const inputExpense = screen.getByTestId("expense-name");
      userEvent.type(inputExpense, 'Vol Paris Londres')
      const inputDate = screen.getByTestId("datepicker");
      userEvent.type(inputDate, "2022-04-04");
      const inputAmount = screen.getByTestId("amount");
      userEvent.type(inputAmount, '348');
      const inputVat = screen.getByTestId("vat");
      userEvent.type(inputVat, '70');
      const inputPct = screen.getByTestId("pct");
      userEvent.type(inputPct, '20');
      const inputCommentary = screen.getByTestId("commentary");
      userEvent.type(inputCommentary, "...");
      const inputFile = screen.getByTestId("file");
      fireEvent.change(inputFile, {
        target: {
          files: [new File(['(--[IMG]--)'], 'testFile.png', {
            type: 'image/png'
          })]
        }
      });

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      const formNewBill = screen.getByTestId('form-new-bill')

      formNewBill.addEventListener('submit', handleSubmit)

      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  // test d'intégration POST
  describe("When I send a NewBill", () => {
    beforeAll(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
        window,
        'localStorage', {
          value: localStorageMock
        }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "employee@test.tld"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from mock API POST", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })

      document.body.innerHTML = NewBillUI();

      const inputType = screen.getByTestId("expense-type");
      userEvent.type(inputType, 'Transport' )
      const inputExpense = screen.getByTestId("expense-name");
      userEvent.type(inputExpense, 'Vol Paris Londres' )
      const inputDate = screen.getByTestId("datepicker");
      userEvent.type(inputDate, "2022-04-04");
      const inputAmount = screen.getByTestId("amount");
      userEvent.type(inputAmount, '348');
      const inputVat = screen.getByTestId("vat");
      userEvent.type(inputVat, '70');
      const inputPct = screen.getByTestId("pct");
      userEvent.type(inputPct, '20');
      const inputCommentary = screen.getByTestId("commentary");
      userEvent.type(inputCommentary, "...");
      const inputFile = screen.getByTestId("file");
      fireEvent.change(inputFile, { target: { files: [new File(['(--[IMG]--)'], 'testFile.pdf', {type: 'application/pdf'})] } });

      await waitFor(() => screen.getByText("Envoyer une note de frais"))
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
      const typeTitle = screen.getByText("Type de dépense")
      expect(typeTitle).toBeTruthy()
      const nomTitle = screen.getByText("Nom de la dépense")
      expect(nomTitle).toBeTruthy()
      const dateTitle = screen.getByText("Date")
      expect(dateTitle).toBeTruthy()
      const montantTitle = screen.getByText("Montant TTC")
      expect(montantTitle).toBeTruthy()
      const tvaTitle = screen.getByText("TVA")
      expect(tvaTitle).toBeTruthy()
      const commentaireTitle = screen.getByText("Commentaire")
      expect(commentaireTitle).toBeTruthy()
      const justificatifTitle = screen.getByText("Justificatif")
      expect(justificatifTitle).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      // test("fetches bills from an API and fails with 404 message error", async () => {
      //   mockStore.bills.mockImplementationOnce(() => {
      //     return {
      //       list : jest.fn().mockRejectedValue(new Error('Erreur 404')),
      //       create: () => {
      //         return Promise.reject(new Error("Erreur 404"))
      //       }
      //     }
      //   })
      //   window.onNavigate(ROUTES_PATH.Bills)
      //   await new Promise(process.nextTick);
      //   const message = await screen.getByText(/Erreur 404/)
      //   expect(message).toBeTruthy()
      // })

      // test("fetches messages from an API and fails with 500 message error", async () => {
      //   mockStore.bills.mockImplementationOnce(() => {
      //     return {
      //       list : jest.fn().mockRejectedValue(new Error('Erreur 500')),
      //       create : () =>  {
      //         return Promise.reject(new Error("Erreur 500"))
      //       }
      //     }})

      //   window.onNavigate(ROUTES_PATH.Bills)
      //   await new Promise(process.nextTick);
      //   const message = await screen.getByText(/Erreur 500/)
      //   expect(message).toBeTruthy()
      // })
    })
  })
})

