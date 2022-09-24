const express = require('express')
const app = express()
const bodyParser = require('body-parser')


// ####################################
// Listener
// ####################################

class WebInterface {
  
  constructor(client, strategies) {
    this.client = client;
    this.strategies = strategies;
    let key = Object.keys(this.strategies)[0];    
    this.strat_ref = this.strategies[key];
    this.strat_ref.call_update_active_chat_contacts();
  }

  handle(message) {
    try {
      let keys = Object.keys(this.strategies);
      for(let y = 0; y < keys.length; y++) {
        if(this.strategies[keys[y]].handleMessage(message, this.strategies)) {
          return;
        }
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  stop() {
    if(this.server) {
      this.client = null;
      this.strategies = null;      
      this.server.close();
    }
  }

  async launch() {

    await new Promise(r => setTimeout(r, 2000));

    let port = Math.floor(Math.random() * (4000 - 3000 + 1) + 3000);
    let jsonParser = bodyParser.json();
    let urlencodedParser = bodyParser.urlencoded({ extended: false })

    app.use(express.json({extended: true, limit: '1mb'}))

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
        
    app.post('/', (req, res) => {
      res.send('Hello World!');
    });

    app.get('/get_contacts', (req, res) => {
      res.send(JSON.stringify(this.strat_ref.get_contacts().sort()));
    });

    app.get('/get_contacts_verbose', (req, res) => {
        res.send(JSON.stringify(this.strat_ref.get_contacts_verbose().sort()));
    });


    app.get('/get_groups', (req, res) => {
      res.send(JSON.stringify(this.strat_ref.get_groups().sort()));
    });
  
    app.get('/get_groups_verbose', (req, res) => {
      res.send(JSON.stringify(this.strat_ref.get_groups_verbose().sort()));
    });

    app.post('/send_message', urlencodedParser, (req, res) => {
      
      const { contact, message } = req.body;
      
      let msg = {
        "from": contact,
        "body": message,
        "thumbnail": "",
        "id": false, 
        "sender": {
          "id": false
        }
      }

      this.handle(msg);

      let logline = "Sending \"" + message + "\" to " + contact;      
      // this.client.sendText(contact, message);
      // console.log(logline);
      res.send(logline);
    });
       
    this.server = app.listen(port, () => {
      console.log("\n==============================================\n");
      console.log(`Example app listening on port ${port}`);
      console.log("\n==============================================\n\n");
    });        
  }
}

module.exports = {
  Web: WebInterface
}
