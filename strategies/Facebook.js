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
        'Preview': {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*?facebook.com\/.*/));
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Does the image preview lookup';
          },
          action: Facebook.self.Preview,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Facebook']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Facebook']['enabled'];
      }
    }
  }

  async Preview(message) {
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