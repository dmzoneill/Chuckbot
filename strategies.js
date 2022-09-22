const request = require('sync-request');
const levenshtein = require('js-levenshtein');
const globby = require('globby');
const yt = require('youtube-search-without-api-key');
const nameToImdb = require("name-to-imdb");
const wiki = require('wikijs').default;
const weather = require('weather-js');
const youtubeThumbnail = require('youtube-thumbnail');
const { exchangeRates } = require('exchange-rates-api');
const axios = require('axios');
const ud = require('urban-dictionary')
const CoinMarketCap = require('coinmarketcap-api');
const fs = require("fs");
const resizeImg = require('resize-image-buffer');
const { translate } = require('bing-translate-api');
const CronJob = require('cron').CronJob;
const urlencode = require('rawurlencode');
const puppeteer = require('puppeteer');


Array.prototype.myJoin = function(seperator,start,end){
  if(!start) start = 0;
  if(!end) end = this.length - 1;
  end++;
  return this.slice(start,end).join(seperator);
};


// ####################################
// Base class MessageStrategy
// ####################################

class MessageStrategy {
  static derived = new Set();

  constructor(client) {
    this.client = client;
  }

  async typing() {
    await this.client.simulateTyping(this.message.chatId, true);
    // simulate typing for up to 2 seconds
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000)));
    await this.client.simulateTyping(this.message.chatId, false);
  }

  static getStrategies(client) {
    let strategies = {}

    MessageStrategy.derived.forEach(key => {
      strategies[key] = eval(`new ${key}()`);
      strategies[key].client = client;
    });

    return strategies;
  }
}


// ####################################
// Spam protection
// ####################################

class Spam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static tracker = {}
  static banned = {}
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return []
  }
  
  handleMessage(message, strategies) {
    this.message = message;
    let spammer = this.message.chatId + " - " + this.message.sender.id;

    if(spammer in Spam.banned) {
      if(Spam.banned[spammer] + 1800 > Date.now() / 1000) {
        this.client.sendText(this.message.sender.id, "Jesus loves you");
        return true;
      }
      delete Spam.banned[spammer];
      delete Spam.tracker[spammer];
    } 

    let keywords = [];

    Object.keys(strategies).forEach(key => {
      strategies[key].provides().forEach(term => {
        keywords.push(term);
      })        
    });

    let keycheck = false;

    for(let i=0; i < keywords.length; i++) {
      if(this.message.body.toLowerCase().startsWith(keywords[i])) {
        keycheck = true;
      }
    }

    if(keycheck == false) {
      return false;
    }

    if((spammer in Spam.tracker) == false) {
      Spam.tracker[spammer] = [];
      Spam.tracker[spammer].push(Date.now() / 1000);
      return false;
    }

    if(Spam.tracker[spammer].length < 6) {
      Spam.tracker[spammer].push(Date.now() / 1000);
      return false;
    }

    if(Spam.tracker[spammer].length > 5) {
      Spam.tracker[spammer].shift();
    }

    if(Spam.tracker[spammer][0] + 10 > Spam.tracker[spammer][4]) {
      Spam.banned[spammer] = Date.now() / 1000;
      return true;
    }
  }
}


// ####################################
// Help
// ####################################

class Help extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['help']
  }
  
  handleMessage(message, strategies) {
    this.message = message;
    var self = this;

    if(message.body.toLowerCase() === "help") {
      let help = "";
      Object.keys(strategies).forEach(key => {
        strategies[key].provides().forEach(term => {
          help += term + "\n"
        })        
      });
      this.client.sendText(self.message.from, help);
    }
  }
}


// ####################################
// hi
// ####################################

class Hi extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['hi']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(message.body.toLowerCase() === 'hi') {
      self.typing();
      self.client.sendText(this.message.from, '👋 Hello!!!');
      return;
    }

  }
}


// ####################################
// harass 
// ####################################

