const CronJob = require('cron').CronJob;
const fs = require('fs');
const globby = require('globby');
const levenshtein = require('js-levenshtein');
const request = require('sync-request');
const crypto = require('crypto');
const CoinMarketCap = require('coinmarketcap-api');
const puppeteer = require('puppeteer');
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
const jsdom = require("jsdom");


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
  static access_paths = [];

  constructor(key, config) {
    if (Object.keys(MessageStrategy.state).includes(key) == false) {
      MessageStrategy.state[key] = config;
    }
  }

  hasAccess(sender_id, prototype_name) {
    return MessageStrategy.strategies['Rbac'].hasAccess(sender_id, prototype_name);
  }

  static hasAccess(sender_id, prototype_name) {
    return MessageStrategy.strategies['Rbac'].hasAccess(sender_id, prototype_name);
  }

  static register(action) {
    if (MessageStrategy.access_paths.includes(action) == false) {
      MessageStrategy.access_paths.push(action);
    }
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

  async waitFor(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
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

    MessageStrategy.update_strategy("State.js");
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

  async getPageOGData(self, fullurl, wait = 500) {
    try {

      var config = {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Access-Control-Request-Headers': 'content-type',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Origin': 'https://google.com/',
          'Pragma': 'no-cache',
          'Referer': 'https://google.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      };

      MessageStrategy.typing(self.message);

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.goto(fullurl);
      await page.setViewport({ width: 1366, height: 768 });

      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();

      MessageStrategy.typing(self.message);

      await bodyHandle.dispose();
      const calculatedVh = page.viewport().height;
      let vhIncrease = 0;
      while (vhIncrease + calculatedVh < height) {
        // Here we pass the calculated viewport height to the context
        // of the page and we scroll by that amount
        await page.evaluate(_calculatedVh => {
          window.scrollBy(0, _calculatedVh);
        }, calculatedVh);
        await self.waitFor(wait);
        vhIncrease = vhIncrease + calculatedVh;
      }

      MessageStrategy.typing(self.message);

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh });

      // Wait for a little bit more
      await self.waitFor(wait);

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      MessageStrategy.typing(self.message);

      let description = await page.evaluate(() => {
        let desc = document.head.querySelector('meta[property="og:description"]');
        if (desc) {
          return desc.getAttribute("content");
        }
        return null;
      });

      let image_url = await page.evaluate(() => {
        let image = document.head.querySelector('meta[property="og:image"]');
        if (image) {
          return image.getAttribute("content")
        }
        return null;
      });

      let title = await page.evaluate(() => {
        return document.head.querySelector('title').innerText;
      });

      if (image_url == null) {
        return [null, null];
      }
      else {
        let desc = description == null ? title : description;
        MessageStrategy.typing(self.message);
        const responseImage = await axios(image_url, { responseType: 'arraybuffer', headers: config['headers'] });
        const image = await resizeImg(responseImage.data, { width: 200, format: "jpg" });
        const buffer64 = Buffer.from(image, 'binary').toString('base64');
        let data = "data:image/jpeg;base64," + buffer64;
        MessageStrategy.typing(self.message);
        return [desc, data];
      }
    }
    catch (err) {
      console.log(err);
      return [null, null];
    }
  }

  static doHandleMessage(chuck, message) {
    if (MessageStrategy.changed) {
      MessageStrategy.getStrategies(chuck);
    }

    try {
      let keys = Object.keys(MessageStrategy.strategies);

      for (let y = 0; y < keys.length; y++) {
        let handler = MessageStrategy.strategies[keys[y]];
        let module = handler.provides();

        if (Array.isArray(module)) {
          handler.handleMessage(message, MessageStrategy.strategies);
        } else {
          if (module.access(message, handler) == false) continue;
          if (module.enabled() == false) continue;

          handler.message = message;

          let actions_keys = Object.keys(module.provides);
          for (let x = 0; x < actions_keys.length; x++) {
            let action_obj = module.provides[actions_keys[x]];
            if (action_obj.test(message)) {
              if (action_obj.access(message, handler, action_obj.action) == false) {
                MessageStrategy.client.reply(message.from, "No access", message.id, true);
                y = keys.length;
                break;
              }
              if (action_obj.enabled() == false) {
                MessageStrategy.client.reply(message.from, "Disabled", message.id, true);
                y = keys.length;
                break;
              }
              if (action_obj.action(message)) {
                y = keys.length;
                break;
              }
            }
          }
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = MessageStrategy
