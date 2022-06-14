/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"

import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store"
jest.mock("../app/store", () => mockStore)
import router from "../app/Router.js";
import { bills } from '../fixtures/bills.js'


describe.only(" Given I am connected as an employee", () => {
  describe("When I land on NewBill Page", () => {
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
    afterEach(() => {
      jest.clearAllMocks
    })
    test("Then it should renders newBills page", () => {
      window.onNavigate(ROUTES_PATH.NewBill)
      const title = screen.getAllByText('Envoyer une note de frais');
      expect(title).toBeTruthy();
    });
    test("Then bill icon mail in vertical layout should be highlighted", () => {
      window.onNavigate(ROUTES_PATH.NewBill)
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toHaveClass('active-icon')
    })
    test("Then it should renders the form and all inputs", () => {
      document.body.innerHTML = NewBillUI();
      const form = screen.getByTestId('form-new-bill');
      const inputType = screen.getByTestId('expense-type');
      const inputExpense = screen.getByTestId('expense-name');
      const inputDate = screen.getByTestId('datepicker');
      const inputAmount = screen.getByTestId('amount');
      const inputVat = screen.getByTestId('vat');
      const inputPct = screen.getByTestId('pct');
      const textareaCommentary = screen.getByTestId('commentary');
      const inputFile = screen.getByTestId('file');
      const submitButton = screen.getByRole('button', {
        type: /submit/i
      });

      expect(form).toBeTruthy();
      expect(inputType).toBeTruthy();
      expect(inputExpense).toBeTruthy();
      expect(inputDate).toBeTruthy();
      expect(inputAmount).toBeTruthy();
      expect(inputVat).toBeTruthy();
      expect(inputPct).toBeTruthy();
      expect(textareaCommentary).toBeTruthy();
      expect(inputFile).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });
  })

  describe('When I select a file input', () => {
    test("Then file input can only be of type (jpg | jpeg | png)", () => {
      document.body.innerHTML = NewBillUI();
      const inputFile = screen.getByTestId('file');
      expect(inputFile).toHaveAttribute('accept', 'image/jpg, image/jpeg, image/png');
    });

    describe('Then if I upload or drag a file', () => {
      beforeAll(() => {
        jest.spyOn(mockStore, "bills")
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
      afterEach(() => {
        jest.clearAllMocks
      })

      test('If file is of type jpg, handleChangeFile should be call and the type of file should match the pattern validation', async () => {
        window.onNavigate(ROUTES_PATH.NewBill)

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
        document.body.innerHTML = NewBillUI();

        const file = [{
          "fileUrl": "https://localhost:3456/images/test.jpg",
          "key": "1234"
        }]

        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')
        const createBill = await mockStore.bills().create(file)

        inputFile.addEventListener('change', (e) => handleChangeFile(e))

        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.jpg', {
          type: 'image/jpg'
        }))

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(inputFile).not.toHaveClass('invalid')
        expect(createBill).toEqual({"fileUrl": "https://localhost:3456/images/test.jpg", "key": "1234"})
      })
      test('If file is of type jpeg, handleChangeFile should be call and the type of file should match the pattern validation ', () => {
        window.onNavigate(ROUTES_PATH.NewBill)

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
        document.body.innerHTML = NewBillUI();

        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')

        inputFile.addEventListener('change', (e) => handleChangeFile(e))

        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.jpeg', {
          type: 'image/jpeg'
        }))

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(inputFile).not.toHaveClass('invalid')
      })
      test('If file is of type png, handleChangeFile should be call and the type of file should match the pattern validation ', () => {
        window.onNavigate(ROUTES_PATH.NewBill)

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
        document.body.innerHTML = NewBillUI();

        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')

        inputFile.addEventListener('change', (e) => handleChangeFile(e))

        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.png', {
          type: 'image/png'
        }))

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(inputFile).not.toHaveClass('invalid')
      })
      test('If file is of another type, it should add an error message', () => {
        window.onNavigate(ROUTES_PATH.NewBill)

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
        document.body.innerHTML = NewBillUI();

        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        const inputFile = screen.getByTestId('file')
        const errorMessage = screen.getByTestId('error-message')

        inputFile.addEventListener('change', (e) => handleChangeFile(e))

        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.pdf', {
          type: 'application/pdf'
        }))

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).not.toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(errorMessage.textContent).not.toBeNull()
      })
    })
  })

  describe('When I do fill fields and I click on submit button', () => {
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
    afterEach(() => {
      jest.clearAllMocks
    })

    test('If fields is in correct format, it should not call the submit handler and add an invalid class border', () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI();

      const inputType = screen.getByTestId("expense-type");
      const inputExpense = screen.getByTestId("expense-name");
      const inputDate = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVat = screen.getByTestId("vat");
      const inputPct = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");

      userEvent.type(inputType, 'Transports')
      userEvent.type(inputExpense, 'Vol Paris Londres')
      userEvent.type(inputDate, "2022-04-04");
      userEvent.type(inputAmount, '348');
      userEvent.type(inputVat, '70');
      userEvent.type(inputPct, '20');
      userEvent.type(inputCommentary, "...");

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const handleSubmit = jest.spyOn(newBill, 'handleSubmit')
      const formNewBill = screen.getByTestId('form-new-bill')

      inputFile.addEventListener('change', (e) => handleChangeFile(e))
      formNewBill.addEventListener('submit', handleSubmit)

      userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.png', {
        type: 'image/png'
      }))
      fireEvent.submit(formNewBill)
      
      expect(handleSubmit).toHaveBeenCalled()
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(inputFile).not.toHaveClass('invalid')
    })
    test('If fields is in incorrect format, it should call the submit handler', () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      document.body.innerHTML = NewBillUI();

      const inputType = screen.getByTestId("expense-type");
      const inputExpense = screen.getByTestId("expense-name");
      const inputDate = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVat = screen.getByTestId("vat");
      const inputPct = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");

      userEvent.type(inputType, 'Transports')
      userEvent.type(inputExpense, 'Vol Paris Londres')
      userEvent.type(inputDate, "2022-04-04");
      userEvent.type(inputAmount, '348');
      userEvent.type(inputVat, '70');
      userEvent.type(inputPct, null);
      userEvent.type(inputCommentary, "...");

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const handleSubmit = jest.spyOn(newBill, 'handleSubmit')
      const formNewBill = screen.getByTestId('form-new-bill')

      inputFile.addEventListener('change', (e) => handleChangeFile(e))
      formNewBill.addEventListener('submit', handleSubmit)

      userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.pdf', {
        type: 'application/pdf'
      }))
      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(inputFile).toHaveClass('invalid')
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
    afterEach(()=> {
      jest.clearAllMocks
    })
    test("create bills from mock API POST", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store : mockStore, localStorage: window.localStorage })

      document.body.innerHTML = NewBillUI();

      const inputType = screen.getByTestId("expense-type");
      const inputExpense = screen.getByTestId("expense-name");
      const inputDate = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVat = screen.getByTestId("vat");
      const inputPct = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");

      userEvent.type(inputType, 'Transports')
      userEvent.type(inputExpense, 'Vol Paris Londres')
      userEvent.type(inputDate, "2022-04-04");
      userEvent.type(inputAmount, '348');
      userEvent.type(inputVat, '70');
      userEvent.type(inputPct, '20');
      userEvent.type(inputCommentary, "...");
      userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.jpeg', {
        type: 'image/jpeg'
      }))
      newBill.fileName = 'testFile'
      newBill.fileUrl = 'https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a'

      const bill = [{
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
      }
      ]

    const handleChangeFile = jest.fn(newBill.handleChangeFile)
    const handleSubmit = jest.spyOn(newBill, 'handleSubmit')
    //const handleSubmit = jest.fn(()=>newBill.handleSubmit)
    const formNewBill = screen.getByTestId('form-new-bill')
    const updateBill = await mockStore.bills().update(bill) 
    //const updateBill = jest.fn(newBill.updateBill)
    //const updateBill = jest.spyOn(newBill, 'updateBill')

    inputFile.addEventListener('change', (e) => handleChangeFile(e))
    formNewBill.addEventListener('submit', (e) => handleSubmit(e))

    userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.jpeg', {
      type: 'image/jpeg'
    }))
    fireEvent.submit(formNewBill)

    // window.onNavigate(ROUTES_PATH.Bills)
    // await new Promise(process.nextTick);

    expect(handleSubmit).toHaveBeenCalled()
    expect(handleSubmit).toBeCalledTimes(1)
    // expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    // expect(updateBill).toHaveBeenCalled();
    // expect(updateBill).toHaveBeenCalledTimes(1);
    expect(updateBill).toEqual({
      "id": "47qAXb6fIm2zOKkLzMro",
      "vat": "80",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      "status": "pending",
      "type": "Hôtel et logement",
      "commentary": "séminaire billed",
      "name": "encore",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2004-04-04",
      "amount": 400,
      "commentAdmin": "ok",
      "email": "a@a",
      "pct": 20
    })

    // expect(updateBill.data.length).toBe(5);

    // const updateBill = mockStore.bills.mockImplementationOnce((bill)=> {
    //   return {
    //     update: () => {
    //       return Promise.resolve(bill)
    //     }
    //   }
    // })
    // updateBill()

    // expect(updateBill).toHaveBeenCalled();
    // expect(updateBill).toHaveBeenCalledTimes(1);
    // expect(updateBill.mock.results[0].value).toEqual({
    //   "id": "47qAXb6fIm2zOKkLzMro",
    //   "vat": "80",
    //   "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
    //   "status": "pending",
    //   "type": "Hôtel et logement",
    //   "commentary": "séminaire billed",
    //   "name": "encore",
    //   "fileName": "preview-facture-free-201801-pdf-1.jpg",
    //   "date": "2004-04-04",
    //   "amount": 400,
    //   "commentAdmin": "ok",
    //   "email": "a@a",
    //   "pct": 20
    // })
    // expect(updateBill.data.length).toBe(5);
    })
    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {
      document.body.innerHTML = BillsUI({error: "Erreur 404"});
      // mockStore.bills.mockImplementationOnce(() => {
      //   return {
      //     update: () => {
      //      return Promise.reject(new Error("Erreur 404"))
      //     }
      //   }
      // })
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 404/)

      expect(message).toBeTruthy()
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
      document.body.innerHTML = BillsUI({error: "Erreur 500"});
      // mockStore.bills.mockImplementationOnce(() => {
      //   return {
      //     update: () => {
      //      return Promise.reject(new Error("Erreur 500"))
      //     }
      //   }
      // })
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 500/)

      expect(message).toBeTruthy()
      })
    })
  })
})