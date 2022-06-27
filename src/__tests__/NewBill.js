/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { screen, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"

import {localStorageMock} from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store"
jest.mock("../app/store", () => mockStore)
import router from "../app/Router.js";
import store from '../app/store'


describe(" Given I am connected as an employee", () => {
  describe("When I land on NewBill Page", () => {
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
    test("Then it should renders newBills page", () => {
      // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, puis je récupère le titre attendu de la page afin de vérifier qu'il éxiste.
      window.onNavigate(ROUTES_PATH.NewBill)
      const title = screen.getAllByText('Envoyer une note de frais');
      expect(title).toBeTruthy();
    });
    test("Then bill icon mail in vertical layout should be highlighted", () => {
      // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, puis je récupère l'élément mailIcon afin de vérifier s'il a la classe 'active-icon'.
      window.onNavigate(ROUTES_PATH.NewBill)
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toHaveClass('active-icon')
    })
    test("Then it should renders the form and all inputs", () => {
      // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, puis je récupère le formulaire ainsi que l'ensemble des champs, afin de vérifier qu'ils éxistent.
      window.onNavigate(ROUTES_PATH.NewBill)
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
      // J'initialise le test sur l'HTML correspondant à l'UI de la page NewBills, puis je récupère l'élément inputFile afin de vérifier qu'il possède bien les attributs filtrant le type accepté d'image.
      document.body.innerHTML = NewBillUI();
      const inputFile = screen.getByTestId('file');
      expect(inputFile).toHaveAttribute('accept', 'image/jpg, image/jpeg, image/png');
    });

    describe('Then if I upload or drag a file', () => {
       // Avant chaque tests, je spy la fonction bills du mockstore, j'initialise le local storage simulé avec un utilisateur de type employee, puis je crée le root HTML de base sur lequel s'appui le router. Après chaque test, je restaure les données simulées à leurs valeurs initiales
      beforeEach(() => {
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
        jest.restoreAllMocks()
      })

      test('If file is of type jpg, handleChangeFile should be call and the type of file should match the pattern validation', () => {
        // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
        // Je simule la méthode handleChangeFile et son eventListener
        // Je déclenche l'upload du fichier de type jpg
        // Je teste => si handleChangeFile a été appelée, si 1 seul fichier a été soumis et si la classe 'invalid' est absente.
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
  
        inputFile.addEventListener('change', handleChangeFile)

        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.jpg', {
          type: 'image/jpg'
        }))

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(inputFile).not.toHaveClass('invalid')
      })
      test('If file is of type jpeg, handleChangeFile should be call and the type of file should match the pattern validation ', () => {
        // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
        // Je simule la méthode handleChangeFile et son eventListener
        // Je déclenche l'upload du fichier de type jpeg
        // Je teste => si handleChangeFile a été appelée, si 1 seul fichier a été soumis, si la classe 'invalid' est absente.
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

        inputFile.addEventListener('change',handleChangeFile)

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
        // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
        // Je simule la méthode handleChangeFile et son eventListener
        // Je déclenche l'upload du fichier de type png
        // Je teste => si handleChangeFile a été appelée, si 1 seul fichier a été soumis, si la classe 'invalid' est absente.
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

        inputFile.addEventListener('change', handleChangeFile)

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
        // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
        // Je simule la méthode handleChangeFile, son eventListener et je récupère l'élément HTML errorMessage.
        // Je déclenche l'upload du fichier de type pdf
        // Je teste => si handleChangeFile a été appelée, si 1 seul fichier a été soumis, si la classe 'invalid' est présente.
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

        inputFile.addEventListener('change', handleChangeFile)

        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.pdf', {
          type: 'application/pdf'
        }))

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).not.toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(errorMessage.textContent).not.toBeNull()
      })
      test('If an error occur while calling handleChangeFile on the API', async () => {
        // J'appelle la fonction onNavigate du router afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
        // Je simule la méthode handleChangeFile, son eventListener, je récupère l'élément errorMessage et j'implémente une promesse rejetée lors de l'appel à la fonction create
        // Je déclenche l'upload du fichier de type pdf
        // Je teste => si handleChangeFile a été appelée, si 1 seul fichier a été soumis, si un message d'erreur est présent
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

        inputFile.addEventListener('change', handleChangeFile)

        const rejectUpdateMock =  mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error("Erreur"))
              }
          }
        })
      
      
        userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.pdf', {
          type: 'application/pdf'
        }))
        rejectUpdateMock()

        expect(handleChangeFile).toHaveBeenCalled()
        expect(handleChangeFile).toHaveBeenCalledTimes(1)
        expect(inputFile.files[0].type).not.toMatch(/^image\/(jpg|jpeg|png)$/);
        expect(inputFile.files.length).toBe(1);
        expect(errorMessage.textContent).not.toBeNull()
        expect(rejectUpdateMock).toHaveBeenCalled()
      })
    })
  })

  describe('When I do fill fields and I click on submit button', () => {
    // Avant chaque tests,je spy la fonction bills du mockstore, j'initialise le local storage simulé avec un utilisateur de type employee, puis je crée le root HTML de base sur lequel s'appui le router. Après chaque test, je restaure les données simulées à leurs valeurs initiales
    beforeEach(() => {
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
      jest.restoreAllMocks()
    })

    test('If fields is in correct format, it should call the submit handler', () => {
      // J'inclu la fonction simulée onNavigate afin de gérer les changements de pages, j'appelle la fonction onNavigate de base afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
      // Je simule la méthode handleChangeFile, je spy handleSubmit et leurs eventListeners
      // Je simule le remplissage des champs du formulaire, je déclenche l'upload du fichier de type png et je soumets le formulaire
      // Je teste => si handleSubmit a été appelée, si la classe 'invalid' est absente et si la page est redirigée vers Bills
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };
     
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
      newBill.handleSubmit = jest.fn().mockResolvedValue({});

      inputFile.addEventListener('change', handleChangeFile)
      formNewBill.addEventListener('submit', handleSubmit)

      userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.png', {
        type: 'image/png'
      }))
      fireEvent.submit(formNewBill)
      
      expect(handleSubmit).toHaveBeenCalled()
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(inputFile).not.toHaveClass('invalid')
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
    test('If fields is in incorrect format, it should not call the submit handler and add an invalid class border', () => {
      // J'inclu la fonction simulée onNavigate afin de gérer les changements de pages, j'appelle la fonction onNavigate de base afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
      // Je simule la méthode handleChangeFile, je spy handleSubmit et leurs eventListeners
      // Je simule le remplissage des champs du formulaire, je déclenche l'upload du fichier de type png et je soumets le formulaire
      // Je teste => si handleSubmit a été appelée, si la classe 'invalid' est présente et si la page n'a pas été redirigée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };
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
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
    test('If an error occur while calling handleSubmit on the API', async () => {
      // J'inclu la fonction simulée onNavigate afin de gérer les changements de pages, j'appelle la fonction onNavigate de base afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
      // Je simule la méthode handleChangeFile, je spy handleSubmit et leurs eventListeners
      // Je simule le remplissage des champs du formulaire, je déclenche l'upload du fichier de type png et je soumets le formulaire
      // Je teste => si handleSubmit et rejectUpdateMock ont été appelé.
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };
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

      inputFile.addEventListener('change', handleChangeFile)
      formNewBill.addEventListener('submit', handleSubmit)


     const rejectUpdateMock =  mockStore.bills.mockImplementationOnce(() => {
        return {
          create: () => {
            return Promise.resolve({fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'})
            },
          update: () => {
            return Promise.reject(new Error("Erreur"))
          }
        }
      })

      userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.png', {
        type: 'image/png'
      }))
      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(rejectUpdateMock).toHaveBeenCalled()
    })
  })

  // test d'intégration POST
  describe("When I send a NewBill", () => {
      // Avant tous les tests, je spy la fonction bills du mockstore, j'initialise le local storage simulé avec un utilisateur de type employee, puis je crée le root HTML de base sur lequel s'appui le router. Après chaque test, je restaure les données simulées à leurs valeurs initiales
    beforeEach(() => {
      jest.spyOn(store, "bills")
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
    test("create a new bills from mock API POST", async () => {
      // J'inclu la fonction simulée onNavigate afin de gérer les changements de pages, j'appelle la fonction onNavigate de base afin de me positionner sur la page NewBill, je crée une instance de la classe NewBill et j'injecte l'HTML de NewBillsUI.
      // Je simule la méthode handleChangeFile, je spy handleSubmit et leurs eventListeners
      // Je simule le remplissage des champs du formulaire, je déclenche l'upload du fichier de type jpg et je soumets le formulaire
      // Je teste => si handleChangeFile,handleSubmit et l'api mockée ont été appelée et si la page est redirigée vers Bills
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };
      window.onNavigate(ROUTES_PATH.NewBill)

      const newBill = new NewBill({ document, onNavigate, store:mockStore, localStorage: window.localStorage })

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
      newBill.fileName = 'testFile'
      newBill.fileUrl = 'https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a'
      const email = 'e@e'

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
    const formNewBill = screen.getByTestId('form-new-bill')

    mockStore.bills.mockImplementation(()=> {
      return {
        create: () => {
          return Promise.resolve({fileUrl: `${newBill.fileUrl}`, key: '1234'})
        },
        update: () => {
          return Promise.resolve({
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
          })
        }
      }
    })

    inputFile.addEventListener('change', handleChangeFile)
    formNewBill.addEventListener('submit', handleSubmit)

    userEvent.upload(inputFile, new File(['(--[IMG]--)'], 'testFile.jpg', {
      type: 'image/jpg'
    }))
    fireEvent.submit(formNewBill)

    expect(handleChangeFile).toHaveBeenCalled()
    expect(handleChangeFile).toBeCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalled()
    expect(handleSubmit).toBeCalledTimes(1)
    expect(mockStore.bills).toHaveBeenCalled()
    expect(mockStore.bills).toHaveBeenCalledTimes(2)
    expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    })
    describe("When an error occurs on API", () => {
      test("fetches bills from an API and fails with 404 message error", async () => {
      // Je simule l'appel à l'api qui se termine par un reject
      // Je recrée l'UI de Bills lorsque son paramètre error est true
      // Je teste => si j'ai bien un message d'erreur 404 qui est présent
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
           return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      document.body.innerHTML = BillsUI({error: "Erreur 404"});
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 404/)

      expect(message).toBeTruthy()
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
      // Je simule l'appel à l'api qui se termine par un reject
      // Je recrée l'UI de Bills lorsque son paramètre error est true
      // Je teste => si j'ai bien un message d'erreur 500 qui est présent
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
           return Promise.reject(new Error("Erreur 500"))
          }
        }
      })
      document.body.innerHTML = BillsUI({error: "Erreur 500"});
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 500/)

      expect(message).toBeTruthy()
      })
    })
  })
})