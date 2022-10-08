const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Urban dictionary
// ####################################

class UrbanDictionary extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('UrbanDictionary', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Provides a random urban dictionary slang word"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return [
      'Urban'
    ]; 
  }

  async postUrbanQuote(self) {
    ud.random().then((results) => {
      var workd = "*" + results[0]['word'];
      workd += "*\n\n";
      workd += "*Definition:* " + results[0]['definition'];
      workd += "\n\n";
      workd += "*Example:* " + results[0]['example'];
      MessageStrategy.typing(self.message);
      self.client.sendText(self.message.from, workd);
    }).catch((error) => {
      console.error(`random (promise) - error ${error.message}`)
    });
  }

  handleMessage(message) {
    if (MessageStrategy.state['UrbanDictionary']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.toLowerCase().startsWith('urban')) {
      this.postUrbanQuote(self);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: UrbanDictionary
}