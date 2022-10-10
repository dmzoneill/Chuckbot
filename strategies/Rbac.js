const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Rbac protection
// ####################################

class Rbac extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Rbac', {
      'enabled': true,
      'roles': {
        "353861938787": [
          'State',
          'StateShow',
          'StateSave',
          'StateLoad',
          'Feature',
          'FeatureList',
          'FeatureEnable',
          'FeatureDisable',
          'Spam',
          'Rbac',
          'RbacRolelist',
          'RbacRoleAdd',
          'RbacRoleRemove',
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
          'PhilipsHueChangeLighting',
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
          'WebCamTakePicture',
          'WebCamTakeVideo',
          'Wikipedia',
          'Youtube',
          'PulseAudio',
          'PulseAudioSetVolume'
        ]
      },
      'removed_roles': {
        "353861938787": []
      },
      'restricted_roles': [
        'State',
        'StateShow',
        'StateSave',
        'StateLoad',
        'Feature',
        'FeatureList',
        'FeatureEnable',
        'FeatureDisable',
        'Rbac',
        'RbacRolelist',
        'RbacRoleAdd',
        'RbacRoleRemove',
        'PhilipsHue',
        'PhilipsHueChangeLighting',
        'WebCam',
        'WebCamTakePicture',
        'WebCamTakeVideo',
        'PulseAudio',
        'PulseAudioSetVolume'
      ]
    });
  }

  provides() {
    Rbac.self = this;

    return {
      help: 'Role binding and access control',
      provides: {
        'role list': {
          test: function (message) {
            return message.body.toLowerCase() == 'role list';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Show all roles available';
          },
          action: function Rolelist(message) {
            Rbac.self.role_list(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Rbac']['enabled'];
          }
        },
        'role add x y': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('role add');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Adds a role x to a person y (353869138787)';
          },
          action: function RoleAdd(message) {
            Rbac.self.role_add(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Rbac']['enabled'];
          }
        },
        'role remove x y': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('role remove');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Removes a role x from person y (353869138787)';
          },
          action: function RoleRemove(message) {
            Rbac.self.role_remove(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Rbac']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Rbac']['enabled'];
      }
    }
  }

  hasAccess(user, role) {
    user = user.substring(0, user.indexOf("@"));

    if (Object.keys(MessageStrategy.state['Rbac']).includes('roles') == false) {
      MessageStrategy.state['Rbac']['roles'] = {};
    }

    if (Object.keys(MessageStrategy.state['Rbac']).includes('removed_roles') == false) {
      MessageStrategy.state['Rbac']['removed_roles'] = {};
    }

    if (Object.keys(MessageStrategy.state['Rbac']['roles']).includes(user) == false) {
      MessageStrategy.state['Rbac']['roles'][user] = [];
    }

    if (Object.keys(MessageStrategy.state['Rbac']['removed_roles']).includes(user) == false) {
      MessageStrategy.state['Rbac']['removed_roles'][user] = [];
    }

    if (MessageStrategy.state['Rbac']['roles'][user].includes(role)) {
      return true;
    }

    if (MessageStrategy.state['Rbac']['removed_roles'][user].includes(role)) {
      return false;
    }

    if (MessageStrategy.state['Rbac']['restricted_roles'].includes(role)) {
      return false;
    }

    return true;
  }

  role_list(message) {
    try {
      MessageStrategy.client.reply(message.from, MessageStrategy.access_paths.sort().join("\n").trim(), message.id, true);
    } catch (err) {
      console.log(err);
    }
  }

  role_add(message) {
    try {
      let parts = message.body.split(" ");
      if (Object.keys(MessageStrategy.strategies).includes(parts[2]) == false) {
        console.log("Unknown role: " + parts[2]);
      }

      if (MessageStrategy.state['Rbac']['roles'][parts[3]].includes(parts[2]) == false) {
        MessageStrategy.state['Rbac']['roles'][parts[3]].push(parts[2]);
        const index = MessageStrategy.state['Rbac']['removed_roles'][parts[3]].indexOf(parts[2]);
        if (index > -1) {
          MessageStrategy.state['Rbac']['removed_roles'][parts[3]].splice(index, 1);
          Rbac.self.role_list(message);
        }
        Rbac.self.role_list(message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  role_remove(message) {
    try {
      let parts = message.body.split(" ");
      if (Object.keys(MessageStrategy.strategies).includes(parts[2]) == false) {
        console.log("Unknown role: " + parts[2]);
      }
      if (MessageStrategy.state['Rbac']['roles'][parts[3]].includes(parts[2])) {
        const index = MessageStrategy.state['Rbac']['roles'][parts[3]].indexOf(parts[2]);
        if (index > -1) {
          MessageStrategy.state['Rbac']['roles'][parts[3]].splice(index, 1);
          MessageStrategy.state['Rbac']['removed_roles'][parts[3]].push(parts[2]);
          Rbac.self.role_list(message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: Rbac
}