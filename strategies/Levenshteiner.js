const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Levenshteiner distance
// ####################################

class Levenshteiner extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Levenshteiner', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Provides the levenshtein distance between 2 strings"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['levenshtein (.*?) (.*?)']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Levenshteiner']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase().startsWith("levenshtein")) {
      if (this.message.body.indexOf(" ") == -1) {
        return;
      }

      let parts = this.message.body.split(" ");

      if (parts.length < 3) {
        return;
      }

      MessageStrategy.typing(this.message);
      MessageStrategy.client.sendText(this.message.from,
        "levenshtein(" + parts[1] + ", " + parts[2] + ") = " + levenshtein(parts[1], parts[2]).toString());

      return true;
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: Levenshteiner
}