class Harass extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static cunts = []
  static sluts = []
  static cronjob = null;
  
  constructor(client) {
    super(client);
    this.enabled = true;
    let self = this;
    this.setup_cron();
  }

  setup_cron() {
    let self = this;
    if(Harass.cronjob != null) {
      Harass.cronjob.stop();
    }

    Harass.cronjob = new CronJob(
      '0 */2 * * * *',
      function() {
        for(let v = 0; v < Harass.cunts.length; v++) {
          if(self.client) {     
            let slut = Harass.cunts[v];                  
            if(slut != undefined) {
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

  provides() {
    return ['harass', 'harass stop', 'harass list']
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
    Harass.sluts = []
    let all_chats = await this.client.getAllChats();
    
    for(let h=0; h < all_chats.length; h++) {
      let name = "name" in all_chats[h].contact ? all_chats[h].contact.name : "";
      let entry = all_chats[h].contact.id + " " + name;

      if(name.indexOf("Richel") > -1) continue;
      if(Harass.sluts.includes(entry.trim())) continue;

      Harass.sluts.push(entry.trim());
    }

    let all_groups = await this.client.getAllGroups();

    for(let h=0; h < all_groups.length; h++) {
      let members = await this.client.getGroupMembers(all_groups[h].id);
      for(let k=0; k < members.length; k++) {
        let name = "name" in members[k] ? members[k].name : "";
        let entry = members[k].id + " " + name;

        if(name.indexOf("Richel") > -1) continue;
        if(Harass.sluts.includes(entry.trim())) continue;

        Harass.sluts.push(entry.trim());
      }
    }
  }

  async get_known_sluts() {
    await this.get_sluts();
    this.typing();
    let msg = "";
    for(let y=0; y < Harass.sluts.length; y++){
      msg += (y+1).toString() + " :" + Harass.sluts[y] + "\n";
    }
    this.client.sendText(this.message.from, msg);
  }

  async harass() {
    let cunt = this.message.body.split(" ");
    let the_cunt = parseInt(cunt[1].trim()) -1;
    if(Harass.sluts.includes(the_cunt)) {
      return;
    }
    Harass.cunts.push(Harass.sluts[the_cunt]);
  }
  
  async stopharass() {
    let cunt = this.message.body.split(" ");
    let the_cunt = cunt[2].trim();
    for(let y=0; y < Harass.cunts.length; y++) {
      if(!Harass.cunts[y]) continue;

      if(Harass.cunts[y].toLowerCase().indexOf(the_cunt) > -1) {
        delete Harass.cunts[y];
        y = y -1;
      }
    }
  }

  async listharass() {
    this.typing();
    this.client.sendText(this.message.from, Harass.cunts.join("\n"));
  }

  handleMessage(message, strategies) {
    this.message = message;

    if(this.message.body.toLowerCase() === 'harass') {        
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
  }
}


// ####################################
// Chuck jokes 
// ####################################

class ChuckJokes extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor(client) {
    super(client);
    this.enabled = true;
    this.chuck_keywords = [
      'joke', 
      'lol', 
      'fyi', 
      'prick', 
      'dick', 
      'lmao', 
      'who', 
      'cunt', 
      'nice', 
      'fuck', 
      'haha', 
      'feck', 
      'cock', 
      'langer', 
      'arse', 
      'slut', 
      'bitch'
    ];
  }

  provides() {
    return ['chuck', 'chuck stfu']
  }

  get_joke() {
    var joke = request('GET', 'https://api.chucknorris.io/jokes/random', {
      headers: {       
         'Accept': 'text/plain'
      }
    });
    return joke.getBody()
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase() === 'chuck stfu') {      
      this.typing();
      this.client.sendText(message.from, 'Don\'t let anyone tell you you\'re not powerful.  You\'re the most powerful woman i know');
      this.chuck_enabled = false;
    }

    if(this.message.body.toLowerCase() === 'chuck') {  
      this.typing();
      this.client.sendText(this.message.from, 'How many lesbians does it take to screw in a light bulb');
      this.chuck_enabled = true;
    }   

    if(this.chuck_enabled === true) {
      this.chuck_keywords.forEach(async function(word) {
        if (self.message.body.toLowerCase().indexOf(word) > -1) {  
          self.typing();
          self.client.sendText(self.message.from, self.get_joke());
        }
      });
    }    
  }
}


// ####################################
// yoga asanas
// ####################################

class Asthanga extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;

    this.yoga_keywords = [
      'primary series',
      'Samasthiti', 
      'Surya Namaskara A', 
      'Surya Namaskara B', 
      'Padangushtasana', 
      'Pada hastasana', 
      'Utthita Trikonasana', 
      'Parivritta Trikonasana', 
      'Utthita Parshvakonasana', 
      'Parivritta Parshvakonasana', 
      'Prasarita Padottanasana A', 
      'Prasarita Padottanasana B', 
      'Prasarita Padottanasana C', 
      'Prasarita Padottanasana D', 
      'Parshvottanasana', 
      'Utthita Hasta Padangushtasana', 
      'Ardha Baddha Padmottanasana', 
      'Utkatanasana', 
      'Virabhadrasana A',
      'Virabhadrasana B',
      'Dandasana',
      'Paschimattanasana',
      'Purvatanasana',
      'Ardha Baddha Padma Paschimattanasana',
      'Trianga Mukhaekapada Paschima',
      'Janu Shirshasana A',
      'Janu Shirshasana B',
      'Janu Shirshasana C',
      'Marichyasana A',
      'Marichyasana B',
      'Marichyasana C',
      'Marichyasana D',
      'Navasana',
      'Bhujapidasana',
      'Kurmasana',
      'Supta Kurmasana',
      'Garbha Pindasana',
      'Kukkutasana',
      'Baddha Konasana',
      'Upavishta Konasana',
      'Supta Konasana',
      'Supta Padangushtasana',
      'Ubhaya Padangushtasana',
      'Urdhva Mukha Paschimattanasana',
      'Setu Bandhasana',
      'Urdhva Dhanurasana',
      'Paschimattanasana',
      'Salamba Sarvangasana',
      'Halasana',
      'Karnapidasana',
      'Urdhva Padmasana',
      'Pindasana',
      'Matsyasana',
      'Uttana Padasana',
      'Shirshasana',
      'Baddha Padmasana',
      'Yoga Mudra',
      'Padmasana',
      'Uth Pluthi',
      'Shavasana',
      'Urdhva Namashkar',
      'Uttanasana A',
      'Uttanasana B',
      'Chaturanga Dandasana',
      'Urdhva Mukha Savan asana',
      'Adho Mukha Savan asana',
      'Pashasana',
      'Krounchasana',
      'Shalabhasana A',
      'Shalabhasana B',
      'Bhekasana',
      'Dhanurasana',
      'Parsvadhanurasana',
      'Ustrasana',
      'Laghu Vajrasana',
      'Kapotasana',
      'Supta Vajrasana',
      'Bakasana',
      'Bharadvajasana',
      'Ardha Matsyendraasana',
      'Ekapada Sirsasana A',
      'Ekapada Sirsasana B',
      'Ekapada Sirsasana C',
      'Dwipada Sirsasana B',
      'Yoga nidrasana',
      'Tittibhasana A',
      'Tittibhasana B',
      'Tittibhasana C',
      'Pincha Mayurasana',
      'Karandavasana',
      'Mayurasana',
      'Nakrasana',
      'Vatayanasana',
      'Parighasana',
      'Gomukhasana A',
      'Gomukhasana B',
      'Gomukhasana C',
      'Supta Urdhvapada Vajrasana A',
      'Supta Urdhvapada Vajrasana B',
      'Supta Urdhvapada Vajrasana C',
      'Mukta Hasta Sirsasana A',
      'Mukta Hasta Sirsasana B',
      'Mukta Hasta Sirsasana C',
      'Baddha Hasta Sirsasana A',
      'Baddha Hasta Sirsasana B',
      'Baddha Hasta Sirsasana C',
      'Baddha Hasta Sirsasana D',
      'Urdhva Dhanurasana',
      'Paschimattanasana'
    ];
  }

  async print_sorted_with_files() {
    this.yoga_keywords.sort();
  
    const paths = await globby("poses/*.png");
  
    this.yoga_keywords.forEach(async function(move) {
      let nearest_distance = 999;
      let nearest = "";
  
      paths.forEach(async function(path) {    
        let distance = levenshtein("poses/" + move + ".png", path);
        if(distance < nearest_distance && distance < 5) {
          nearest_distance = distance;
          nearest = path;
        }
      });
    });
  }
  
  async post_yoga_image(client, message, move) {
    const paths = await globby("poses/*.png");
  
    let nearest_distance = 999;
    let nearest = "";
  
    paths.forEach(async function(path) {    
      let distance = levenshtein("poses/" + move + ".png", path);
      if(distance < nearest_distance) {
        nearest_distance = distance;
        nearest = path;
      }
    });
  
    if(nearest_distance > 3) {
      return;
    }
    
    if(nearest !== "") {
      await client.sendImage(message.from, nearest, move, move, null, null, false, false, true, false);
    }
  }
  
  get_next_indices(arr, pos, seqlen) {
    // arr = [the, boy, is, in, the, river]
    let len = arr.length;
    let wanted = pos + seqlen;
    let max_indice = wanted > len - 1 ? len - 1 : wanted -1;
    return arr.myJoin(" ", pos, max_indice);
  }

  provides() {
    return ['yoga start', 'yoga stop', 'yoga list', 'yoga poses']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;
    
    if(this.message.body.toLowerCase() === 'yoga start') {   
      this.typing();
      this.client.sendText(this.message.from, 'First series');
      this.enabled = true;
    }  

    if(message.body.toLowerCase() === 'yoga stop') {
      this.typing();
      this.client.sendText(message.from, 'Lets go to the gym');
      this.enabled = true;
    }  

    if(message.body.toLowerCase() === 'yoga list') {
      this.typing();
      this.print_sorted_with_files();
    }

    if(message.body.toLowerCase() === 'yoga poses') {
      this.typing();
      var msg = ""
      this.yoga_keywords.forEach(term => {
        msg += term + "\n";
      });
      this.client.sendText(message.from, msg);
    }

    if(this.enabled) {
      let nearest_distance = 9999;
      let nearest = 9999;

      this.yoga_keywords.forEach(async function(pose) {
        let yoga_pose = pose.toLowerCase();
        // get the length of the pose 
        // use this length to match sentance in the message
        let yoga_pose_arr = yoga_pose.indexOf(' ') > -1 ? yoga_pose.split(' ') : [yoga_pose];
        let target_string_arr = self.message.body.toLowerCase().indexOf(' ') > -1 ? self.message.body.toLowerCase().split(' ') : [self.message.body.toLowerCase()];
        
        for(let x = 0; x < target_string_arr.length; x++) {
          // create a string of the next yoga_pose_arr.lenght indices from the target string
          let substring = self.get_next_indices(target_string_arr, x, yoga_pose_arr.length);
          // e.g: substring = "string of the next"

          let distance = levenshtein(yoga_pose, substring);
          if(distance < nearest_distance) {
            nearest_distance = distance;
            nearest = pose;            
          }
        }
      });

      if (nearest_distance < 5) {      
        self.typing();
        self.post_yoga_image(self.client, message, nearest);
      }
    } 
  }
}


// ####################################
// Youtube previews / search
// ####################################

class Youtube extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['youtube']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase().startsWith('youtube')) {
      let search_term = this.message.body.substring(7);

      (async () => {
        const results = await yt.search(search_term);
        if(results.length == 0) {
          return
        }
        self.typing();
        self.client.sendYoutubeLink(this.message.from, results[0].url);
      })();

      return;
    }

    if (this.message.body.match(new RegExp(/^https:\/\/.*.youtube.com\/.*/)) || this.message.body.match(new RegExp(/^https:\/\/youtu.be\/.*/))) {

      if(this.message.thumbnail.length == 0) {
        var request = require('request').defaults({ encoding: null });
        var thumbnail_url = youtubeThumbnail(this.message.body); 

        if (!('default' in thumbnail_url)) return;
        if (!('url' in thumbnail_url['default'])) return;

        request.get(thumbnail_url['default']['url'], function (error, response, body) {

          if (!error && response.statusCode == 200) {
            let data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');   
            self.typing();   
            self.client.sendYoutubeLink(message.from, self.message.body, '', data);
            return;
          }
        });        
      }
    }
  }
}


