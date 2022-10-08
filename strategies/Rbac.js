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
        "353861938787": [
          'State',
          'Feature',
          'Spam',
          'Rbac',
          'AYCBooking',
          'AYCComms',
          'AYCHeaters',
          'AYCHoover',
          'AYCPi',
          'Amazon',
          'Ashtanga',
          'ChuckJokes',
          'Crypto',
          'Currency',
          'Deluge',
          'Facebook',
          'Google',
          'Harass',
          'Help',
          'Hi',
          'HyperLink',
          'Imdb',
          'Jackett',
          'Levenshteiner',
          'Logger',
          'Meme',
          'PhilipsHue',
          'Radarr',
          'Pornhub',
          'Reddit',
          'Sonarr',
          'TikTok',
          'Translate',
          'Twitter',
          'UrbanDictionary',
          'Weather',
          'WebCam',
          'Wikipedia',
          'Youtube',
          'PulseAudio'
        ]
      }
    });
  }

  hasAccess(user, role) {
    user = user.substring(0, user.indexOf("@"));

    if(Object.keys(MessageStrategy.state['Rbac']['roles']).includes(user) == false) {
      MessageStrategy.state['Rbac']['roles'][user] = [];
      return false;
    }

    if (MessageStrategy.state['Rbac']['roles'][user].includes(role)) {
      return true;
    } 
    
    return false;
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
      'role add role ([0-9]{10,15})',
      'role remove role ([0-9]{10,15})'
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
      let parts = self.message.body.split(" ");
      if(Object.keys(MessageStrategy.strategies).includes(parts[2]) == false) {
        console.log("Unknown role: " + parts[2]);
      }

      if (MessageStrategy.state['Rbac']['roles'][parts[3]].includes(parts[2]) == false) {
        MessageStrategy.state['Rbac']['roles'][parts[3]].push(parts[2]);
        self.role_list(self);
      }
    } catch (err) {
      console.log(err);
    }
  }

  role_remove(self) {
    try {
      let parts = self.message.body.split(" ");
      if(Object.keys(MessageStrategy.strategies).includes(parts[2]) == false) {
        console.log("Unknown role: " + parts[2]);
      }

      console.log("here");

      if (MessageStrategy.state['Rbac']['roles'][parts[3]].includes(parts[2])) {
        console.log("here 1");

        const index = MessageStrategy.state['Rbac']['roles'][parts[3]].indexOf(parts[2]);
        if (index > -1) {
          console.log("here 2");

          MessageStrategy.state['Rbac']['roles'][parts[3]].splice(index, 1);
          self.role_list(self);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleMessage(message, strategies) {
    if (MessageStrategy.state['Rbac']['enabled'] == false) return;
    this.message = message;

    if (this.message.body.toLowerCase().startsWith('role')) {
      console.log("here 5");
      if (MessageStrategy.strategies['Rbac'].hasAccess(this.message.sender.id, this.constructor.name) == false) {
        console.log("here 6");
        self.client.reply(this.message.from, 'Not for langers like you', this.message.id, true);
        return;
      }
    }

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