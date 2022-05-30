/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should renders newBills page", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const title = screen.getAllByText('Envoyer une note de frais');
      //to-do write assertion
      expect(title).toBeTruthy();
    });

    test("Then it should renders newBill form", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const form = screen.getAllByTestId('form-new-bill');
      //to-do write assertion
      expect(form).toBeTruthy();
    });

    test("Then it should renders an expense type input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputType = screen.getAllByTestId('expense-type');
      //to-do write assertion
      expect(inputType).toBeTruthy();
    });

    test("Then it should renders an expense name input ", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputExpense = screen.getAllByTestId('expense-name');
      //to-do write assertion
      expect(inputExpense).toBeTruthy();
    });

    test("Then it should renders a datepicker input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputDate = screen.getAllByTestId('datepicker');
      //to-do write assertion
      expect(inputDate).toBeTruthy();
    });

    test("Then it should renders an amount input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputAmount = screen.getAllByTestId('amount');
      //to-do write assertion
      expect(inputAmount).toBeTruthy();
    });

    test("Then it should renders a vat input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputVat = screen.getAllByTestId('vat');
      //to-do write assertion
      expect(inputVat).toBeTruthy();
    });

    test("Then it should renders pct input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputPct = screen.getAllByTestId('pct');
      //to-do write assertion
      expect(inputPct).toBeTruthy();
    });


    test("Then it should renders a commentary textarea", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const textareaCommentary = screen.getAllByTestId('commentary');
      //to-do write assertion
      expect(textareaCommentary).toBeTruthy();
    });


    test("Then it should renders a file input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputFile = screen.getAllByTestId('file');
      //to-do write assertion
      expect(inputFile).toBeTruthy();
    });

    test("Then it should renders submit button", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const submitButton = screen.getByRole('button', {type: /submit/i});
      //to-do write assertion
      expect(submitButton).toBeTruthy();
    });

  })

  //functionnalities
  // describe('When I select a file input', () => {
  //   test('then i only can choose file of type (jpg | jpeg | png)', () => {
  //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  //     window.localStorage.setItem('user', JSON.stringify({
  //       type: 'Employee'
  //     }))
  //     const html = NewBillUI();
  //     document.body.innerHTML = html;
  //     const onNavigate = (pathname) => {
  //       document.body.innerHTML = ROUTES({ pathname })
  //     }
  //     const store = null
  //     const inputFile = screen.getAllByTestId('file');
  //     const handleChangeFile = jest.fn(inputFile.handleChangeFile)
  //     inputFile.addEventListener('click', handleChangeFile)
  //     userEvent.click(inputFile)
  //     expect(handleChangeFile).toHaveBeenCalled()

  //     const modale = screen.getByTestId('modaleFileAdmin')
  //     expect(modale).toBeTruthy()
  //   })
  // })


})
