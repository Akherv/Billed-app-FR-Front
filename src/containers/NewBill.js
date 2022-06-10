import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    this.formData = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    e.preventDefault()
    const fileInput = this.document.querySelector(`input[data-testid="file"]`)
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    this.fileName = filePath[filePath.length-1]
    this.formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    this.formData.append('file', file)
    this.formData.append('email', email)

    if (file.type.match(/^image\/(jpg|jpeg|png)$/)) {
      $('#error-message').text('')
      fileInput.classList.remove('invalid')
      this.store
      .bills()
      .create({
        data: this.formData,
        headers: {
          noContentType: true
        }
      })
      .then(({fileUrl, key}) => {
        this.billId = key
        this.fileUrl = fileUrl
      }).catch(error => console.error(error))

    } else {
      $('#error-message').text('Ce format n\'est pas accepté, veuillez inclure un fichier de type .jpg, .jpeg ou .png')
      $('#error-message').css({ color: 'red' })
      return false
    }
  }


  handleSubmit = e => {
    e.preventDefault()
    const fileInput = this.document.querySelector(`input[data-testid="file"]`)
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
 
    if (file.type.match(/^image\/(jpg|jpeg|png)$/)) {
      this.updateBill(bill)
      this.onNavigate(ROUTES_PATH['Bills'])
    } else {
      fileInput.classList.add('invalid')
    }
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}