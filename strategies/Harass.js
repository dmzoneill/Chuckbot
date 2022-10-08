const MessageStrategy = require("../MessageStrategy.js")


// ####################################
// harass 
// ####################################

class Harass extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static cunts = []
  static sluts = []
  static cronjob = null;

  constructor() {
    super('Harass', {
      'enabled': true
    });
    this.setup_cron();
  }

  setup_cron() {
    let self = this;
    if (Harass.cronjob != null) {
      Harass.cronjob.stop();
    }

    Harass.cronjob = new CronJob(
      '0 */2 * * * *',
      function () {
        for (let v = 0; v < Harass.cunts.length; v++) {
          if (self.client) {
            let slut = Harass.cunts[v];
            if (slut != undefined) {
              let parts = slut.trim().indexOf(" ") ? slut.trim().split(" ") : [slut.trim()];
              self.client.sendText(parts[0], self.get_joke());
            }
          }
        }
      },
      null,
      true,
      'Europe/Dublin'
    );

    Harass.cronjob.start();
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Harasses individual(s) with your mamma jokes"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['harass', 'harass (\d+)', 'harass stop ([0-9a-zA-Z]+)', 'harass list']
  }

  get_joke() {
    var joke = request('GET', 'https://api.yomomma.info/', {
      headers: {
        'Accept': 'text/plain'
      }
    });
    let body = joke.getBody().toString();
    return body.split("\"")[3]
  }

  async get_sluts() {
    try {
      Harass.sluts = []
      let all_chats = await MessageStrategy.client.getAllChats();

      for (let h = 0; h < all_chats.length; h++) {
        let name = "name" in all_chats[h].contact ? all_chats[h].contact.name : "";
        let entry = all_chats[h].contact.id + " " + name;

        if (name.indexOf("Richel") > -1) continue;
        if (Harass.sluts.includes(entry.trim())) continue;

        Harass.sluts.push(entry.trim());
      }

      let all_groups = await MessageStrategy.client.getAllGroups();

      for (let h = 0; h < all_groups.length; h++) {
        let members = await MessageStrategy.client.getGroupMembers(all_groups[h].id);
        for (let k = 0; k < members.length; k++) {
          let name = "name" in members[k] ? members[k].name : "";
          let entry = members[k].id + " " + name;

          if (name.indexOf("Richel") > -1) continue;
          if (Harass.sluts.includes(entry.trim())) continue;

          Harass.sluts.push(entry.trim());
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async get_known_sluts() {
    try {
      await this.get_sluts();
      MessageStrategy.typing(this.message);
      let msg = "";
      for (let y = 0; y < Harass.sluts.length; y++) {
        msg += (y + 1).toString() + " :" + Harass.sluts[y] + "\n";
      }
      MessageStrategy.client.sendText(this.message.from, msg);
    } catch (err) {
      console.log(err);
    }
  }

  async harass() {
    try {
      let cunt = this.message.body.split(" ");
      let the_cunt = parseInt(cunt[1].trim()) - 1;
      if (Harass.sluts.includes(the_cunt)) {
        return;
      }
      Harass.cunts.push(Harass.sluts[the_cunt]);
    } catch (err) {
      console.log(err);
    }
  }

  async stopharass() {
    try {
      let cunt = this.message.body.split(" ");
      let the_cunt = cunt[2].trim();
      for (let y = 0; y < Harass.cunts.length; y++) {
        if (!Harass.cunts[y]) continue;

        if (Harass.cunts[y].toLowerCase().indexOf(the_cunt) > -1) {
          delete Harass.cunts[y];
          y = y - 1;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async listharass() {
    try {
      MessageStrategy.typing(this.message);
      MessageStrategy.client.sendText(this.message.from, Harass.cunts.join("\n"));
    } catch (err) {
      console.log(err);
    }
  }

  handleMessage(message, strategies) {
    if (MessageStrategy.state['Harass']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase().startsWith('harass')) {
      if (MessageStrategy.strategies['Rbac'].hasAccess(this.message.sender.id, this.constructor.name) == false) {
        self.client.reply(this.message.from, 'Not for langers like you', this.message.id, true);
        return;
      }
    }

    this.message = message;

    if (this.message.body.toLowerCase() === 'harass') {
      this.get_known_sluts();
      return true;
    }

    if (this.message.body.match(/^harass ([0-9]{1,3})$/i)) {
      this.harass();
      return true;
    }

    if (this.message.body.match(/^harass stop ([0-9a-z]+)$/i)) {
      this.stopharass();
      return true;
    }

    if (this.message.body.match(/^harass list$/i)) {
      this.listharass();
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Harass
}