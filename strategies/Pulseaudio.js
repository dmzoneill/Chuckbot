const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// PulseAudio
// ####################################

class PulseAudio extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('PulseAudio', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Controls basic PulseAudio settings"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['Volume \d', 'Volume (+|-)\d']
  }

  async setPulseAudio(self) {
    try {
      if (self.message.body.indexOf(" ") == -1) {
        return;
      }
      let volume = 0;
      let incrementor = "";
      let change = "pactl -- set-sink-volume 0 ";

      let parts = self.message.body.split(" ");
      let value = parts[1].trim();

      if (value.startsWith('+') || value.startsWith('-')) {
        incrementor = value.substring(0, 1);
        volume = value.substring(1).trim();
      } else {
        volume = value;
      }

      volume = parseInt(volume);

      if (volume < 0 || volume > 100) {
        return;
      }

      if (incrementor == "") {
        change += volume.toString() + "%";
      } else {
        change += incrementor + volume.toString() + "%";
      }

      exec(change, async (error, stdout, stderr) => {
        try {
          console.log(stdout);
        }
        catch (err) {
          console.log(err);
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['PulseAudio']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase().startsWith('volume')) {
      if (MessageStrategy.strategies['Rbac'].hasAccess(this.message.sender.id, this.constructor.name) == false) {
        this.client.reply(this.message.from, 'Not for langers like you', this.message.id, true);
        return;
      }
    }

    if (this.message.body.toLowerCase().startsWith('volume')) {
      MessageStrategy.typing(this.message);
      this.setPulseAudio(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: PulseAudio
}