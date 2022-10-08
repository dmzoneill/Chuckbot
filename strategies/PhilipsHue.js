const MessageStrategy = require("../MessageStrategy.js")


// ####################################
// PhilipsHue  
// ####################################

class PhilipsHue extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('PhilipsHue', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Philips Hue light management"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  do_cmd(self, opts) {
    let cmd = "./node_modules/hueadm/bin/hueadm " + opts.join(" ");
    console.log(cmd)
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        self.client.reply(self.message.from, error.message, self.message.id, true);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        self.client.reply(self.message.from, stderr, self.message.id, true);
        return;
      }
      console.log(`stdout: ${stdout}`);
      let msg = "```";
      msg += stdout.replace(/\s*-\s*/gm, "\n").trim();
      msg += "```";
      self.client.reply(self.message.from, msg, self.message.id, true);
    });
  }

  do_sanitize_cmd(self, opts) {

    let clean_opts = [];
    let dodgey = [
      "\\", "\"", "'", ";", ">", "<", "$", "&", "`",
      "!", "@", "(", ")", "|",
      "/", ",", ".", "?", "~", "{", "}", "[", "]"
    ];

    // group
    opts.forEach(opt => {
      let clean_opt = opt;

      for (let c = 0; c < dodgey.length; c++) {
        clean_opt.replace(dodgey[c], "");
      }

      clean_opts.push(clean_opt);
    });

    // groups
    if (clean_opts[1] == "groups") {
      this.do_cmd(self, [clean_opts[1]]);
      return;
    }

    // groups
    if (clean_opts[1] == "lights") {
      this.do_cmd(self, [clean_opts[1]]);
      return;
    }

    let offset = 1;

    if (clean_opts[1] == "group") {
      console.log("Group checking offset");
      offset = 2
    }

    if (clean_opts[offset].match(/\d+/) == null) {
      console.log("No light or group number");
      self.client.reply(self.message.from, "No light or group number", self.message.id, true);
      return;
    }

    if (clean_opts[offset + 1].match(/(on|off|clear|reset|select|lselect|colorloop|#?[0-9a-zA-Z]{6})/) == null) {
      console.log("Action should be on, off, clear, reset, select, lselect, colorloop, [0-9a-zA-Z]{6}");
      self.client.reply(self.message.from, "Action should be on, off, clear, reset", self.message.id, true);
      return;
    }

    if (clean_opts[offset + 1].match(/#?[0-9a-zA-Z]{6}/) != null) {
      clean_opts[offset + 1] = "'" + clean_opts[offset + 1] + "'";
    }

    if (clean_opts.length > 20) {
      console.log("Where are you off to?");
      self.client.reply(self.message.from, "Where are you off to?", self.message.id, true);
      return;
    }

    let options = [
      'hue=([0-9]{1,3})',
      'sat=([0-9]{1,3})',
      'bri=([0-9]{1,3})',
      'transitiontime=([0-9]{2,4})'
    ];

    // check repeating args
    for (var f = offset + 2; f < clean_opts.length; f++) {
      let passed = false;
      for (var h = 0; h < options.length; h++) {
        if (clean_opts[f].match(new RegExp(options[h]))) {
          passed = true;
        }
      }
      if (passed == false) {
        console.log("Additional option " + options[f] + " nonsense");
        self.client.reply(self.message.from, "Additional option " + options[f] + " nonsense", self.message.id, true);
        return;
      }
    }

    clean_opts.shift();

    if (offset == 1) {
      clean_opts.unshift("light");
    }

    console.log(clean_opts);

    this.do_cmd(self, clean_opts);
  }

  provides() {
    return [
      'Hue',
      'Hue lights',
      'Hue ([0-9]+) (on|off|clear|reset|select|lselect|colorloop|[0-9a-zA-Z]{6})',
      'Hue ([0-9]+) (hue|sat|bri)=[0-9]+',
      'Hue ([0-9]+) ... (transitiontime=[0-9]+)',
      'Hue groups',
      'Hue group ([0-9]+) (on|off|clear|reset|select|lselect|colorloop|[0-9a-zA-Z]{6})',
      'Hue group ([0-9]+) (hue|sat|bri)=[0-9]+',
      'Hue group ([0-9]+) ... (transitiontime=[0-9]+)?',
    ]
  }

  handleMessage(message) {
    if (MessageStrategy.state['PhilipsHue']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase().startsWith('hue')) {
      if (MessageStrategy.strategies['Rbac'].hasAccess(this.message.sender.id, this.constructor.name) == false) {
        self.client.reply(this.message.from, 'Not for langers like you', this.message.id, true);
        return;
      }
    }

    if (this.message.body.toLowerCase().startsWith('hue')) {
      if (this.message.body.indexOf(" ")) {
        MessageStrategy.typing(this.message);
        let parts = this.message.body.split(" ");
        this.do_sanitize_cmd(this, parts);
        return true;
      }
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: PhilipsHue
}