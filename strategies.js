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
const CoinMarketCap = require('coinmarketcap-api')
const fs = require("fs");


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
  constructor(client) {
    this.client = client;
  }

  async typing() {
    await this.client.simulateTyping(this.message.chatId, true);
    // simulate typing for up to 2 seconds
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000)));
    await this.client.simulateTyping(this.message.chatId, false);
  }
}


// ####################################
// Chuck jokes 
// ####################################

class ChuckJokes extends MessageStrategy {
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
    return ['chuck', 'stfu chuck']
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

    if(this.message.body.toLowerCase() === 'stfu chuck') {      
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
    return ['bend', 'stiff', 'list', 'poses']
  }
  
  handleMessage(message) {
    this.message = message;
    var self = this;
    
    if(this.message.body.toLowerCase() === 'bend') {   
      this.typing();
      this.client.sendText(this.message.from, 'First series');
      this.enabled = true;
    }  

    if(message.body.toLowerCase() === 'stiff') {
      this.typing();
      this.client.sendText(message.from, 'Lets go to the gym');
      this.enabled = true;
    }  

    if(message.body.toLowerCase() === 'list') {
      this.typing();
      this.print_sorted_with_files();
    }

    if(message.body.toLowerCase() === 'poses') {
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
          // console.log(resp.data);
          let data = resp.data;
          let re1 = /property="twitter:image" content="(.*?)"/i;
          let match1 = re1.exec(data);
          console.log(match1[1]);

          let re2 = /property="twitter:description" content="(.*?)"/i;
          let match2 = re2.exec(data);
          console.log(match2[1]);

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
// hyperlink previews 
// ####################################

class HyperLink extends MessageStrategy {
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
  constructor(client) {
    super(client);
    this.enabled = true;
  }

  provides() {
    return ['coin']
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
      let coins = value['data'];
      let msg = "```";
      for(var i = 0; i < coins.length; i++) {
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
  
  handleMessage(message) {
    this.message = message;

    if(this.message.body.toLowerCase().startsWith('coin')) {
      this.cmp(this);
    }
  }
}


// ####################################
// imdb
// ####################################

class Imdb extends MessageStrategy {
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
      self.client.sendLinkWithAutoPreview(message.from, "https://www.google.com/search?q=" + search_term);
    }
  }
}


// ####################################
// wikipedia
// ####################################

class Wikipedia extends MessageStrategy {
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
// hi
// ####################################

class Hi extends MessageStrategy {
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
// Weather
// ####################################

class Weather extends MessageStrategy {
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

module.exports = {
    ChuckJokes: ChuckJokes,
    Asthanga: Asthanga,
    Youtube: Youtube,
    TikTok: TikTok,
    HyperLink: HyperLink,
    Currency: Currency,
    Crypto: Crypto,
    Imdb: Imdb,
    Google: Google,
    Wikipedia: Wikipedia,
    Weather: Weather,
    UrbanDictionary: UrbanDictionary,
    Hi: Hi
}