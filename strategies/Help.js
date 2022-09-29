const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Help
// ####################################

class Help extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Help'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Print the list of commands provided by the features.  You can use the feature list to get the name of features and for a further message describing the feature.  e.g help Hi"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['help', 'help feature']
  }

  handleMessage(message, strategies) {
    if (MessageStrategy.state['Help']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === "help") {
      MessageStrategy.typing(this.message);
      let help = "";
      Object.keys(strategies).forEach(key => {
        help += "*" + key + "*\n";
        help += "  | - help " + key + "\n";
        strategies[key].provides().forEach(term => {
          help += "  | - " + term + "\n";
        });
        help += "";
      });
      MessageStrategy.client.sendText(this.message.from, help.trim());
      return true;
    }

    if (this.message.body.toLowerCase().startsWith("help")) {
      MessageStrategy.typing(this.message);
      let parts = this.message.body.split(" ");
      let feature = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      MessageStrategy.client.sendText(this.message.from, strategies[feature].describe(this.message, strategies));
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Help
}