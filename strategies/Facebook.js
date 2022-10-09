const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Facebook previews 
// ####################################

class Facebook extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Facebook', {
      'enabled': true
    });
  }

  provides() {
    Facebook.self = this;

    return {
      help: 'Detects facebook urls and provides thumbnail preview if not provided',
      provides: {
        'FacebookPreview': {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*?facebook.com\/.*/));
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'To do';
          },
          action: Facebook.self.FacebookPreview,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Facebook']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Facebook']['enabled'];
      }
    }
  }

  async FacebookPreview(message) {
    try {
      if (message.thumbnail != "") return;

      let data = await Facebook.self.getPageOGData(Facebook.self, message.body.replace(/&amp;/g, "&"), 500);

      if (data[1] == null) {
        MessageStrategy.client.reply(message.from, "Sorry no preview", message.id, true);
        return;
      }

      MessageStrategy.client.sendLinkWithAutoPreview(message.from, message.body, data[0], data[1]);
    }
    catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: Facebook
}