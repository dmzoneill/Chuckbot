const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// wikipedia
// ####################################

class Wikipedia extends MessageStrategy {
    static dummy = MessageStrategy.derived.add(this.name);
    
    constructor() {
      super();
      MessageStrategy.state['Wikipedia'] = {
        'enabled': true
      }
    }
  
    describe(message, strategies) {
      this.message = message;
      MessageStrategy.typing(this.message); 
      let description = "Search wikipedia for a given string and provides a link to the page"
      MessageStrategy.client.sendText(this.message.from, description);
    }
  
    provides() {
      return ['wiki (.*)']
    }
  
    handleMessage(message) {
      if(MessageStrategy.state['Wikipedia']['enabled'] == false) return;
  
      this.message = message;
      var self = this;
  
      if(message.body.toLowerCase().startsWith('wiki')) {
        MessageStrategy.typing(self.message);   
        let search_term = this.message.body.substring(4);
        wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .page(search_term)
        .then(page => page.info())
        .then(console.log);
        return true;
      }
  
      return false;
    }
  }
  
  
  module.exports = {
    MessageStrategy: Wikipedia
  }