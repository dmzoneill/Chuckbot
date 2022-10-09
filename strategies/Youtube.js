const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Youtube previews / search
// ####################################

class Youtube extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Youtube', {
      'enabled': true
    });
  }

  provides() {
    Youtube.self = this;

    return {
      help: 'Provides previews and searches for youtube videos',
      provides: {
        'youtube .*': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('youtube');
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Allows user to search for a youtube video given a string';
          },
          interactive: true,
          action: Youtube.self.Search,
          enabled: function () {
            return MessageStrategy.state['Youtube']['enabled'];
          }
        },
        'skip-youtube': {
          test: function (message) {
            return message.body.match(new RegExp(/^https:\/\/.*youtube.com\/.*/)) || message.body.match(new RegExp(/^https:\/\/youtu.be\/.*/));
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return true;
          },
          help: function () {
            return 'Add previews for youtube urls';
          },
          interactive: false,
          action: Youtube.self.Preview,
          enabled: function () {
            return MessageStrategy.state['Youtube']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['Youtube']['enabled'];
      }
    }
  }

  Preview(message) {
    let getVideo = false;

    Youtube.self.waitFor(2000);

    if (Object.keys(message).includes('thumbnail') == false) {
      getVideo = true;
    }

    if (Object.keys(message).includes('thumbnail')) {
      if (message.thumbnail.length == 'undefined') {
        getVideo = true;
      }
    }

    if (Object.keys(message).includes('thumbnail')) {
      if (getVideo == false) {
        if (message.thumbnail.length == 0) {
          getVideo = true;
        }
      }
    }

    if (getVideo) {
      var request = require('request').defaults({ encoding: null });
      var thumbnail_url = youtubeThumbnail(message.body);

      if (!('default' in thumbnail_url)) return;
      if (!('url' in thumbnail_url['default'])) return;

      request.get(thumbnail_url['default']['url'], function (error, response, body) {
        try {
          if (!error && response.statusCode == 200) {          

            let data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
            MessageStrategy.typing(message);
            Youtube.self.waitFor(500);
            Youtube.self.waitFor(500);
            MessageStrategy.client.sendYoutubeLink(message.from, message.body, '', data);
            return false;
          }
        }
        catch (err) {
          MessageStrategy.typing(message);
          this.client.sendText(this.message.from, err);
        }
      });
    }
  }

  Search(message) {
    let search_term = message.body.substring(7);

    (async () => {
      try {
        const results = await yt.search(search_term);
        if (results.length == 0) {
          return false;
        }
        MessageStrategy.typing(message);
        MessageStrategy.client.sendYoutubeLink(message.from, results[0].url);
      } catch (err) {
        console.log(err);
      }
    })();
  }
}


module.exports = {
  MessageStrategy: Youtube
}