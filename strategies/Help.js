const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Help
// ####################################

class Help extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Help', {
      'enabled': true
    });
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
      let cnt = 0;
      Object.keys(strategies).forEach(key => {
        help += "*" + key + "*\n";
        help += "  | - help " + key + "\n";

        strategies[key].provides().forEach(term => {
          help += "  | - " + term + "\n";
        });

        // if(Array.isArray(strategies[key].provides())) {
        //   strategies[key].provides().forEach(term => {
        //     help += "  | - " + term + "\n";
        //   });
        // } else {
        //   let actions = strategies[key].provides();
        //   let keys = Object.keys(actions);
        //   for (let y = 0; y < keys.length; y++) {
        //     help += "  | - " + keys[y] + "\n";
        //   }
        // }

        help += "";
        cnt += 1;
        if (cnt % 6 == 0) {
          MessageStrategy.client.sendText(this.message.from, help.trim());
          help = "";
        }
      });
      if (help != "") {
        MessageStrategy.client.sendText(this.message.from, help.trim());
      }
      return true;
    }

    if (this.message.body.toLowerCase().startsWith("help")) {
      MessageStrategy.typing(this.message);
      let parts = this.message.body.split(" ");
      let feature = parts[1].toLowerCase();

      Object.keys(strategies).forEach(key => {
        if (key.toLowerCase() == feature) {
          strategies[key].describe(this.message, strategies);
        }
      });

      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Help
}