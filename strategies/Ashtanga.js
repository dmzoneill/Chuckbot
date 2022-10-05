const MessageStrategy = require("../MessageStrategy.js")

Array.prototype.myJoin = function(seperator,start,end){
  if(!start) start = 0;
  if(!end) end = this.length - 1;
  end++;
  return this.slice(start,end).join(seperator);
};

// ####################################
// yoga asanas
// ####################################

class Ashtanga extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('Ashtanga', {
      'enabled': true
    });

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
    try {
      this.yoga_keywords.sort();

      const paths = await globby("strategies/poses/*.png");

      this.yoga_keywords.forEach(async function (move) {
        let nearest_distance = 999;
        let nearest = "";

        paths.forEach(async function (path) {
          let distance = levenshtein("strategies/poses/" + move + ".png", path);
          if (distance < nearest_distance && distance < 5) {
            nearest_distance = distance;
            nearest = path;
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async post_yoga_image(client, message, move) {
    try {
      const paths = await globby("strategies/poses/*.png");

      let nearest_distance = 999;
      let nearest = "";

      paths.forEach(async function (path) {
        let distance = levenshtein("strategies/poses/" + move + ".png", path);
        if (distance < nearest_distance) {
          nearest_distance = distance;
          nearest = path;
        }
      });

      if (nearest_distance > 3) {
        return;
      }

      if (nearest !== "") {
        await client.sendImage(message.from, nearest, move, move, null, null, false, false, true, false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  get_next_indices(arr, pos, seqlen) {
    // arr = [the, boy, is, in, the, river]
    let len = arr.length;
    let wanted = pos + seqlen;
    let max_indice = wanted > len - 1 ? len - 1 : wanted - 1;
    return arr.myJoin(" ", pos, max_indice);
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Prints a picture of a yoga pose when detected and other functionality"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['yoga start', 'yoga stop', 'yoga list', 'yoga poses']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Ashtanga']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.toLowerCase() === 'yoga start') {
      MessageStrategy.typing(self.message);
      MessageStrategy.client.sendText(this.message.from, 'First series');
      this.enabled = true;
    }

    if (message.body.toLowerCase() === 'yoga stop') {
      MessageStrategy.typing(self.message);
      MessageStrategy.client.sendText(message.from, 'Lets go to the gym');
      this.enabled = true;
    }

    if (message.body.toLowerCase() === 'yoga list') {
      MessageStrategy.typing(self.message);
      this.print_sorted_with_files();
    }

    if (message.body.toLowerCase() === 'yoga poses') {
      MessageStrategy.typing(self.message);
      var msg = ""
      this.yoga_keywords.forEach(term => {
        msg += term + "\n";
      });
      MessageStrategy.client.sendText(message.from, msg);
    }

    if (this.enabled) {
      let nearest_distance = 9999;
      let nearest = 9999;

      this.yoga_keywords.forEach(async function (pose) {
        try {
          let yoga_pose = pose.toLowerCase();
          // get the length of the pose 
          // use this length to match sentance in the message
          let yoga_pose_arr = yoga_pose.indexOf(' ') > -1 ? yoga_pose.split(' ') : [yoga_pose];
          let target_string_arr = self.message.body.toLowerCase().indexOf(' ') > -1 ? self.message.body.toLowerCase().split(' ') : [self.message.body.toLowerCase()];

          for (let x = 0; x < target_string_arr.length; x++) {
            // create a string of the next yoga_pose_arr.lenght indices from the target string
            let substring = self.get_next_indices(target_string_arr, x, yoga_pose_arr.length);
            // e.g: substring = "string of the next"

            let distance = levenshtein(yoga_pose, substring);
            if (distance < nearest_distance) {
              nearest_distance = distance;
              nearest = pose;
            }
          }
        } catch (err) {
          console.log(err);
        }
      });

      let check_distance = nearest == "Navasana" ? 1 : 5;

      if (nearest_distance < check_distance) {
        MessageStrategy.typing(self.message);
        self.post_yoga_image(self.client, message, nearest);
        return true;
      }
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: Ashtanga
}