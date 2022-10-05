const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Rbac protection
// ####################################

class Rbac extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Rbac', {
      'enabled': true,
      'roles': {
        5: ["353861938787"],
        4: [],
        3: [],
        2: [],
        1: []
      }
    });
  }

  hasAccess(user, roles) {
    let access = false;
    user = user.substring(0, user.indexOf("@"));
    roles.forEach(element => {
      if (MessageStrategy.state['Rbac']['roles'][element].includes(user)) {
        access = true;
      }
    });
    return access;
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Manages Rbac";
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return [
      'role list',
      'role add ([1-5]) ([0-9]{10,15})',
      'role remove ([1-5]) ([0-9]{10,15})'
    ];
  }

  role_list(self) {
    try {
      self.client.reply(self.message.from, JSON.stringify(MessageStrategy.state['Rbac']['roles'], null, 4), self.message.id, true);
    } catch (err) {
      console.log(err);
    }
  }

  role_add(self) {
    try {
      if (MessageStrategy.strategies['Rbac'].hasAccess(self.message.sender.id, [5]) == false) {
        self.client.reply(self.message.from, 'Not a chance buddy', self.message.id, true);
        return;
      }

      let re_add = /role add ([1-5]) ([0-9]{10,15})/i;
      let found = self.message.body.match(re_add);

      if (found) {
        console.log(found);
        if (MessageStrategy.state['Rbac']['roles'][found[1]].includes(found[2]) == false) {
          MessageStrategy.state['Rbac']['roles'][found[1]].push(found[2]);
          self.role_list(self);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  role_remove(self) {
    try {
      if (MessageStrategy.strategies['Rbac'].hasAccess(self.message.sender.id, [5]) == false) {
        self.client.reply(self.message.from, 'Not a chance buddy', self.message.id, true);
        return;
      }

      let re_add = /role remove ([1-5]) ([0-9]{10,15})/i;
      let found = self.message.body.match(re_add);

      if (found) {
        console.log(found);
        if (MessageStrategy.state['Rbac']['roles'][found[1]].includes(found[2])) {
          const index = MessageStrategy.state['Rbac']['roles'][found[1]].indexOf(found[2]);
          if (index > -1) {
            MessageStrategy.state['Rbac']['roles'][found[1]].splice(index, 1);
            self.role_list(self);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleMessage(message, strategies) {
    if (MessageStrategy.state['Rbac']['enabled'] == false) return;
    this.message = message;

    if (this.message.body.toLowerCase() == 'role list') {
      MessageStrategy.typing(this.message);
      this.role_list(this);
      return true;
    }

    if (this.message.body.toLowerCase().startsWith('role add')) {
      MessageStrategy.typing(this.message);
      this.role_add(this);
      return true;
    }

    if (this.message.body.toLowerCase().startsWith('role remove')) {
      MessageStrategy.typing(this.message);
      this.role_remove(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Rbac
}