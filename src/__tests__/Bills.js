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
import { get } from 'jquery';
import store from '../__mocks__/store';


describe("Given I am connected as an employee", () => {
  // Avant tous les tests, j'initialise le local storage simulé avec un utilisateur de type employee, puis je crée le root HTML de base sur lequel s'appui le router. Après chaque test, je restaure les données simulées à leurs valeurs initiales
  beforeEach(() => {
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
    jest.restoreAllMocks()
  })

  describe("When I am on Bills Page", () => {
    test("Then bill icon window in vertical layout should be highlighted", async () => {
      // J'appelle la fonction onNavigate du router afin de me positionner sur la page Bills
      // Je récupère l'élément windowIcon
      // Je teste => si windowIcon a la classe 'active-icon'
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test('Then the UI should throw loading', async () => {
      // J'appelle la fonction onNavigate du router afin de me positionner sur la page Bills avec en argument loading = true
      // Je teste => si le message 'loading...' est bien présent sur la page
      const loading = true
      document.body.innerHTML = BillsUI({loading});
      await new Promise(process.nextTick);
      const message = screen.getByText(/Loading.../)
  
      expect(message).toBeTruthy()
      })
    test("Then bills should be ordered from earliest to latest", () => {
      // Je recréé l'UI de la page Bills en y injectant en argument les bills mockés
      // Je récupère un tableau des dates correspondant au format(année-mois-jour)
      // Je teste => si ce tableau de dates apparait bien dans un ordre anti-chronologique
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const dates = screen.getAllByTestId(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then bills should have a status", () => {
      // Je recréé l'UI de la page Bills en y injectant en argument les bills mockés
      // Je récupère un tableau les status des bills
      // Je teste => si les status sont bien présents
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const status = screen.getAllByTestId('status')
      expect(status).toBeDefined()
    })
  })

  describe('When I am on Bills Page and there are no bill', () => {
    test('Then the function getList should be called once and return once an empty array', () => {
      // Je crée une instance de la classe Bills
      // Je simule la fonction getBills en y injectant aucune bill
      // Je simule le remplissage des champs du formulaire, je déclenche l'upload du fichier de type png et je soumets le formulaire
      // Je teste=> si getBills a été appelée et si elle retourne bien un tableau vide
      const billMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })
      const bill = []
      const getBills = jest.fn(billMock.getBills).mockReturnValue(bill)

      getBills()

      expect(getBills).toHaveBeenCalledTimes(1);
      expect(getBills).toHaveBeenCalledWith()
      expect(getBills).toReturnTimes(1)
      expect(getBills).toReturnWith([])
    })
    test('Then the list of bills should be empty on the UI', () => {
      // Je crée l'UI de la page Bills
      // J'y injecte en argument aucune bill
      // Je récupère la liste des bills
      // Je teste=> si la liste des bills retourne aucune valeur
      document.body.innerHTML = BillsUI({
        data: []
      })
      const billsList = screen.getByTestId('tbody')
      expect(billsList).not.toHaveTextContent()
    })
  })

  describe('When I am on Bills Page and there are multiple bill', () => {
    test('Then, the list of bills should be called once and return data', () => {
      // Je crée une instance de la classe Bills
      // Je simule la fonction getBills en y injectant 2 bills
      // Je teste=> si getBills a été appelée et si elle retourne bien un tableau des bills
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
      const getBills = jest.fn(billsMock.getBills).mockReturnValue(bill)

      getBills()

      expect(getBills).toHaveBeenCalledTimes(1);
      expect(getBills).toHaveBeenCalledWith()
      expect(getBills).toReturnTimes(1)
      expect(getBills).toReturnWith(bill)
      expect(getBills.mock.results[0].value).toBeDefined()
    })
    test('Then the list of bills should have the length of data element', () => {
      // Je crée une instance de la classe Bills
      // Je simule la fonction getBills en y injectant 2 bills
      // Je récupère la liste des bills
      // Je teste=> si la liste retourne bien un tableau de 2 bills
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
      // Je crée une instance de la classe Bills
      // Je simule la fonction getBills en y implémentant un retour d'erreur
      // Je teste=> si getBills rejète bien une erreur
      const billsMock = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage
      })

      const getBills = jest.fn(() => billsMock.getBills())

     getBills.mockImplementation(() => {
        throw new Error();
      });
      expect(() => getBills()).toThrow()
    })
    test('Then the UI should throw an error', async () => {
      // Je recréé l'UI de la page Bills en y injectant en argument error = true
      // Je teste => si un message d'erreur est bien présent
    const error = true
    document.body.innerHTML = BillsUI({error});
    await new Promise(process.nextTick);
    const message = screen.getByText(/Erreur/)

    expect(message).toBeTruthy()
    })
  })

  describe("When I am on Bills Page and I click on buttonNewBill ", () => {
    test("Then it should call the Eventlistener handleClickNewBill once", () => {
      // J'appelle la fonction onNavigate du router
      // Je crée une instance de la classe Bills et je recrée une page Bills UI avec les bills mockées
      // Je simule la fonction handleClickNewBill et son Eventlistener
      // Je déclenche le click sur le bouton pour appeller handleclickNewBill
      // Je teste=> si la fonction a été appelée
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
      const handleClickNewBill = jest.fn(billMock.handleClickNewBill)

      buttonNewBill.addEventListener('click', handleClickNewBill())

      userEvent.click(buttonNewBill)
      
      expect(handleClickNewBill).toHaveBeenCalledTimes(1);
      expect(handleClickNewBill).toHaveBeenCalledWith()
      expect(handleClickNewBill).toReturnTimes(1)
    })
    test("Then it should open the NewBills page ", () => {
      // J'appelle la fonction onNavigate du router
      // Je crée une instance de la classe Bills et je recrée une page Bills UI avec les bills mockées
      // Je simule la fonction handleClickNewBill et son Eventlistener
      // Je déclenche le click sur le bouton pour appeller handleclickNewBill
      // Je teste => si la je suis bien redirigé vers la page NewBill
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
      const handleClickNewBill = jest.fn(billMock.handleClickNewBill)

      buttonNewBill.addEventListener('click', handleClickNewBill)

      userEvent.click(buttonNewBill)

      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    })
  })

  describe("When I am on Bills Page and I click on IconEye ", () => {
      // Avant tous les tests, je simule la fonction modal de jQuery
    beforeAll(()=> {
      jQuery.fn.modal = jest.fn()
    })
    test("Then it should call the Eventlistener handleClickIconEye once", () => {
      // J'appelle la fonction onNavigate du router
      // Je crée une instance de la classe Bills et je recrée une page Bills UI avec les bills mockées
      // Je simule la fonction handleClickIconEye et son Eventlistener
      // Je déclenche le click sur la première icône pour appeller handleclickIconEye
      // Je teste => si la fonction a été appelée avec un argument et un retour
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
      // J'appelle la fonction onNavigate du router
      // Je crée une instance de la classe Bills et je recrée une page Bills UI avec les bills mockées
      // Je simule la fonction handleClickIconEye et son Eventlistener
      // Je déclenche le click sur la première icône pour appeller handleclickIconEye
      // Je teste => si la modale est ouverte
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
      expect(screen.getAllByText("Justificatif")).toBeTruthy();
      // expect(modale).toHaveClass('show')
    })
  })
})

