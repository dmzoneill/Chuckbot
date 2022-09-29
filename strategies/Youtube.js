const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Youtube previews / search
// ####################################

class Youtube extends MessageStrategy {
    static dummy = MessageStrategy.derived.add(this.name);
    
    constructor() {
      super();
      MessageStrategy.state['Youtube'] = {
        'enabled': true
      }
    }
  
    describe(message, strategies) {
      this.message = message;
      MessageStrategy.typing(this.message); 
      let description = "Searches for top youtube video given a search string"
      MessageStrategy.client.sendText(this.message.from, description);
    }
  
    provides() {
      return ['youtube']
    }
    
    handleMessage(message) {
      if(MessageStrategy.state['Youtube']['enabled'] == false) return;
  
      this.message = message;
      var self = this;
  
      if(this.message.body.toLowerCase().startsWith('youtube')) {
        let search_term = this.message.body.substring(7);
  
        (async () => {
          try {
            const results = await yt.search(search_term);
            if(results.length == 0) {
              return false;
            }
            MessageStrategy.typing(self.message);   
            self.client.sendYoutubeLink(this.message.from, results[0].url);
          } catch (err) {
            console.log(err);
          }
        })();
  
        return true;
      }
  
      if (this.message.body.match(new RegExp(/^https:\/\/.*.youtube.com\/.*/)) || this.message.body.match(new RegExp(/^https:\/\/youtu.be\/.*/))) {
  
        if(this.message.thumbnail.length == 0) {
          var request = require('request').defaults({ encoding: null });
          var thumbnail_url = youtubeThumbnail(this.message.body); 
  
          if (!('default' in thumbnail_url)) return;
          if (!('url' in thumbnail_url['default'])) return;
  
          request.get(thumbnail_url['default']['url'], function (error, response, body) {
  
            if (!error && response.statusCode == 200) {
              let data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');   
              MessageStrategy.typing(self.message);   
              self.client.sendYoutubeLink(message.from, self.message.body, '', data);
              return false;
            }
          });        
        }
      }
  
      return false;
    }
  }
  
  
  module.exports = {
    MessageStrategy: Youtube
  }