/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import ErrorPage from "../views/ErrorPage.js"


describe('Given I am connected on app (as an Employee or an HR admin)', () => {
  describe('When ErrorPage is called without and error in its signature', () => {
    test(('Then, it should render ErrorPage with no error message'), () => {
      document.body.innerHTML = ErrorPage()
      expect(screen.getAllByText('Erreur')).toBeTruthy()
      expect(screen.getByTestId('error-message').innerHTML.trim().length).toBe(0)
    })
  })
  describe('When ErrorPage is called with error message in its signature', () => {
    test(('Then, it should render ErrorPage with its error message'), () => {
      const error = 'Erreur de connexion internet'
      document.body.innerHTML = ErrorPage(error)
      expect(screen.getAllByText(error)).toBeTruthy()
    })
  })
})