/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"


describe('Given I am connected as an Employee', () => {
  describe('When I am on Bills page and there are bills', () => {
    test(('Then, it should render icon eye'), () => {
      document.body.innerHTML = Actions()
      const iconEye = screen.getByTestId('icon-eye')
      expect(iconEye).toBeTruthy()
      expect(iconEye).toMatchSnapshot()
    })
  })
  describe('When I am on Bills page and there are bills with url for file', () => {
    test(('Then, it should save given url in data-bill-url custom attribute'), () => {
      const url = '/fake_url'
      document.body.innerHTML = Actions(url)
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url)
    })
  })
})