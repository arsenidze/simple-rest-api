import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

// import CONTACTS_URL from '../urls.js' TODO: explore imports/require on client side
const CONTACTS_URL = '/api/v1/contacts'

const request = async (url, method = 'GET', data = null) => {
  const options = {}
  let resultData

  if (data) {
    options.body = JSON.stringify(data)
    options.headers = { 'Content-Type': 'application/json' }
  }
  options.method = method

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      resultData = null
    } else {
      const json = await response.json()
      resultData = JSON.parse(json)
    }
  } catch (error) {
    console.error('Error:', error)
    resultData = null
  } finally {
    return resultData
  }
}

var vm = new Vue({
  el: '#app',
  data: {
    form: {
      name: '',
      value: '',
    },
    contacts: [],
  },

  computed: {
    canCreate() {
      return !!this.form.name && !!this.form.value
    },
  },

  async mounted() {
    debugger
    this.contacts = await request(CONTACTS_URL)
  },

  methods: {
    async createContact() {
      const { ...contact } = this.form

      if (!contact.name || !contact.value) {
        return
      }

      const newContact = await request(CONTACTS_URL, 'POST', contact)
      this.contacts.push(newContact)

      this.form.name = ''
      this.form.value = ''
    },
    async markContact(id) {
      debugger
      const contactIndex = this.contacts.findIndex((elem) => elem.id === id)
      const modifiedContact = await request(`${CONTACTS_URL}/${id}`, 'PUT', {
        marked: true,
      })
      this.contacts = this.contacts.map((elem, id) =>
        id === contactIndex ? modifiedContact : elem
      )
    },
    async removeContact(id) {
      debugger
      const contactIndex = this.contacts.findIndex((elem) => elem.id === id)
      this.contacts.splice(contactIndex, 1)
      await request(`${CONTACTS_URL}/${id}`, 'DELETE')
      await request(CONTACTS_URL, 'DELETE', { id })
    },
  },
})
