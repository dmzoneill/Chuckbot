const CronJob = require('cron').CronJob;
const fs = require('fs');
const globby = require('globby');
const levenshtein = require('js-levenshtein');
const request = require('sync-request');
const crypto = require('crypto');
const CoinMarketCap = require('coinmarketcap-api');
const puppeteer = require('puppeteer');
const { exchangeRates } = require('exchange-rates-api');
const deluge = require('deluge');
const resizeImg = require('resize-image-buffer');
const axios = require('axios');
const urlencode = require('rawurlencode');
const nameToImdb = require("name-to-imdb");
const { translate } = require('bing-translate-api');
const ud = require('urban-dictionary');
const weather = require('weather-js');
const wiki = require('wikipedia');
const yt = require('youtube-search-without-api-key');
const youtubeThumbnail = require('youtube-thumbnail');
const NodeWebcam = require('node-webcam');
const { exec } = require("child_process");

// directory path
const strategies_dir = './strategies/'


class MessageStrategy {
  static client = null;
  static derived = new Set();
  static state = {};
  static strategies = {}
  static contacts = [];
  static contacts_verbose = [];
  static groups = [];
  static groups_verbose = [];
  static changed = false;
  static watcher = null;
  static watched_events = {};

  constructor() {
    
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Didn't provide describe from " + this.constructor.name;
    MessageStrategy.client.sendText(this.message.from, description);
  }

  static watch() {
    if (MessageStrategy.watcher != null) {
      MessageStrategy.watcher.close();
    }

    fs.watch(strategies_dir, (event, filename) => {
      if (filename) {
        MessageStrategy.update_strategy(filename);
      }
    });
  }

  static async update_active_chat_contacts() {
    MessageStrategy.contacts = [];
    let all_chats = await MessageStrategy.client.getAllChats();

    for (let h = 0; h < all_chats.length; h++) {
      MessageStrategy.contacts.push(all_chats[h].contact.id);
      MessageStrategy.contacts_verbose.push(all_chats[h].contact.id + " " + all_chats[h].contact.name);
    }

    let all_groups = await MessageStrategy.client.getAllGroups();

    for (let h = 0; h < all_groups.length; h++) {
      MessageStrategy.groups.push(all_groups[h].id);
      MessageStrategy.groups_verbose.push(all_groups[h].id + " " + all_groups[h].name);
      let members = await MessageStrategy.client.getGroupMembers(all_groups[h].id);
      for (let k = 0; k < members.length; k++) {
        if (MessageStrategy.contacts.includes(members[k].id.trim())) continue;
        MessageStrategy.contacts.push(members[k].id.trim());
      }
    }
  }

  async call_update_active_chat_contacts() {
    MessageStrategy.update_active_chat_contacts()
  }

  get_contacts() {
    return MessageStrategy.contacts;
  }

  get_contacts_verbose() {
    return MessageStrategy.contacts_verbose;
  }

  get_groups() {
    return MessageStrategy.groups;
  }

  get_groups_verbose() {
    return MessageStrategy.groups_verbose;
  }

  static async get_chat_id(message) {
    if ("chatId" in message) {
      return message.chatId;
    }
    else {
      return message.from;
    }
  }

  static async typing(message) {
    try {
      await MessageStrategy.client.simulateTyping(await MessageStrategy.get_chat_id(message), true);
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));
      await MessageStrategy.client.simulateTyping(await MessageStrategy.get_chat_id(message), false);
    } catch (err) {
      console.log(err);
    }
  }

  static getChanged() {
    return MessageStrategy.changed;
  }

  static update_strategy(file) {
    try {
      if (Object.keys(MessageStrategy.watched_events).includes(strategies_dir + file) == false) {
        MessageStrategy.watched_events[strategies_dir + file] = new Date(0);
      }
      fs.stat(strategies_dir + file, function (err, stats) {
        try {
          if (stats.mtime.valueOf() === MessageStrategy.watched_events[strategies_dir + file].valueOf()) {
            return;
          }
          MessageStrategy.watched_events[strategies_dir + file] = stats.mtime;
          MessageStrategy.changed = true;
          delete require.cache[require.resolve(strategies_dir + file)];
          let instance = require(strategies_dir + file);
          let obj = eval(`new ${instance.MessageStrategy}()`);
          MessageStrategy.strategies[obj.constructor.name] = obj;
          console.log(file + " reloaded");
        }
        catch (err) {
          console.log(err);
        }
      });
    }
    catch (err) {
      console.log(err)
    }
  }

  static update_strategies() {
    MessageStrategy.strategies = {}

    MessageStrategy.update_strategy("Spam.js");
    MessageStrategy.update_strategy("Rbac.js");
    MessageStrategy.update_strategy("Feature.js");

    fs.readdir(strategies_dir, (err, files) => {
      if (err) {
        throw err
      }
      files.forEach(file => {
        if (file.endsWith("js")) {
          MessageStrategy.update_strategy(file);
        }
      });
    })
  }

  static getStrategies(client) {
    if (Object.keys(MessageStrategy.strategies).length == 0) {
      MessageStrategy.update_strategies();
      MessageStrategy.watch();
    }

    MessageStrategy.client = client;

    MessageStrategy.derived.forEach(key => {
      MessageStrategy.strategies[key].client = client;
    });

    MessageStrategy.changed = false;

    return MessageStrategy.strategies;
  }

  static doHandleMessage(chuck, message) {
    if (MessageStrategy.changed) {
      MessageStrategy.getStrategies(chuck);
    }

    try {
      let keys = Object.keys(MessageStrategy.strategies);
      for (let y = 0; y < keys.length; y++) {
        console.log(keys[y] + ": " + message.body);
        if (MessageStrategy.strategies[keys[y]].handleMessage(message, MessageStrategy.strategies)) {
          return;
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = MessageStrategy