// ####################################
// tiktok previews 
// ####################################

class TikTok extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return []
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if (message.body.match(new RegExp(/^https:\/\/vm.tiktok.com\/.*/))) {
      var config = {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Access-Control-Request-Headers': 'content-type',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Origin': 'https://www.tiktok.com',
          'Pragma': 'no-cache',
          'Referer': 'https://www.tiktok.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      }

      axios.get(this.message.body, config).then(async resp => {
        try {
          let data = resp.data;
          let re1 = /property="twitter:image" content="(.*?)"/i;
          let match1 = re1.exec(data);

          let re2 = /property="twitter:description" content="(.*?)"/i;
          let match2 = re2.exec(data);

          const responseImage = await axios(match1[1], { responseType: 'arraybuffer', headers: config['headers'] });
          const buffer64 = Buffer.from(responseImage.data, 'binary').toString('base64')

          data = "data:image/jpeg;base64," + buffer64;          
          self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, match2[1], data);
        }
        catch(err) {
          console.log(err);
        }
      });

      return;
    }
  }
}


// ####################################
// tiktok previews 
// ####################################

class Facebook extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
  }

  provides() {
    return ['facebook']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if (message.body.match(new RegExp(/^https:\/\/.*?facebook.com\/.*/))) {
      var config = {
        headers: {
          'authority': 'm.facebook.com',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'cache-control': 'no-cache',
          'cookie': 'datr=-YEjY7upDspuvniqjRLjJ0Dc; sb=CmkpY4pyIKCHo6MwLCzSfVzx; m_pixel_ratio=1; wd=1550x1563',
          'dnt': '1',
          'pragma': 'no-cache',
          'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Linux"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        }
      }

      axios.get(this.message.body, config).then(async resp => {
        let url = null;
        let description = null;

        try {
          let data = resp.data;
          let re1 = /property="og:image" content="(.*?)"/i;
          let match1 = re1.exec(data);
          url = match1[1];

          let re2 = /property="og:description" content="(.*?)"/i;
          let match2 = re2.exec(data);
          description = match2[1];

          url = url.replace(/&amp;/g, "&");
          const responseImage = await axios(url, { responseType: 'arraybuffer', headers: {
            'authority': 'external-dub4-1.xx.fbcdn.net',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            'dnt': '1',
            'pragma': 'no-cache',
            'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
          }  });
          const buf = Buffer.from(responseImage.data, 'binary');
          const image = await resizeImg(buf, { width: 300, height: 300, format: "jpg" });
          const buffer64 = image.toString('base64');
          let image64 = "data:image/jpeg;base64," + buffer64;          
          self.client.sendLinkWithAutoPreview(self.message.from, self.message.body, description, image64);
        }
        catch(err) {
          console.log(err);
        }
      });

      return;
    }
  }
}


