const MessageStrategy = require("../MessageStrategy.js");

// ####################################
// WorldCup  
// ####################################

class WorldCup extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;
  static flags = {
    "AscensionIsland": "🇦🇨",
    "Andorra": "🇦🇩",
    "UnitedArabEmirates": "🇦🇪",
    "Afghanistan": "🇦🇫",
    "Antigua&Barbuda": "🇦🇬",
    "Anguilla": "🇦🇮",
    "Albania": "🇦🇱",
    "Armenia": "🇦🇲",
    "Angola": "🇦🇴",
    "Antarctica": "🇦🇶",
    "Argentina": "🇦🇷",
    "AmericanSamoa": "🇦🇸",
    "Austria": "🇦🇹",
    "Australia": "🇦🇺",
    "Aruba": "🇦🇼",
    "ÅlandIslands": "🇦🇽",
    "Azerbaijan": "🇦🇿",
    "Bosnia&Herzegovina": "🇧🇦",
    "Barbados": "🇧🇧",
    "Bangladesh": "🇧🇩",
    "Belgium": "🇧🇪",
    "BurkinaFaso": "🇧🇫",
    "Bulgaria": "🇧🇬",
    "Bahrain": "🇧🇭",
    "Burundi": "🇧🇮",
    "Benin": "🇧🇯",
    "St.Barthélemy": "🇧🇱",
    "Bermuda": "🇧🇲",
    "Brunei": "🇧🇳",
    "Bolivia": "🇧🇴",
    "CaribbeanNetherlands": "🇧🇶",
    "Brazil": "🇧🇷",
    "Bahamas": "🇧🇸",
    "Bhutan": "🇧🇹",
    "BouvetIsland": "🇧🇻",
    "Botswana": "🇧🇼",
    "Belarus": "🇧🇾",
    "Belize": "🇧🇿",
    "Canada": "🇨🇦",
    "Cocos(Keeling)Islands": "🇨🇨",
    "Congo-Kinshasa": "🇨🇩",
    "CentralAfricanRepublic": "🇨🇫",
    "Congo-Brazzaville": "🇨🇬",
    "Switzerland": "🇨🇭",
    "Côted’Ivoire": "🇨🇮",
    "CookIslands": "🇨🇰",
    "Chile": "🇨🇱",
    "Cameroon": "🇨🇲",
    "China": "🇨🇳",
    "Colombia": "🇨🇴",
    "ClippertonIsland": "🇨🇵",
    "Costa Rica": "🇨🇷",
    "Cuba": "🇨🇺",
    "CapeVerde": "🇨🇻",
    "Curaçao": "🇨🇼",
    "ChristmasIsland": "🇨🇽",
    "Cyprus": "🇨🇾",
    "Czechia": "🇨🇿",
    "Germany": "🇩🇪",
    "DiegoGarcia": "🇩🇬",
    "Djibouti": "🇩🇯",
    "Denmark": "🇩🇰",
    "Dominica": "🇩🇲",
    "DominicanRepublic": "🇩🇴",
    "Algeria": "🇩🇿",
    "Ceuta&Melilla": "🇪🇦",
    "Ecuador": "🇪🇨",
    "Estonia": "🇪🇪",
    "Egypt": "🇪🇬",
    "WesternSahara": "🇪🇭",
    "Eritrea": "🇪🇷",
    "Spain": "🇪🇸",
    "Ethiopia": "🇪🇹",
    "EuropeanUnion": "🇪🇺",
    "Finland": "🇫🇮",
    "Fiji": "🇫🇯",
    "FalklandIslands": "🇫🇰",
    "Micronesia": "🇫🇲",
    "FaroeIslands": "🇫🇴",
    "France": "🇫🇷",
    "Gabon": "🇬🇦",
    "UnitedKingdom": "🇬🇧",
    "Grenada": "🇬🇩",
    "Georgia": "🇬🇪",
    "FrenchGuiana": "🇬🇫",
    "Guernsey": "🇬🇬",
    "Ghana": "🇬🇭",
    "Gibraltar": "🇬🇮",
    "Greenland": "🇬🇱",
    "Gambia": "🇬🇲",
    "Guinea": "🇬🇳",
    "Guadeloupe": "🇬🇵",
    "EquatorialGuinea": "🇬🇶",
    "Greece": "🇬🇷",
    "SouthGeorgia&": "🇬🇸",
    "Guatemala": "🇬🇹",
    "Guam": "🇬🇺",
    "Guinea-Bissau": "🇬🇼",
    "Guyana": "🇬🇾",
    "HongKongSAR": "🇭🇰",
    "Heard&McDonald": "🇭🇲",
    "Honduras": "🇭🇳",
    "Croatia": "🇭🇷",
    "Haiti": "🇭🇹",
    "Hungary": "🇭🇺",
    "CanaryIslands": "🇮🇨",
    "Indonesia": "🇮🇩",
    "Ireland": "🇮🇪",
    "Israel": "🇮🇱",
    "IsleofMan": "🇮🇲",
    "India": "🇮🇳",
    "BritishIndianOcean": "🇮🇴",
    "Iraq": "🇮🇶",
    "Iran": "🇮🇷",
    "Iceland": "🇮🇸",
    "Italy": "🇮🇹",
    "Jersey": "🇯🇪",
    "Jamaica": "🇯🇲",
    "Jordan": "🇯🇴",
    "Japan": "🇯🇵",
    "Kenya": "🇰🇪",
    "Kyrgyzstan": "🇰🇬",
    "Cambodia": "🇰🇭",
    "Kiribati": "🇰🇮",
    "Comoros": "🇰🇲",
    "St.Kitts&": "🇰🇳",
    "NorthKorea": "🇰🇵",
    "Korea Republic": "🇰🇷",
    "Kuwait": "🇰🇼",
    "CaymanIslands": "🇰🇾",
    "Kazakhstan": "🇰🇿",
    "Laos": "🇱🇦",
    "Lebanon": "🇱🇧",
    "St.Lucia": "🇱🇨",
    "Liechtenstein": "🇱🇮",
    "SriLanka": "🇱🇰",
    "Liberia": "🇱🇷",
    "Lesotho": "🇱🇸",
    "Lithuania": "🇱🇹",
    "Luxembourg": "🇱🇺",
    "Latvia": "🇱🇻",
    "Libya": "🇱🇾",
    "Morocco": "🇲🇦",
    "Monaco": "🇲🇨",
    "Moldova": "🇲🇩",
    "Montenegro": "🇲🇪",
    "St.Martin": "🇲🇫",
    "Madagascar": "🇲🇬",
    "MarshallIslands": "🇲🇭",
    "NorthMacedonia": "🇲🇰",
    "Mali": "🇲🇱",
    "Myanmar(Burma)": "🇲🇲",
    "Mongolia": "🇲🇳",
    "MacaoSarChina": "🇲🇴",
    "NorthernMarianaIslands": "🇲🇵",
    "Martinique": "🇲🇶",
    "Mauritania": "🇲🇷",
    "Montserrat": "🇲🇸",
    "Malta": "🇲🇹",
    "Mauritius": "🇲🇺",
    "Maldives": "🇲🇻",
    "Malawi": "🇲🇼",
    "Mexico": "🇲🇽",
    "Malaysia": "🇲🇾",
    "Mozambique": "🇲🇿",
    "Namibia": "🇳🇦",
    "NewCaledonia": "🇳🇨",
    "Niger": "🇳🇪",
    "NorfolkIsland": "🇳🇫",
    "Nigeria": "🇳🇬",
    "Nicaragua": "🇳🇮",
    "Netherlands": "🇳🇱",
    "Norway": "🇳🇴",
    "Nepal": "🇳🇵",
    "Nauru": "🇳🇷",
    "Niue": "🇳🇺",
    "NewZealand": "🇳🇿",
    "Oman": "🇴🇲",
    "Panama": "🇵🇦",
    "Peru": "🇵🇪",
    "FrenchPolynesia": "🇵🇫",
    "PapuaNewGuinea": "🇵🇬",
    "Philippines": "🇵🇭",
    "Pakistan": "🇵🇰",
    "Poland": "🇵🇱",
    "St.Pierre&": "🇵🇲",
    "PitcairnIslands": "🇵🇳",
    "PuertoRico": "🇵🇷",
    "PalestinianTerritories": "🇵🇸",
    "Portugal": "🇵🇹",
    "Palau": "🇵🇼",
    "Paraguay": "🇵🇾",
    "Qatar": "🇶🇦",
    "Réunion": "🇷🇪",
    "Romania": "🇷🇴",
    "Serbia": "🇷🇸",
    "Russia": "🇷🇺",
    "Rwanda": "🇷🇼",
    "Saudi Arabia": "🇸🇦",
    "SolomonIslands": "🇸🇧",
    "Seychelles": "🇸🇨",
    "Sudan": "🇸🇩",
    "Sweden": "🇸🇪",
    "Singapore": "🇸🇬",
    "St.Helena": "🇸🇭",
    "Slovenia": "🇸🇮",
    "Svalbard&Jan": "🇸🇯",
    "Slovakia": "🇸🇰",
    "SierraLeone": "🇸🇱",
    "SanMarino": "🇸🇲",
    "Senegal": "🇸🇳",
    "Somalia": "🇸🇴",
    "Suriname": "🇸🇷",
    "SouthSudan": "🇸🇸",
    "SãoTomé&": "🇸🇹",
    "ElSalvador": "🇸🇻",
    "SintMaarten": "🇸🇽",
    "Syria": "🇸🇾",
    "Eswatini": "🇸🇿",
    "TristanDaCunha": "🇹🇦",
    "Turks&Caicos": "🇹🇨",
    "Chad": "🇹🇩",
    "FrenchSouthernTerritories": "🇹🇫",
    "Togo": "🇹🇬",
    "Thailand": "🇹🇭",
    "Tajikistan": "🇹🇯",
    "Tokelau": "🇹🇰",
    "Timor-Leste": "🇹🇱",
    "Turkmenistan": "🇹🇲",
    "Tunisia": "🇹🇳",
    "Tonga": "🇹🇴",
    "Turkey": "🇹🇷",
    "Trinidad&Tobago": "🇹🇹",
    "Tuvalu": "🇹🇻",
    "Taiwan": "🇹🇼",
    "Tanzania": "🇹🇿",
    "Ukraine": "🇺🇦",
    "Uganda": "🇺🇬",
    "U.S.OutlyingIslands": "🇺🇲",
    "UnitedNations": "🇺🇳",
    "United States": "🇺🇸",
    "Uruguay": "🇺🇾",
    "Uzbekistan": "🇺🇿",
    "VaticanCity": "🇻🇦",
    "St.Vincent&": "🇻🇨",
    "Venezuela": "🇻🇪",
    "BritishVirginIslands": "🇻🇬",
    "U.S.VirginIslands": "🇻🇮",
    "Vietnam": "🇻🇳",
    "Vanuatu": "🇻🇺",
    "Wallis&Futuna": "🇼🇫",
    "Samoa": "🇼🇸",
    "Kosovo": "🇽🇰",
    "Yemen": "🇾🇪",
    "Mayotte": "🇾🇹",
    "SouthAfrica": "🇿🇦",
    "Zambia": "🇿🇲",
    "Zimbabwe": "🇿🇼",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "forTexas(US-TX)": "🏴󠁵󠁳󠁴󠁸󠁿"
  }

  constructor() {
    super('WorldCup', {
      'enabled': true
    });
  }

  provides() {
    WorldCup.self = this;

    return {
      help: 'Show world cup information',
      provides: {
        'wc update': {
          test: function (message) {
            return true;
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'To do';
          },
          action: function Update(message) {
            WorldCup.self.Update(message);
            return false;
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc groups': {
          test: function (message) {
            return message.body.toLowerCase() === 'wc groups';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows the groups';
          },
          action: WorldCup.self.Groups,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc group [a-h]': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc group [a-h]$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Show a specific group';
          },
          action: WorldCup.self.Group,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc team [a-zA-Z.]{4,15}': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc team [a-zA-Z.]{4,15}$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Show information on specific country';
          },
          action: WorldCup.self.ShowTeam,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc matches': {
          test: function (message) {
            return message.body.toLowerCase() === 'wc matches';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows all matches';
          },
          action: WorldCup.self.Matches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc matches [a-h]': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc matches [a-h]$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows all group matches';
          },
          action: WorldCup.self.GroupMatches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc current': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc current$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows the current matches';
          },
          action: WorldCup.self.CurrentMatches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc today': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc today$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows todays matches';
          },
          action: WorldCup.self.MatchesToday,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc tomorrow': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc tomorrow$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows tomorrows matches';
          },
          action: WorldCup.self.MatchesTomorrow,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        },
        'wc matches [a-zA-Z.]{4,15}': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc matches [a-zA-Z.]{4,15}$/i);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Shows all team matches';
          },
          action: WorldCup.self.TeamMatches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WorldCup']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['WorldCup']['enabled'];
      }
    }
  }

  WorldCup() {
    return false;
  }

  async teamNameToShortName(team) {
    await WorldCup.self.updateTeams();
    if (Object.keys(WorldCup.self.name_mapping).indexOf(team.toLowerCase()) > -1) {
      return WorldCup.self.name_mapping[team.toLowerCase()];
    }
    return false;
  }

  async teamShortNameToName(team) {
    await WorldCup.self.Update();

    if (Object.keys(WorldCup.self.short_name_mapping).indexOf(team) > -1) {
      return WorldCup.self.short_name_mapping[team];
    }
    return false;
  }

  async updateMatches() {
    try {
      WorldCup.self.last_updated = new Date();

      if (WorldCup.self.json_matches == undefined) {
        var page = request('GET', 'https://worldcupjson.net/matches', {
          headers: {
            'Accept': 'text/plain'
          }
        });

        WorldCup.self.json_matches = JSON.parse(page.getBody());
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async updateTeams() {
    try {
      WorldCup.self.last_updated = new Date();

      if (WorldCup.self.json_teams == undefined) {
        var page = request('GET', 'https://worldcupjson.net/teams', {
          headers: {
            'Accept': 'text/plain'
          }
        });

        WorldCup.self.json_teams = JSON.parse(page.getBody())['groups'];
      }
      WorldCup.self.updateTeamGroups();
    }
    catch (err) {
      console.log(err);
    }
  }

  async updateTeamGroups() {
    try {
      if (WorldCup.self.group_mapping == undefined) {
        WorldCup.self.group_mapping = {}
      }

      if (WorldCup.self.name_mapping == undefined) {
        WorldCup.self.name_mapping = {}
      }

      if (WorldCup.self.short_name_mapping == undefined) {
        WorldCup.self.short_name_mapping = {}
      }

      for (let y = 0; y < WorldCup.self.json_teams.length; y++) {
        for (let x = 0; x < WorldCup.self.json_teams[y]['teams'].length; x++) {
          let letter = WorldCup.self.json_teams[y]['letter'];
          let team = WorldCup.self.json_teams[y]['teams'][x]['name'];
          let country_shortname = WorldCup.self.json_teams[y]['teams'][x]['country'];
          WorldCup.self.group_mapping[team] = letter;
          WorldCup.self.name_mapping[team.toLowerCase()] = country_shortname;
          WorldCup.self.short_name_mapping[country_shortname] = team;
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async ShowTeam(message) {
    try {
      let team = message.body.substring("wc team ".length);
      let short_team = await WorldCup.self.teamNameToShortName(team);
      if (short_team == false) return;

      var page = request('GET', 'https://worldcupjson.net/teams/' + short_team, {
        headers: {
          'Accept': 'text/plain'
        }
      });

      if (WorldCup.self.json_teams_stats == undefined) {
        WorldCup.self.json_teams_stats = {}
      }

      WorldCup.self.json_teams_stats[short_team] = JSON.parse(page.getBody());

      let team_header = "MP W D L GF GA Pts\n";
      let tname = team.charAt(0).toUpperCase() + team.slice(1);
      let padding = 0;
      let stats = WorldCup.self.json_teams_stats[short_team];
      let home_team = await WorldCup.self.teamShortNameToName(stats['next_match']['home_team']);
      let full_home_team = home_team;
      home_team = home_team + " (" + stats['next_match']['home_team'] + ")";
      let away_team = await WorldCup.self.teamShortNameToName(stats['next_match']['away_team']);
      let full_away_team = away_team;
      away_team = away_team + " (" + stats['next_match']['away_team'] + ")";

      let msg = "";
      padding = 3 - stats['games_played'].toString().length;
      msg += stats['games_played'] + ' '.repeat(padding);
      msg += stats['wins'] + " ";
      msg += stats['draws'] + " ";
      msg += stats['losses'] + " ";
      padding = 3 - stats['goals_for'].toString().length;
      msg += stats['goals_for'] + ' '.repeat(padding);
      padding = 3 - stats['goals_against'].toString().length;
      msg += stats['goals_against'] + ' '.repeat(padding);
      msg += stats['group_points'];
      msg += "\n\n";

      let m = new Date(stats['next_match']['datetime']);
      msg += "Next match\n\n";
      let dateString = m.getFullYear() + "-" + (m.getMonth() + 1) + "-" + String(m.getDate()).padStart(2, '0') + " " + m.getHours() + ":" + String(m.getMinutes()).padStart(2, '0');
      msg += dateString + "\n" + home_team + " " + WorldCup.flags[full_home_team] + " · " + WorldCup.flags[full_away_team] + " " + away_team + "\n";
      msg += stats['next_match']['venue'] + " in " + stats['next_match']['location'] + "\n";

      msg = "```" + tname + " (" + short_team + ") " + WorldCup.flags[tname] + "\n\n" + team_header + msg + "```";

      MessageStrategy.typing(message);
      MessageStrategy.client.sendText(message.from, msg);
    }
    catch (err) {
      console.log(err);
    }
  }

  async ShowMatches(message, letter = null, today = false, tomorrow = false, current = false) {
    try {
      console.log("Show Matches");
      await WorldCup.self.Update(message);

      let lastDate = null;
      let tempLines = [];
      let appended = 0;

      if (WorldCup.self.json_matches == undefined) {
        await WorldCup.self.updateMatches();
        await WorldCup.self.updateTeams();
        WorldCup.self.waitFor(4000);
      }

      for (let y = 0; y < WorldCup.self.json_matches.length; y++) {

        let m = new Date(WorldCup.self.json_matches[y]['datetime']);
        let d = new Date();
        let dateString = m.getFullYear() + "-" + (m.getMonth() + 1) + "-" + String(m.getDate()).padStart(2, '0');
        let timeString = m.getHours() + ":" + String(m.getMinutes()).padStart(2, '0');
        let home = WorldCup.self.json_matches[y]['home_team']['name'];
        let away = WorldCup.self.json_matches[y]['away_team']['name'];
        let home_goals = "";
        let away_goals = "";

        if (home == "To Be Determined") {
          home = WorldCup.self.json_matches[y]['home_team']['country']
        }

        if (away == "To Be Determined") {
          away = WorldCup.self.json_matches[y]['away_team']['country']
        }

        if (today) {
          console.log("Today");
          console.log(m.getFullYear() + "=" + d.getFullYear());
          console.log((m.getMonth() + 1) + "=" + d.getMonth())
          console.log(m.getDate() + "=" + d.getDate())

          if (!(m.getFullYear() == d.getFullYear() && m.getMonth() == d.getMonth() && m.getDate() == d.getDate())) {
            console.log("Skip not today");
            continue;
          } else {
            console.log("Today");
            console.log(WorldCup.self.json_matches[y]);
          }
        }

        if (tomorrow) {
          console.log("Tomorrow");
          d.setDate(d.getDate() + 1);

          if (!(m.getFullYear() == d.getFullYear() && m.getMonth() == d.getMonth() && m.getDate() == d.getDate())) {
            console.log("Skip not tomorrow");
            continue;
          } else {
            console.log("Tomorrow");
            console.log(WorldCup.self.json_matches[y]);
          }
        }

        if (current) {
          console.log("Current");
          if (!(
            m.getFullYear() == d.getFullYear() &&
            m.getMonth() == d.getMonth() &&
            m.getDate() == d.getDate() &&
            d.getHours() >= m.getHours() &&
            d.getHours() <= m.getHours() + 2)) {
            console.log("Skip not current");
            continue;
          } else {
            console.log("Current");
            console.log(WorldCup.self.json_matches[y]);
          }
        }

        if (letter != null) {
          console.log("Letter");
          if (Object.keys(WorldCup.self.group_mapping).indexOf(home) == -1) {
            continue;
          }
          if (Object.keys(WorldCup.self.group_mapping).indexOf(away) == -1) {
            continue;
          }
          if (WorldCup.self.group_mapping[home] != letter) {
            continue;
          }
        }

        if (home.length < 5 || away.length < 5) {
          continue;
        }

        if (lastDate != dateString) {
          tempLines.push(" ".repeat(14) + dateString);
          lastDate = dateString;
        }

        if (m.getFullYear() == d.getFullYear() && m.getMonth() == d.getMonth() && m.getDate() == d.getDate() && d.getHours() >= m.getHours()) {
          console.log("TodaGoals scored");
          console.log(m.getFullYear() + "=" + d.getFullYear());
          console.log(m.getMonth() + "=" + d.getMonth())
          console.log(m.getDate() + "=" + d.getDate())
          console.log(WorldCup.self.json_matches[y]['home_team']);
          if (!tomorrow) {
            home_goals = " (" + WorldCup.self.json_matches[y]['home_team']['goals'] + ")";
            away_goals = "(" + WorldCup.self.json_matches[y]['away_team']['goals'] + ") ";
          }
        }

        let left_space = 14 - (home + home_goals).length;
        left_space = left_space == 0 ? "" : " ".repeat(left_space);
        let l_flag = WorldCup.flags[home];
        let r_flag = WorldCup.flags[away];
        let theLine = left_space + home + home_goals + " " + l_flag + " · " + r_flag + " " + away_goals + away;

        tempLines.push(" ".repeat(17) + timeString);
        tempLines.push(theLine);
        appended += 1;
      }

      if (letter != null) {
        console.log("H Letter");
        tempLines.unshift("Group " + letter + " matches");
      }

      if (today) {
        console.log("H today");
        tempLines.unshift("Todays matches");
      }

      if (tomorrow) {
        console.log("H tomorrow");
        tempLines.unshift("Tomorrows matches");
      }

      if (current) {
        console.log("H Current");
        tempLines.unshift("Now playing");
      }

      if (appended == 0) {
        tempLines.unshift("0 matches");
      }

      let msg = "";
      for (let h = 0; h < tempLines.length; h++) {
        if (tempLines[h].startsWith(" ".repeat(14) + "20")) {
          if (msg.trim().length > 0) {
            MessageStrategy.typing(message);
            MessageStrategy.client.sendText(message.from, "```" + msg + "```");
            msg = "";
          }
        }

        msg += tempLines[h] + "\n";
      }

      MessageStrategy.typing(message);
      MessageStrategy.client.sendText(message.from, "```" + msg + "```");
    }
    catch (err) {
      console.log(err);
    }
  }

  async ShowGroup(message, letter) {
    try {
      await WorldCup.self.Update(message);

      if (WorldCup.self.json_matches == undefined) {
        await WorldCup.self.updateMatches();
        await WorldCup.self.updateTeams();
        WorldCup.self.waitFor(4000);
      }

      let group_header = "Group " + letter + "\n";
      let group_teams_header = "                PL W D L GF GA Pts\n";
      let group_teams = "";

      for (let y = 0; y < WorldCup.self.json_teams.length; y++) {
        if (WorldCup.self.json_teams[y]['letter'] == letter) {
          for (let x = 0; x < WorldCup.self.json_teams[y]['teams'].length; x++) {
            let name = WorldCup.self.json_teams[y]['teams'][x]['name'];
            let name_len = name.length;
            let padding = 15 - name_len;

            group_teams += WorldCup.self.json_teams[y]['teams'][x]['name'] + " " + ' '.repeat(padding);
            padding = 3 - WorldCup.self.json_teams[y]['teams'][x]['games_played'].toString().length;
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['games_played'] + ' '.repeat(padding);
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['wins'] + " ";
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['draws'] + " ";
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['losses'] + "  ";
            padding = 3 - WorldCup.self.json_teams[y]['teams'][x]['goals_for'].toString().length;
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['goals_for'] + ' '.repeat(padding);
            padding = 3 - WorldCup.self.json_teams[y]['teams'][x]['goals_for'].toString().length;
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['goals_for'] + ' '.repeat(padding);
            group_teams += WorldCup.self.json_teams[y]['teams'][x]['group_points'] + ' '.repeat(padding);
            group_teams += WorldCup.flags[WorldCup.self.json_teams[y]['teams'][x]['name']] + "\n";
          }
        }
      }

      let msg = "```" + group_header + group_teams_header + group_teams + "```";
      MessageStrategy.typing(message);
      MessageStrategy.client.sendText(message.from, msg);
    }
    catch (err) {
      console.log(err);
    }
  }

  async Group(message) {
    try {
      let groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      let requested_letter = message.body.substring("wc group ".length).toUpperCase();
      if (groups.indexOf(requested_letter) > -1) {
        WorldCup.self.ShowGroup(message, requested_letter)
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async Groups(message) {
    try {
      let groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      groups.forEach(function (item, index, arr) {
        WorldCup.self.ShowGroup(message, arr[index]);
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  async GroupMatches(message) {
    try {
      WorldCup.self.ShowMatches(message, message.body.substring("wc matches ".length).toUpperCase());
    }
    catch (err) {
      console.log(err);
    }
  }

  async TeamMatches(message) {
    try {
      WorldCup.self.ShowMatches(message, message.body.substring("wc matches ".length).toUpperCase());
    }
    catch (err) {
      console.log(err);
    }
  }

  async Matches(message) {
    try {
      WorldCup.self.ShowMatches(message, null);
    }
    catch (err) {
      console.log(err);
    }
  }

  async CurrentMatches(message) {
    try {
      WorldCup.self.ShowMatches(message, null, false, false, true);
    }
    catch (err) {

    }
  }

  async MatchesToday(message) {
    try {
      WorldCup.self.ShowMatches(message, null, true, false, false);
    }
    catch (err) {

    }
  }

  async MatchesTomorrow(message) {
    try {
      WorldCup.self.ShowMatches(message, null, false, true, false);
    }
    catch (err) {

    }
  }

  async Update(message) {
    try {
      if (WorldCup.self.last_updated == undefined) {
        WorldCup.self.last_updated = new Date();
      }

      let current = new Date();
      if (WorldCup.self.last_updated.getTime() + 60 > current.getTime()) {
        return;
      }

      console.log("wc updating...");

      await WorldCup.self.updateMatches();
      await WorldCup.self.updateTeams();
    }
    catch (err) {

    }
  }
}


module.exports = {
  MessageStrategy: WorldCup
}
