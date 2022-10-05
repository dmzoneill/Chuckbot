const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Logger
// ####################################

class Logger extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Logger', {
      'enabled': true,
      'media_dir': "./strategies/media"
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Logs media to disk"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['logger list', 'logger list mine', 'logger download mine \d+']
  }

  async saveMedia(self) {
    try {
      if (self.message.type != "image" && self.message.type != "video") {
        return;
      }

      let mime_types = {
        "image/jpeg": "jpeg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "video/mp4": "mp4"
      };

      if (!fs.existsSync(MessageStrategy.state['Logger']['media_dir'])) {
        fs.mkdirSync(MessageStrategy.state['Logger']['media_dir']);
      }

      let data_url = await self.client.decryptMedia(self.message);
      let buff = Buffer.from(data_url.substring(data_url.indexOf(',')), 'base64');
      let sha1d = crypto.createHash('sha1').digest('hex');
      let filename = Date.now() + " - " + self.message.from + " - " + sha1d + "." + mime_types[self.message.mimetype];

      fs.writeFile(MessageStrategy.state['Logger']['media_dir'] + "/" + filename, buff, function (err) {
        if (err) {
          return console.log(err);
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  my_files(list, filter) {
    let filtered = [];

    list.forEach(item => {
      if(item.indexOf(filter) > -1) {
        filtered.push(item);
      }
    });

    return filtered;
  }

  async list(self, filter_mine) {
    fs.readdir(MessageStrategy.state['Logger']['media_dir'], (err, files) => {
      if(err) return;

      let full_msg = "";
      let my_files = filter_mine ? self.my_files(files, self.message.from): files;
      let cnt = 1;

      my_files.forEach(file => {
        let padding = 5;
        let msg = cnt.toString() + "";
        msg += " ".repeat(padding - msg.length);
        msg += ": " + file + "\n";
        full_msg += msg;
        cnt += 1;
      });

      self.client.sendText(self.message.from, full_msg.trim());
    });
  }

  handleMessage(message) {
    if (MessageStrategy.state['Logger']['enabled'] == false) return;
    this.message = message;
    this.saveMedia(this);

    if(this.message.body.toLowerCase().startsWith("logger list mine")) {
      MessageStrategy.typing(this.message);
      this.list(this, true);
    }

    if(this.message.body.toLowerCase().startsWith("logger list")) {
      MessageStrategy.typing(this.message);
      this.list(this);
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Logger
}