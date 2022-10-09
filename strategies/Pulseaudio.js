const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// PulseAudio
// ####################################

class PulseAudio extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('PulseAudio', {
      'enabled': true
    });
  }

  provides() {
    PulseAudio.self = this;

    return {
      help: 'Controls basic PulseAudio settings',
      provides: {
        'PulseAudio': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('volume');
          },
          access: function (message, strategy, action) {
            MessageStrategy.register(strategy.constructor.name + action.name);
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Manages the volume on the computer';
          },
          action: PulseAudio.self.SetVolume,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['PulseAudio']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        MessageStrategy.register(strategy.constructor.name);
        return true;
      },
      enabled: function () {
        return MessageStrategy.state['PulseAudio']['enabled'];
      }
    }
  }

  async SetVolume(message) {
    try {
      if (message.body.indexOf(" ") == -1) {
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
}


module.exports = {
  MessageStrategy: PulseAudio
}