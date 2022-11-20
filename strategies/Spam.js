const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Spam protection
// ####################################

class Spam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static tracker = {}
  static banned = {}
  static self = null;

  constructor() {
    super('Spam', {
      'enabled': true
    });
  }

  provides() {
    Spam.self = this;

    return {
      help: 'Manages spam attempts on the bot',
      provides: {
        'Spam': {
          test: function (message) {
            return Spam.self.Spam(message);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Spam.self.Spam,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Spam']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Spam']['enabled'];
      }
    }
  }

  Spam(message) {
    let spammer = message.chatId + " - " + message.sender.id;

    if (spammer in Spam.banned) {
      if (Spam.banned[spammer] + 1800 > Date.now() / 1000) {
        MessageStrategy.client.sendText(message.sender.id, "Jesus loves you");
        return true;
      }
      delete Spam.banned[spammer];
      delete Spam.tracker[spammer];
    }

    let keywords = [];
    let keycheck = false;

    Object.keys(MessageStrategy.strategies).forEach(key => {
      let provides = MessageStrategy.strategies[key].provides();
      if (Object.keys(provides).indexOf('provides') == -1) {
        return;
      }
      let actions = provides.provides;
      let keys = Object.keys(actions);
      for (let y = 0; y < keys.length; y++) {
        if (actions[keys[y]].interactive) {
          if (actions[keys[y]].test(message)) {
            keycheck = true;
          }
        }
        keywords.push(keys[y].toLowerCase());
      }
    });

    if (keycheck == false) {
      return false;
    }

    if ((spammer in Spam.tracker) == false) {
      Spam.tracker[spammer] = [];
      Spam.tracker[spammer].push(Date.now() / 1000);
      return false;
    }

    if (Spam.tracker[spammer].length < 6) {
      Spam.tracker[spammer].push(Date.now() / 1000);
      return false;
    }

    if (Spam.tracker[spammer].length > 5) {
      Spam.tracker[spammer].shift();
    }

    if (Spam.tracker[spammer][0] + 15 > Spam.tracker[spammer][4]) {
      Spam.banned[spammer] = Date.now() / 1000;
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Spam
}