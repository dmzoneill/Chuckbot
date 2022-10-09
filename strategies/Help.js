const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Help
// ####################################

class Help extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Help', {
      'enabled': true
    });
  }

  provides() {
    Help.self = this;

    return {
      help: 'Detects Help urls and provides thumbnail preview if not provided',
      provides: {
        'Help': {
          test: function (message) {
            return message.body.toLowerCase() === "help";
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Help.self.Help,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Help']['enabled'];
          }
        },
        'HelpFeature': {
          test: function (message) {
            return message.body.toLowerCase().startsWith("help");
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Help.self.HelpFeature,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Help']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Help']['enabled'];
      }
    }
  }

  Help(message) {
    MessageStrategy.typing(message);
    let help = "";
    let cnt = 0;
    Object.keys(MessageStrategy.strategies).forEach(key => {
      help += "*" + key + "*\n";
      help += "  | - help " + key + "\n";

      let actions = MessageStrategy.strategies[key].provides().provides;
      let keys = Object.keys(actions);
      for (let y = 0; y < keys.length; y++) {
        help += "  | - " + keys[y] + "\n";
      }

      help += "";
      cnt += 1;
      if (cnt % 6 == 0) {
        MessageStrategy.client.sendText(message.from, help.trim());
        help = "";
      }
    });
    if (help != "") {
      MessageStrategy.client.sendText(message.from, help.trim());
    }
    return true;
  }

  HelpFeature(message) {
    MessageStrategy.typing(message);
    let parts = message.body.split(" ");
    let feature = parts[1].toLowerCase();

    Object.keys(MessageStrategy.strategies).forEach(key => {
      if (key.toLowerCase() == feature) {
        MessageStrategy.client.sendText(message.from, MessageStrategy.strategies[key].provides().help);
      }
    });
  }
}


module.exports = {
  MessageStrategy: Help
}