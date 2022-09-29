const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Weather
// ####################################

class Weather extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['Weather'] = {
      'enabled': true
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Provides the weather report for a given region"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['weather ([a-zA-Z]+)']
  }

  handleMessage(message) {
    if (MessageStrategy.state['Weather']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.toLowerCase().startsWith('weather')) {
      let search_term = this.message.body.substring(7);
      weather.find({ search: search_term, degreeType: 'C' }, function (err, result) {
        if (err) console.log(err);

        MessageStrategy.typing(self.message);
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

      return true;
    }

    return false;
  }
}

module.exports = {
  MessageStrategy: Weather
}