const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Levenshteiner distance
// ####################################

class Levenshteiner extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Levenshteiner', {
      'enabled': true
    });
  }

  provides() {
    Levenshteiner.self = this;

    return {
      help: 'Provides the levenshtein distance between 2 strings',
      provides: {
        'Levenshtein': {
          test: function (message) {
            return message.body.toLowerCase().startsWith("levenshtein");
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Levenshteiner.self.Levenshteiner,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Levenshteiner']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Levenshteiner']['enabled'];
      }
    }
  }

  Levenshteiner(message) {
    if (message.body.indexOf(" ") == -1) {
      return;
    }

    let parts = message.body.split(" ");

    if (parts.length < 3) {
      return;
    }

    MessageStrategy.typing(message);
    MessageStrategy.client.sendText(message.from,
      "levenshtein(" + parts[1] + ", " + parts[2] + ") = " + levenshtein(parts[1], parts[2]).toString());

    return true;
  }
}

module.exports = {
  MessageStrategy: Levenshteiner
}