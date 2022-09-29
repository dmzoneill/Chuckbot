const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Feature Enablement
// ####################################

class Feature extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Feature'] = {
      enabled: true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Feature provides the ability to mangage the state of features."
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['feature list', 'feature enable (.*)', 'feature disable (.*)']
  }

  handleMessage(message, strategies) {
    this.message = message;

    if (this.message.body.indexOf(" ") == -1) return;

    if (this.message.body.toLowerCase().startsWith("feature")) {
      let parts = this.message.body.split(" ");

      if (parts[1] == "list") {
        MessageStrategy.typing(this.message);
        MessageStrategy.client.sendText(this.message.from, Object.keys(strategies).join("\n"));
      }

      if (parts.length < 3) return;
      if (Object.keys(strategies).includes(parts[2]) == false) return;

      if (parts[1] == "enable") {
        MessageStrategy.typing(this.message);
        MessageStrategy.state[parts[2]]['enabled'] = true;
      }

      if (parts[1] == "disable") {
        MessageStrategy.typing(this.message);
        MessageStrategy.state[parts[2]]['enabled'] = false;
      }
    }
  }
}


module.exports = {
  MessageStrategy: Feature
}