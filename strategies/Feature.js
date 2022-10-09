const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Feature Enablement
// ####################################

class Feature extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Feature', {
      'enabled': true
    });
  }

  provides() {
    Feature.self = this;

    return {
      help: 'Feature provides the ability to manage the state of features.',
      provides: {
        'list': {
          test: function (message) {
            return message.body.toLowerCase() === 'feature list';
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Feature.self.List,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Feature']['enabled'];
          }
        },
        'enable': {
          test: function (message) {
            return message.body.toLowerCase().startsWith("feature enable");
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Feature.self.Enable,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Feature']['enabled'];
          }
        },
        'disable': {
          test: function (message) {
            return message.body.toLowerCase().startsWith("feature disable");
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: Feature.self.Disable,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Feature']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Feature']['enabled'];
      }
    }
  }

  List(message) {
    MessageStrategy.typing(message);
    MessageStrategy.client.sendText(message.from, Object.keys(MessageStrategy.strategies).join("\n"));
  }

  Enable(message) {
    let parts = message.body.split(" ");
    if (parts.length < 3) return;
    if (Object.keys(MessageStrategy.strategies).includes(parts[2]) == false) return;

    MessageStrategy.typing(message);
    MessageStrategy.state[parts[2]]['enabled'] = true;
    MessageStrategy.client.reply(message.from, parts[2] + '   enabled', message.id, true);
  }

  Disable(message) {
    let parts = message.body.split(" ");
    if (parts.length < 3) return;
    if (Object.keys(MessageStrategy.strategies).includes(parts[2]) == false) return;

    MessageStrategy.typing(message);
    MessageStrategy.state[parts[2]]['enabled'] = false;
    MessageStrategy.client.reply(message.from, parts[2] + ' disabled', message.id, true);
  }
}


module.exports = {
  MessageStrategy: Feature
}