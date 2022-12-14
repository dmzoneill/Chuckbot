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
        'youtube x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('youtube');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
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
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
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
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Youtube']['enabled'];
      }
    }
  }

  async Preview(message) {
    try {
      let getVideo = false;

      MessageStrategy.typing(message);
      Youtube.self.waitFor(500);

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

      // https://www.youtube.com/watch?v=7fncJdVjy5U
      // https://youtu.be/xxxxxxxxx
      // http://youtube.com/shorts/xxxxxxxxxx

      let parts = message.body.split("/");
      let video_id = "";
      if (parts[3].indexOf("v=") > -1) {
        let sub_parts = parts[3].split("v=");
        video_id = sub_parts[1];
      } else if (parts[3] == "shorts") {
        video_id = parts[4];
      }
      else {
        video_id = parts[3];
      }

      if (getVideo) {
        MessageStrategy.typing(message);
        var youtube_image = await MessageStrategy.get_image("https://img.youtube.com/vi/" + video_id + "/hqdefault.jpg");

        if (youtube_image == null) {
          return;
        }

        MessageStrategy.typing(message);
        MessageStrategy.client.sendYoutubeLink(message.from, message.body, '', youtube_image);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async Search(message) {
    let search_term = message.body.substring(7);

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
  }
}


module.exports = {
  MessageStrategy: Youtube
}