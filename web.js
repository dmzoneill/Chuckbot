const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// ####################################
// Listener
// ####################################

class WebInterface {
  message_strategy = null
  server = null

  constructor (MessageStrategy) {
    this.message_strategy = MessageStrategy
  }

  stop () {
    if (this.server) {
      this.server.close()
    }
  }

  async launch (MessageStrategy) {
    try {
      this.message_strategy = MessageStrategy
      this.message_strategy.prototype.call_update_active_chat_contacts()

      await new Promise(r => setTimeout(r, 1000))

      const port = Math.floor(Math.random() * (4000 - 3000 + 1) + 3000)
      const jsonParser = bodyParser.json()
      const urlencodedParser = bodyParser.urlencoded({ extended: false })

      app.use(express.json({ extended: true, limit: '1mb' }))

      app.get('/', (req, res) => {
        res.send('Hello World!')
      })

      app.post('/', (req, res) => {
        res.send('Hello World!')
      })

      app.get('/get_contacts', (req, res) => {
        res.send(JSON.stringify(this.message_strategy.prototype.get_contacts().sort()))
      })

      app.get('/get_contacts_verbose', (req, res) => {
        res.send(JSON.stringify(this.message_strategy.prototype.get_contacts_verbose().sort()))
      })

      app.get('/get_groups', (req, res) => {
        res.send(JSON.stringify(this.message_strategy.prototype.get_groups().sort()))
      })

      app.get('/get_groups_verbose', (req, res) => {
        res.send(JSON.stringify(this.message_strategy.prototype.get_groups_verbose().sort()))
      })

      app.post('/send_message', urlencodedParser, (req, res) => {
        const { contact, message } = req.body

        const msg = {
          from: contact,
          body: message,
          thumbnail: '',
          id: false,
          sender: {
            id: false
          }
        }

        ChuckBot.Strategies.doHandleMessage(ChuckBot.chuck, msg)

        const logline = 'Sending "' + message + '" to ' + contact
        // this.client.sendText(contact, message);
        // console.log(logline);
        res.send(logline)
      })

      this.server = app.listen(port, () => {
        console.log('\n==============================================\n')
        console.log(`Example app listening on port ${port}`)
        console.log('\n==============================================\n\n')
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  Web: WebInterface
}
