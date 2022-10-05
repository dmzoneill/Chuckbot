const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Chuck jokes 
// ####################################

class ChuckJokes extends MessageStrategy {
    static dummy = MessageStrategy.derived.add(this.name);
  
    constructor() {
      super('ChuckJokes', {
        'enabled': true
      });
  
      this.chuck_keywords = [
        'joke', 
        'lol', 
        'fyi', 
        'prick', 
        'dick', 
        'lmao', 
        'who', 
        'cunt', 
        'nice', 
        'fuck', 
        'haha', 
        'feck', 
        'cock', 
        'langer', 
        'arse', 
        'slut', 
        'bitch'
      ];
    }
  
    describe(message, strategies) {
      this.message = message;
      MessageStrategy.typing(this.message); 
      let description = "Chuck will look for bads words and post a chuck norris joke"
      MessageStrategy.client.sendText(this.message.from, description);
    }
  
    provides() {
      return ['chuck', 'chuck stfu']
    }
  
    get_joke() {
      var joke = request('GET', 'https://api.chucknorris.io/jokes/random', {
        headers: {       
           'Accept': 'text/plain'
        }
      });
      return joke.getBody()
    }
    
    handleMessage(message) { 
      this.message = message;
      var self = this;
  
      if(MessageStrategy.state['ChuckJokes']['enabled'] == false) {
        return false;
      }
  
      if(Object.keys(MessageStrategy.state['ChuckJokes']).includes("chats") == false) {
        MessageStrategy.state['ChuckJokes']['chats'] = {};
      }
  
      if(Object.keys(MessageStrategy.state['ChuckJokes']['chats']).includes(this.message.chatId) == false) {
        MessageStrategy.state['ChuckJokes']['chats'][this.message.chatId] = {};
        MessageStrategy.state['ChuckJokes']['chats'][this.message.chatId]['enabled'] = false;
      }
  
      if(this.message.body.toLowerCase() === 'chuck stfu') {      
        MessageStrategy.typing(self.message);   
        MessageStrategy.client.sendText(message.from, 'Don\'t let anyone tell you you\'re not powerful.  You\'re the most powerful woman i know');
        MessageStrategy.state['ChuckJokes']['chats'][this.message.chatId]['enabled'] = false;
        return true;
      }
  
      if(this.message.body.toLowerCase() === 'chuck') {  
        MessageStrategy.typing(self.message);   
        MessageStrategy.client.sendText(this.message.from, 'How many lesbians does it take to screw in a light bulb');
        MessageStrategy.state['ChuckJokes']['chats'][this.message.chatId]['enabled'] = true;
        return true;
      }   
  
      if(MessageStrategy.state['ChuckJokes']['chats'][this.message.chatId]['enabled'] == false) {
        return false;
      }
  
      this.chuck_keywords.forEach(async function(word) {
        try {
          if (self.message.body.toLowerCase().indexOf(word) > -1) {  
            MessageStrategy.typing(self.message);
            self.client.sendText(self.message.from, self.get_joke());
            return true;
          }
        } catch (err) {
          console.log(err);
        } 
      });
    }
  }
  
  
  module.exports = {
    MessageStrategy: ChuckJokes
  }