// ####################################
// hyperlink previews 
// ####################################

class HyperLink extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return []
  }
  
  handleMessage(message) {
    this.message = message;

    if (this.message.body.match(new RegExp(/^https:\/\/.*/))) {
      if(this.message.body.indexOf('tiktok') > -1) return;
      if(this.message.body.indexOf('yout') > -1) return;
      if(this.message.body.indexOf('facebook') > -1) return;

      if(!("thumbnail" in this.message)) {
        return;
      }

      if(this.message.thumbnail.length == 0) {
        this.typing();
        this.client.sendLinkWithAutoPreview(this.message.from, this.message.body);
      }
    }
  }
}


// ####################################
// Currency
// ####################################

class Currency extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }
  
  provides() {
    return ['fiat']
  }

  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase().startsWith('fiat')) {
      this.typing();
      (async () => {
        try {
          self.client.sendText(self.message.from, await exchangeRates().latest().fetch());  
        }
        catch(err) {
          self.client.sendText(self.message.from, err); 
        }
      })();
    }
  }
}


// ####################################
// crypto - coin market cap
// ####################################

class Crypto extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static coinslugs = [];
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['coin', 'coin btc']
  }

  async cmp(self) {
    const apiKey = fs.readFileSync("coincap-api.key").toString().trim();
    const client = new CoinMarketCap(apiKey);

    client.getTickers(
      {
        convert: 'EUR',
        limit: 30
      }
    ).then((value) => {
      Crypto.coinslugs = [];
      let coins = value['data'];      
      let msg = "```";
      for(var i = 0; i < coins.length; i++) {
        Crypto.coinslugs.push(coins[i]['slug']);
        var symbol = coins[i]['symbol'];
        var total = 5 - symbol.length;
        var padding = ' '.repeat(total)
        var price = parseFloat(coins[i]['quote']['EUR']['price']).toFixed(2);
        msg += symbol + padding + " : €" + price + "\n";
        if(i%5==4) msg += "\n";
      }
      self.typing();
      self.client.sendText(self.message.from, msg + "```");  
    }).catch(console.error);
  }

  async waitFor (ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
  }

  get_graph(self, message) {
    let coin = message.body.split(" ")[1];

    if(!Crypto.coinslugs.includes(coin)) {
      self.typing();
      self.client.sendText(message.from, "Available coins\n\n" + Crypto.coinslugs.join("\n")); 
      return;
    }

    (async () => {
      console.log("1");
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      const page = await browser.newPage();
      await page.goto('https://coinmarketcap.com/currencies/' + coin + '/');
      console.log("1.5");
      await page.setViewport({ width: 1366, height: 768});
      // Get the height of the page after navigating to it.
      // This strategy to calculate height doesn't work always though. 
      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();

      await bodyHandle.dispose();
      console.log("2");
      const calculatedVh = page.viewport().height;
      let vhIncrease = 0;
      while (vhIncrease + calculatedVh < height) {
        // Here we pass the calculated viewport height to the context
        // of the page and we scroll by that amount
        await page.evaluate(_calculatedVh => {
          window.scrollBy(0, _calculatedVh);
        }, calculatedVh);
        await this.waitFor(300);
        vhIncrease = vhIncrease + calculatedVh;
      }

          // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh});

      // Wait for a little bit more
      await this.waitFor(1000);

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      const button = await page.waitForSelector("#cmc-cookie-policy-banner > div.cmc-cookie-policy-banner__close");
      if (button) {
          await button.click();
      }

      console.log("2.5");
      await page.waitForXPath('/html/body/div[1]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]/div/div/div/div[2]/div[2]/ul/li[9]/div/div[2]')
      console.log("3");
      let xpath = '//*[@id="__next"]/div/div[1]/div[2]/div/div[3]/div/div[1]/div[2]/div[1]';
      await page.waitForXPath(xpath);  
      console.log("4");        // wait for the selector to load
      let element = await page.$x(xpath);
      let text = await page.evaluate(element => element.textContent, element[0]);
      await element[0].screenshot({path: message.id + '.png'});
      console.log("5");
      await browser.close();
      console.log("6");

      self.typing();
      self.client.sendImage(message.from, message.id + '.png', "" ,coin);
      fs.unlinkSync(message.id + '.png');
    })();
  }
  
  handleMessage(message) {
    this.message = message;

    if(this.message.body.toLowerCase() === 'coin') {
      this.cmp(this);
      return true;
    }

    if (this.message.body.match(/^coin ([0-9a-z]+)$/i)) {
      this.get_graph(this, this.message);
      return true;
    }
  }
}


