const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Urban dictionary
// ####################################

class UrbanDictionary extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('UrbanDictionary', {
      'enabled': true
    });
  }

  provides() {
    UrbanDictionary.self = this;

    return {
      help: 'Provides a random urban dictionary slang word',
      provides: {
        'urban': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('urban');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Gets the UrbanDictionary word';
          },
          action: function GetQuote(message) {
            UrbanDictionary.self.GetQuote(message);
            return true;
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['UrbanDictionary']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['UrbanDictionary']['enabled'];
      }
    }
  }

  async GetQuote(message) {
    ud.random().then((results) => {
      var workd = "*" + results[0]['word'];
      workd += "*\n\n";
      workd += "*Definition:* " + results[0]['definition'];
      workd += "\n\n";
      workd += "*Example:* " + results[0]['example'];
      MessageStrategy.typing(message);
      MessageStrategy.client.sendText(message.from, workd);
    }).catch((error) => {
      console.error(`random (promise) - error ${error.message}`)
    });
  }
}


module.exports = {
  MessageStrategy: UrbanDictionary
}