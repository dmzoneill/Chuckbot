const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// google bitch
// ####################################

class Google extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Google', {
      'enabled': true
    });
  }

  provides() {
    Google.self = this;

    return {
      help: 'Provides google url for those too lazy to type it into google',
      provides: {
        'google x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('google');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Does the googling for you';
          },
          action: Google.self.GoogleSearch,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Google']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Google']['enabled'];
      }
    }
  }

  GoogleSearch(message) {
    let search_term = message.body.substring(7).trim();
    MessageStrategy.typing(message);
    MessageStrategy.client.sendLinkWithAutoPreview(message.from, "https://www.google.com/search?q=" + urlencode(search_term));
    return true;
  }
}


module.exports = {
  MessageStrategy: Google
}