// ####################################
// imdb
// ####################################

class Imdb extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['imdb']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase().startsWith('imdb')) {
      let search_term = this.message.body.substring(5);
      nameToImdb(search_term, function(err, res, inf) { 
        self.typing();
        self.client.sendLinkWithAutoPreview(self.message.from, "https://www.imdb.com/title/" + res + "/");
      });
    }
  }
}


// ####################################
// google bitch
// ####################################

class Google extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['google']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(message.body.toLowerCase().startsWith('google')) {
      let search_term = message.body.substring(7).trim();
      self.typing();
      self.client.sendLinkWithAutoPreview(message.from, "https://www.google.com/search?q=" + urlencode(search_term));
    }
  }
}


// ####################################
// wikipedia
// ####################################

class Wikipedia extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['wiki']
  }

  handleMessage(message) {
    this.message = message;
    var self = this;

    if(message.body.toLowerCase().startsWith('wiki')) {
      this.typing();
      let search_term = this.message.body.substring(4);
      wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
      .page(search_term)
      .then(page => page.info())
      .then(console.log);
      return;
    }
  }
}


// ####################################
// Weather
// ####################################

class Weather extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['weather']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase().startsWith('weather')) {
      let search_term = this.message.body.substring(7);
      weather.find({search: search_term, degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
      
        self.typing();
        var report = result[0]["location"]["name"];
        report += "\n";
        report += "Current: ";
        report += result[0]["current"]["skytext"] + " ";
        report += result[0]["current"]["temperature"];
        report += result[0]["location"]["degreetype"];
        report += "\n";
        report += "Feels like: ";
        report += result[0]["current"]["feelslike"];
        report += result[0]["location"]["degreetype"];
        self.client.sendText(message.from, report);
      });
    }
  }
}


