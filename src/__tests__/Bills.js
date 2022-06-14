/**
 * @jest-environment jsdom
 */
 import '@testing-library/jest-dom/extend-expect'
 import {screen, waitFor} from "@testing-library/dom"
 import userEvent from "@testing-library/user-event";

 import Bills from "../containers/Bills.js"
 import BillsUI from "../views/BillsUI.js"

 import { localStorageMock } from "../__mocks__/localStorage.js"
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import mockStore from "../__mocks__/store"
 jest.mock("../app/store", () => mockStore)
 import {bills} from "../fixtures/bills.js"
 import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
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
  // afterEach(() => {
  //   document.body.innerHTML = '';
  // })

  describe("When I am on Bills Page", () => {
    test("Then bill icon window in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const dates = screen.getAllByTestId(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then bills should have a status", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const status = screen.getAllByTestId('status')
      expect(status).toBeDefined()
    })
  })

  describe('When I am on Bills Page and there are no bill', () => {
    test('Then the function getList should be called once and return once an empty array', () => {
      const billMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })
      const bill = []
      const getBills = jest.fn(() => billMock.getBills()).mockReturnValue(bill)

      getBills()

      expect(getBills).toHaveBeenCalledTimes(1);
      expect(getBills).toHaveBeenCalledWith()
      expect(getBills).toReturnTimes(1)
      expect(getBills).toReturnWith([])
    })
    test('Then the list of bills should be empty on the UI', () => {
      document.body.innerHTML = BillsUI({
        data: []
      })
      const billsList = screen.getByTestId('tbody')
      expect(billsList).not.toHaveTextContent()
    })
  })

  describe('When I am on Bills Page and there are multiple bill', () => {
    test('Then, the list of bills should be called once and return data', () => {
      const billsMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })
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
        },
        {
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
      const getBills = jest.fn(() => billsMock.getBills()).mockReturnValue(bill)

      getBills()

      expect(getBills).toHaveBeenCalledTimes(1);
      expect(getBills).toHaveBeenCalledWith()
      expect(getBills).toReturnTimes(1)
      expect(getBills).toReturnWith(bill)
      expect(getBills.mock.results[0].value).toBeDefined()
    })
    test('Then the list of bills should have the length of data element', () => {
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
        },
        {
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
      document.body.innerHTML = BillsUI({
        data: bill
      })

      const billsList = screen.getByTestId('tbody')
      const billsRow = screen.getAllByTestId('row')

      expect(billsList.textContent).toBeDefined()
      expect(billsRow).toHaveLength(2)
    })
  })

  describe('When I am on Bills Page and an error occur', () => {
    test('Then the function getBills should throw an error', async () => {
      const mockBills = {
        handleClickNewBill: jest.fn(),
        handleClickIconEye: jest.fn(),
        getBills: jest.fn(() => {}),

      };
      jest.mock('../containers/Bills.js', () => jest.fn(() => mockBills));

      mockBills.getBills.mockImplementation(() => {
        throw new Error();
      });
      expect(() => mockBills.getBills()).toThrow()
    })
    test('Then the function getBills should throw an error', async () => {
      const mockBills = {
        handleClickNewBill: jest.fn(),
        handleClickIconEye: jest.fn(),
        getBills: jest.fn(() => {}),

      };
      jest.mock('../containers/Bills.js', () => jest.fn(() => mockBills));

      mockBills.getBills.mockImplementation((done) => {
        expect.assertions(2)
        try {
          return bills
          done()
        } catch (e) {
          done.fail(err)
          expect(() => mockBills.getBills()).toThrow()
        }
      });
    })
    test('Then the list of bills should be empty on the UI', () => {
      document.body.innerHTML = BillsUI({
        data: []
      })
      const billsList = screen.getByTestId('tbody')
      expect(billsList).not.toHaveTextContent()
    })
  })

  describe("When I am on Bills Page and I click on buttonNewBill ", () => {
    test("Then it should call the Eventlistener handleClickNewBill once", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        })
      }
      const billMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })

      document.body.innerHTML = BillsUI({
        data: bills
      })

      const buttonNewBill = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(() => billMock.handleClickNewBill)

      buttonNewBill.addEventListener('click', handleClickNewBill())

      userEvent.click(buttonNewBill)
      
      expect(handleClickNewBill).toHaveBeenCalledTimes(1);
      expect(handleClickNewBill).toHaveBeenCalledWith()
      expect(handleClickNewBill).toReturnTimes(1)
      // expect(handleClickNewBill).toReturnWith('...')
    })
    test("Then it should open the NewBills page ", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        })
      }
      const billMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })

      document.body.innerHTML = BillsUI({
        data: bills
      })
      
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(() => billMock.handleClickNewBill)

      buttonNewBill.addEventListener('click', handleClickNewBill())

      userEvent.click(buttonNewBill)

      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    })
  })

  describe("When I am on Bills Page and I click on IconEye ", () => {
    beforeAll(()=> {
      jQuery.fn.modal = jest.fn()
    })
    test("Then it should call the Eventlistener handleClickIconEye once", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        })
      }
      const billMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })

      document.body.innerHTML = BillsUI({
        data: bills
      })

      const iconEye = screen.getAllByTestId('icon-eye')

      const handleClickIconEye = jest.fn(()=>billMock.handleClickIconEye(iconEye[0]))

      iconEye.forEach(icon => {
        icon.addEventListener('click',handleClickIconEye)
      })

      userEvent.click(iconEye[0])

      expect(handleClickIconEye).toHaveBeenCalledTimes(1);
      expect(handleClickIconEye.mock.calls.length).toBe(1)
      expect(handleClickIconEye).toReturnTimes(1)
    })
    test("Then it should open the Modale ", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        })
      }
      const billMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })

      document.body.innerHTML = BillsUI({
        data: bills
      })

      const iconEye = screen.getAllByTestId('icon-eye')
      const handleClickIconEye = jest.fn((icon) => billMock.handleClickIconEye(icon)).
      mockImplementation((icon) => {
        const billUrl = 'https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a'
        const imgWidth = 755
        return `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      })

      iconEye.forEach(icon => {
        icon.addEventListener('click', (icon) => handleClickIconEye(icon))
      })

      userEvent.click(iconEye[0])

      const modale = await waitFor(() => screen.getByTestId('modaleFile'))
      expect(modale).toBeTruthy();
      //expect(modale).toHaveClass('show')
      expect(screen.getAllByText("Justificatif")).toBeTruthy();
    })
  })
})

//test d'intégration GET
describe("When I navigate to Bills Page", () => {
  beforeEach(() => {
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
    document.body.innerHTML = ''
    jest.clearAllMocks
  })
  test("fetches bills from mock API GET", async () => {
    document.body.innerHTML = BillsUI({
      data: bills
    })

    window.onNavigate(ROUTES_PATH.Bills)

    await waitFor(() => screen.getByText("Mes notes de frais"))
    const typeTitle = await waitFor(() => screen.getByText("Type"))
    const NomTitle = await waitFor(() => screen.getByText("Nom"))
    const dateTitle = await waitFor(() => screen.getByText("Date"))
    const MontantTitle = await waitFor(() => screen.getByText("Montant"))
    const statutTitle = await waitFor(() => screen.getByText("Statut"))
    const actionsTitle = await waitFor(() => screen.getByText("Actions"))

    expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    expect(typeTitle).toBeTruthy()
    expect(NomTitle).toBeTruthy()
    expect(dateTitle).toBeTruthy()
    expect(MontantTitle).toBeTruthy()
    expect(statutTitle).toBeTruthy()
    expect(actionsTitle).toBeTruthy()

    const listBill = await mockStore.bills().list()
    expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    expect(listBill.length).toBe(4)
  })
  describe("When an error occurs on API", () => {
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Bills)

      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 404/)

      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      window.onNavigate(ROUTES_PATH.Bills)

      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 500/)

      expect(message).toBeTruthy()
    })
  })
})
