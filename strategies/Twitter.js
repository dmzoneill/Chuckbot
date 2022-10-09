const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// twitter previews 
// ####################################

class Twitter extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Twitter', {
      'enabled': true
    });
  }

  provides() {
    Twitter.self = this;

    return {
      help: 'Detects twitter urls and provides thumbnail preview if not provided',
      provides: {
        'Twitter': {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*?twitter.com\/.*/));
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Gets the Twitter for a given place';
          },
          action: function PostPreview(message) {
            Twitter.self.PostPreview(message);
            return true;
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Twitter']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Twitter']['enabled'];
      }
    }
  }

  async PostPreview(message) {
    try {
      let data = await Twitter.self.getPageOGData(Twitter.self, message.body, 500);

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
  MessageStrategy: Twitter
}