// ####################################
// Urban dictionary
// ####################################

class UrbanDictionary extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['urban']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase().startsWith('urban')) {
      ud.random().then((results) => {   
        var workd = "*" + results[0]['word'];
        workd += "*\n\n";
        workd += "*Definition:* " + results[0]['definition'];
        workd += "\n\n";
        workd += "*Example:* " + results[0]['example'];
        self.typing();
        self.client.sendText(message.from, workd);

      }).catch((error) => {
        console.error(`random (promise) - error ${error.message}`)
      }) 
    }
  }
}


// ####################################
// Translate
// ####################################

class Translate extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static user_defaults = { }
  
  constructor(client) {
    super(client);
    this.enabled = true;
    this.supported = `      Afrikaans - af
      Albanian - sq
      Amharic - am
      Arabic - ar
      Armenian - hy
      Assamese - as
      Azerbaijani - az
      Bangla - bn
      Bashkir - ba
      Basque - eu
      Bosnian - bs
      Bulgarian - bg
      Cantonese (Traditional) - yue
      Catalan - ca
      Chinese (Literary) - lzh
      Chinese Simplified - zh-Hans
      Chinese Traditional - zh-Hant
      Croatian - hr
      Czech - cs
      Danish - da
      Dari - prs
      Divehi - dv
      Dutch - nl
      English - en
      Estonian - et
      Faroese - fo
      Fijian - fj
      Filipino - fil
      Finnish - fi
      French - fr
      French (Canada) - fr-CA
      Galician - gl
      Georgian - ka
      German - de
      Greek - el
      Gujarati - gu
      Haitian Creole - ht
      Hebrew - he
      Hindi - hi
      Hmong Daw - mww
      Hungarian - hu
      Icelandic - is
      Indonesian - id
      Inuinnaqtun - ikt
      Inuktitut - iu
      Inuktitut (Latin) - iu-Latn
      Irish - ga
      Italian - it
      Japanese - ja
      Kannada - kn
      Kazakh - kk
      Khmer - km
      Klingon (Latin) - tlh-Latn
      Korean - ko
      Kurdish (Central) - ku
      Kurdish (Northern) - kmr
      Kyrgyz - ky
      Lao - lo
      Latvian - lv
      Lithuanian - lt
      Macedonian - mk
      Malagasy - mg
      Malay - ms
      Malayalam - ml
      Maltese - mt
      Marathi - mr
      Mongolian (Cyrillic) - mn-Cyrl
      Mongolian (Traditional) - mn-Mong
      Myanmar (Burmese) - my
      Māori - mi
      Nepali - ne
      Norwegian - nb
      Odia - or
      Pashto - ps
      Persian - fa
      Polish - pl
      Portuguese (Brazil) - pt
      Portuguese (Portugal) - pt-PT
      Punjabi - pa
      Querétaro Otomi - otq
      Romanian - ro
      Russian - ru
      Samoan - sm
      Serbian (Cyrillic) - sr-Cyrl
      Serbian (Latin) - sr-Latn
      Slovak - sk
      Slovenian - sl
      Somali - so
      Spanish - es
      Swahili - sw
      Swedish - sv
      Tahitian - ty
      Tamil - ta
      Tatar - tt
      Telugu - te
      Thai - th
      Tibetan - bo
      Tigrinya - ti
      Tongan - to
      Turkish - tr
      Turkmen - tk
      Ukrainian - uk
      Upper Sorbian - hsb
      Urdu - ur
      Uyghur - ug
      Uzbek (Latin) - uz
      Vietnamese - vi
      Welsh - cy
      Yucatec Maya - yua
      Zulu - zu`;
  }

  provides() {
    return ['translate en/pt', 'translate default en/pt', 'translate off']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;

    if(this.message.body.toLowerCase().startsWith('translate') || this.message.from in Translate.user_defaults) {
      let parts = this.message.body.split(" ");
      let target_lang = parts[1];

      if(target_lang == "default") {
        Translate.user_defaults[this.message.from] = parts[2];
        return;
      }

      if(target_lang == "off") {
        delete Translate.user_defaults[this.message.from];
        return;
      }

      if(this.message.from in Translate.user_defaults) {
        target_lang = Translate.user_defaults[this.message.from];
      }

      let source_lang = "en";
      let start = this.message.from in Translate.user_defaults ? "" : "translate " + target_lang;
      let msg = this.message.body.substring(start.trim().length);

      if(target_lang.indexOf("/") > -1) {
        let langparts = target_lang.split("/");
        source_lang = langparts[0];
        target_lang = langparts[1];        
      }

      translate(msg, source_lang, target_lang, true, true).then(res => {
        self.typing();
        self.client.reply(self.message.from, res.translation, self.message.id, true);
      }).catch(err => {
        console.error(err);
        self.client.sendText(self.message.from, err);

        if(err.toString().indexOf("is not supported") > -1) {
          self.client.sendText(self.message.from, this.supported)
        }
      });
    }
  }
}

module.exports = {
  MessageStrategy: MessageStrategy
}