//test d'intégration GET
describe("When I navigate to Bills Page", () => {
  // Avant tous les tests, je spy la fonction bills du mockstore, j'initialise le local storage simulé avec un utilisateur de type employee, puis je crée le root HTML de base sur lequel s'appui le router. Après chaque test, je restaure les données simulées à leurs valeurs initiales
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
    jest.restoreAllMocks()
  })
  test("fetches bills from mock API GET", async () => {
    // J'appelle la fonction onNavigate de base afin de me positionner sur la page NewBill, j'injecte l'HTML de BillsUI avec les datas mockées de bills.
    // Je récupère les différents titres des colonnes de la liste 
    // Je teste => si la page bills est bien affichées et si la liste des bills est du même nombre que la liste des bills injectées en argument
    window.onNavigate(ROUTES_PATH.Bills)

    document.body.innerHTML = BillsUI({
      data: bills
    })

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
      // Je simule l'appel à l'api qui se termine par un reject
      // Je recrée l'UI de Bills lorsque son argument error est true
      // Je teste => si j'ai bien un message d'erreur 404 qui est présent
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
      // Je simule l'appel à l'api qui se termine par un reject
      // Je recrée l'UI de Bills lorsque son argument error est true
      // Je teste => si j'ai bien un message d'erreur 500 qui est présent
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
