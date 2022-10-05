const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Spam protection
// ####################################

class Spam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static tracker = {}
  static banned = {}

  constructor() {
    super('Spam', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Manages spam attempts on the bot"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return []
  }

  handleMessage(message, strategies) {
    if (MessageStrategy.state['Spam']['enabled'] == false) return;

    this.message = message;
    let spammer = this.message.chatId + " - " + this.message.sender.id;

    if (spammer in Spam.banned) {
      if (Spam.banned[spammer] + 1800 > Date.now() / 1000) {
        MessageStrategy.client.sendText(this.message.sender.id, "Jesus loves you");
        return true;
      }
      delete Spam.banned[spammer];
      delete Spam.tracker[spammer];
    }

    let keywords = [];

    Object.keys(strategies).forEach(key => {
      strategies[key].provides().forEach(term => {
        keywords.push(term);
      })
    });

    let keycheck = false;

    for (let i = 0; i < keywords.length; i++) {
      if (this.message.body.toLowerCase().startsWith(keywords[i])) {
        keycheck = true;
      }
    }

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

    if (Spam.tracker[spammer][0] + 10 > Spam.tracker[spammer][4]) {
      Spam.banned[spammer] = Date.now() / 1000;
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Spam
}