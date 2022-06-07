/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom/extend-expect'
import {localStorageMock} from "../__mocks__/localStorage.js";
import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import userEvent from '@testing-library/user-event'
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should renders newBills page", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const title = screen.getAllByText('Envoyer une note de frais');
      expect(title).toBeTruthy();
    });

    test("Then it should renders newBill form", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const form = screen.getByTestId('form-new-bill');
      expect(form).toBeTruthy();
    });

    test("Then it should renders an expense type input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputType = screen.getByTestId('expense-type');
      expect(inputType).toBeTruthy();
    });

    test("Then it should renders an expense name input ", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputExpense = screen.getByTestId('expense-name');
      expect(inputExpense).toBeTruthy();
    });

    test("Then it should renders a datepicker input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputDate = screen.getByTestId('datepicker');
      expect(inputDate).toBeTruthy();
    });

    test("Then it should renders an amount input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputAmount = screen.getByTestId('amount');
      expect(inputAmount).toBeTruthy();
    });

    test("Then it should renders a vat input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputVat = screen.getByTestId('vat');
      expect(inputVat).toBeTruthy();
    });

    test("Then it should renders pct input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputPct = screen.getByTestId('pct');
      expect(inputPct).toBeTruthy();
    });


    test("Then it should renders a commentary textarea", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const textareaCommentary = screen.getByTestId('commentary');
      expect(textareaCommentary).toBeTruthy();
    });


    test("Then it should renders a file input", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputFile = screen.getByTestId('file');
      expect(inputFile).toBeTruthy();
    });

    test("Then it should renders submit button", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const submitButton = screen.getByRole('button', {type: /submit/i});
      expect(submitButton).toBeTruthy();
    });

  })

  describe('When I select a file input', () => {
  //   test("Then file input have to be only of type (jpg | jpeg | png)", () => {
  //     const html = NewBillUI();
  //     document.body.innerHTML = html;
  //     const inputFile = screen.getByTestId('file');
  //     expect(inputFile.value).toMatch(/^image\/(jpg|jpeg|png)$/);
  //   });
    test('then if I choose a file of type jpg, handleChangeFile should be call and the type of file should match the pattern validation ', async () => {
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname })
      // }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })
      document.body.innerHTML = NewBillUI();
  
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      inputFile.addEventListener('change', handleChangeFile)
      
      await waitFor(() =>
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.jpg', {type: 'image/jpg'})],
          },
        })
      ) 
      expect(handleChangeFile).toHaveBeenCalled()
  
      expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
    })

    test('then if I choose a file of type jpeg, handleChangeFile should be call and the type of file should match the pattern validation ', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })
      document.body.innerHTML = NewBillUI();
  
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      inputFile.addEventListener('change', handleChangeFile)
      
      await waitFor(() =>
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.jpeg', {type: 'image/jpeg'})],
          },
        })
      ) 
      expect(handleChangeFile).toHaveBeenCalled()
  
      expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
    })

    test('then if I choose a file of type png, handleChangeFile should be call and the type of file should match the pattern validation ', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })
      document.body.innerHTML = NewBillUI();
  
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')

      inputFile.addEventListener('change', handleChangeFile)
      
      await waitFor(() =>
        fireEvent.change(inputFile, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
          },
        })
      ) 
      expect(handleChangeFile).toHaveBeenCalled()
  
      expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
    })

    // test('upload file', () => {
    //   const file = new File(['hello'], 'hello.png', {type: 'image/png'})
    
    //   render(
    //     <div>
    //       <label htmlFor="file-uploader">Upload file:</label>
    //       <input id="file-uploader" type="file" />
    //     </div>,
    //   )
    //   const input = screen.getByLabelText(/upload file/i)
    //   userEvent.upload(input, file)
    
    //   expect(input.files[0]).toStrictEqual(file)
    //   expect(input.files.item(0)).toStrictEqual(file)
    //   expect(input.files).toHaveLength(1)
    // })
///////////////////////
  //   test('then if I choose a file of type other type, handleChangeFile should be call and error is shown on console ', async () => {
  //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  //     window.localStorage.setItem('user', JSON.stringify({
  //       type: 'Employee'
  //     }))

  //     const root = document.createElement("div")
  //     root.setAttribute("id", "root")
  //     document.body.append(root)
  //     router()
  //     window.onNavigate(ROUTES_PATH.NewBill)

  //     const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })
  //     document.body.innerHTML = NewBillUI();
  
  //     const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
  //     const inputFile = screen.getByTestId('file')

  //     inputFile.addEventListener('change', handleChangeFile)
      
  //     await waitFor(() =>
  //       fireEvent.change(inputFile, {
  //         target: {
  //           files: [new File(['(⌐□_□)'], 'chucknorris.pdf', {type: 'image/pdf'})],
  //         },
  //       })
  //     ) 
  //     expect(handleChangeFile).toHaveBeenCalled()
  
  //     expect(inputFile.files[0].type).not.toMatch(/^image\/(jpg|jpeg|png)$/);
  //     expect(inputFile.files).toHaveLength(1)
  //   })
   })

  describe('When I do fill fields in correct format and I click on submit button', () => {
    test('it should call the submit handler', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })

          document.body.innerHTML = NewBillUI();

          const inputType = screen.getByTestId("expense-type");
          inputType.value = "Transports";
          // fireEvent.change(inputType, { target: { value: "Transports" } });
          const inputExpense = screen.getByTestId("expense-name");
          userEvent.type(inputExpense, 'Vol Paris Londres' )
          // fireEvent.change(inputExpense, { target: { value: "Vol Paris Londres" } });
          const inputDate = screen.getByTestId("datepicker");
          fireEvent.change(inputDate, { target: { value: "2022-04-04" } });
          const inputAmount = screen.getByTestId("amount");
          fireEvent.change(inputAmount, { target: { value: 348 } });
          const inputVat = screen.getByTestId("vat");
          fireEvent.change(inputVat, { target: { value: 70 } });
          const inputPct = screen.getByTestId("pct");
          fireEvent.change(inputPct, { target: { value: 20 }});
          const inputCommentary = screen.getByTestId("commentary");
          fireEvent.change(inputCommentary, { target: { value: "..." } });
          const inputFile = screen.getByTestId("file");
          fireEvent.change(inputFile, { target: { files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})] } });

        
          const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
          const formNewBill = screen.getByTestId('form-new-bill')
          const submitButton = screen.getByRole('button', {type: /submit/i});

          formNewBill.addEventListener('submit', handleSubmit)
          //submitButton.addEventListener('click', handleSubmit)
          //userEvent.click(submitButton)
          fireEvent.submit(formNewBill)

          expect(handleSubmit).toHaveBeenCalled()


          // root.setAttribute("id", "root")
          // document.body.append(root)
          // router()
          // window.onNavigate(ROUTES_PATH.Bills)
          // document.body.innerHTML = BillsUI({ data: bills })

          // const title = screen.getAllByText('Mes notes de frais');
          // expect(title).toBeTruthy();

        })
     })
    
})
