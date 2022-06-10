
const jsonOrThrowIfError = async (response) => {
  if(!response.ok) throw new Error((await response.json()).message)
  return response.json()
}

class Api {
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }
  async get({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'GET'}))
  }
  async post({url, data, headers}) {
   const res = await fetch(`${this.baseUrl}${url}`, {headers, method: 'POST', body: data})
    return jsonOrThrowIfError(res)
  }
  async delete({url, headers}) {
    const res = await fetch(`${this.baseUrl}${url}`, {headers, method: 'DELETE'})
    console.log(res)
    return jsonOrThrowIfError(res)
  }
  async patch({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'PATCH', body: data}))
  }
}

const getHeaders = (headers) => {
  const h = { }
  if (!headers.noContentType) h['Content-Type'] = 'application/json'
  const jwt = localStorage.getItem('jwt')
  if (jwt && !headers.noAuthorization) h['Authorization'] = `Bearer ${jwt}`
  return {...h, ...headers}
}

class ApiEntity {
  constructor({key, api}) {
    this.key = key;
    this.api = api;
  }
  async select({selector, headers = {}}) {
    return await (this.api.get({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
  async list({headers = {}} = {}) {
    return await (this.api.get({url: `/${this.key}`, headers: getHeaders(headers)}))
  }
  async update({data, selector, headers = {}}) {
    return await (this.api.patch({url: `/${this.key}/${selector}`, headers: getHeaders(headers), data}))
  }
  async create({data, headers = {}}) {
    const res = await (this.api.post({url: `/${this.key}`, headers: getHeaders(headers), data}))
    return res
  }
  async delete({selector, headers = {}}) {
    const res = await (this.api.delete({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
    return res
  }
}



class Store {
  constructor() {
    this.api = new Api({baseUrl: 'http://localhost:5678'})
  }

  user = uid => (new ApiEntity({key: 'users', api: this.api})).select({selector: uid})
  users = () => new ApiEntity({key: 'users', api: this.api})
  login = (data) => this.api.post({url: '/auth/login', data, headers: getHeaders({noAuthorization: true})})

  ref = (path) => this.store.doc(path)

  bill = bid => (new ApiEntity({key: 'bills', api: this.api})).select({selector: bid})
  billClean = bid => (new ApiEntity({key: 'bills', api: this.api})).delete({selector: bid})
  bills = () => new ApiEntity({key: 'bills', api: this.api})
}

export default new Store()