const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// State
// ####################################

class State extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('State', {
      'enabled': true
    });
    this.load();
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "State management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['State']
  }

  show() {
    try {
      console.log(JSON.stringify(MessageStrategy.state, null, 2));
    } catch (err) {
      console.log(err);
    }
  }

  save() {
    try {
      let state_json = JSON.stringify(MessageStrategy.state);

      fs.writeFile('state.json', state_json, function (err) {
        try {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  load() {
    try {
      fs.readFile('state.json', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        try {
          let obj = JSON.parse(data);
          if (obj != null) {
            MessageStrategy.state = obj;
          }
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['State']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase().startsWith('state')) {
      if (MessageStrategy.strategies['Rbac'].hasAccess(this.message.sender.id, this.constructor.name) == false) {
        self.client.reply(this.message.from, 'Not for langers like you', this.message.id, true);
        return;
      }
    }

    if (this.message.body.toLowerCase() === 'state save') {      
      this.save();
      return true;
    }

    if (this.message.body.toLowerCase() === 'state load') {
      this.load();
      return true;
    }

    if (this.message.body.toLowerCase() === 'state show') {
      this.show();
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: State
}
