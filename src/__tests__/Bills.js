/**
 * @jest-environment jsdom
 */

 import {screen,waitFor} from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import {bills} from "../fixtures/bills.js"
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js"
 import router from "../app/Router.js";

//  import '@testing-library/jest-dom/extend-expect'
//  import userEvent from "@testing-library/user-event";
//  import Bills  from "../containers/Bills.js"

//  import mockStore from "../__mocks__/store"

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
  document.body.innerHTML = '';
  // window.localStorage.clear();
})
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({data: bills})
      const dates = screen.getAllByTestId(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  // describe("When I am on Bills Page and I click on buttonNewBill ", () => {
  //   beforeEach(() => {
  //     document.body.innerHTML = BillsUI({
  //       data: bills
  //     })
  //   })
  //   test("Then it should call the Eventlistener handleClickNewBill ", () => {
  //     const buttonNewBill = screen.getByTestId('btn-new-bill')
  //     const handleClickNewBill = jest.fn(() => handleClickNewBill)
  //     buttonNewBill.addEventListener('click', handleClickNewBill)
  //     userEvent.click(buttonNewBill)
  //     expect(handleClickNewBill).toHaveBeenCalled();
  //   })

  //   test("Then it should open the NewBills page ", () => {
  //     const buttonNewBill = screen.getByTestId('btn-new-bill')
  //     const handleClickNewBill = jest.fn(() => handleClickNewBill)
  //     // buttonNewBill.addEventListener('click', handleClickNewBill)
  //     userEvent.click(buttonNewBill)
  //     //expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
  //     //URL/////
  //   })

  // })

  // describe("When I am on Bills Page and I click on IconEye ", () => {
  //   beforeEach(() => {
  //     document.body.innerHTML = BillsUI({
  //       data: bills
  //     })
  //   })

  //   test("Then it should open the modale ", () => {
  //     const iconEye = screen.getAllByTestId('icon-eye')
  //     const handleClickIconEye = jest.fn(() => handleClickIconEye)
  //     iconEye[0].addEventListener('click', handleClickIconEye)
  //     userEvent.click(iconEye[0])
  //     const modale = screen.getByTestId('modaleFile')
  //     expect(modale).toBeTruthy()
  //     //expect(modale).toHaveClass('show')
  //   })

  // })

  // describe("When I am on Bills Page and corrupted data are introduced ", () => {
  //   beforeEach(() => {
  //     jest.spyOn(mockStore, "bills")
  //     Object.defineProperty(
  //         window,
  //         'localStorage',
  //         { value: localStorageMock }
  //     )
  //     window.localStorage.setItem('user', JSON.stringify({
  //       type: 'Employee',
  //       email: "e@e"
  //     }))
  //     const root = document.createElement("div")
  //     root.setAttribute("id", "root")
  //     document.body.appendChild(root)
  //     router()
  //   })
  //   test("Then it should ", async () => {
  //     const m = mockStore.bills.mockImplementationOnce(() => {
  //       return {
  //         list : () =>  {
  //           return Promise.reject(new Error("Erreur 404"))
  //         }
  //       }})
  //     window.onNavigate(ROUTES_PATH.Bills)
  //     await new Promise(process.nextTick);
  //     // const message = await screen.getByText(/Erreur 404/)
  //     // expect(message).toBeTruthy()
  //     const store = null
      
  //     const billM = new Bills({ document, onNavigate, store : m, localStorage })
  //     const getbills = billM.getBills

  //     expect(typeof billM.getBills).toBe('function')
  //    expect(getbills).toThrow()
      
    

  //   })
  // })

})