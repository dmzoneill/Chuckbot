const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// State
// ####################################

class State extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('State', {
      'enabled': true
    });
    this.Load();
  }

  provides() {
    State.self = this;

    return {
      help: 'Manages the state of chuck',
      provides: {
        'Show': {
          test: function (message) {
            return message.body.toLowerCase() === 'state show';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Show chuck state';
          },
          action: State.self.Show,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['State']['enabled'];
          }
        },
        'Save': {
          test: function (message) {
            return message.body.toLowerCase() === 'state save';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Save chuck state';
          },
          action: State.self.Save,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['State']['enabled'];
          }
        },
        'Load': {
          test: function (message) {
            return message.body.toLowerCase() === 'state load';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Load chuck state';
          },
          action: State.self.Load,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['State']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['State']['enabled'];
      }
    }
  }

  Show() {
    try {
      console.log(JSON.stringify(MessageStrategy.state, null, 2));
    } catch (err) {
      console.log(err);
    }
  }

  Save() {
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

  Load() {
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
}


module.exports = {
  MessageStrategy: State
}
