var fs = require('fs');

var request = require('request');

var JsonDB = require('node-json-db');
var db = new JsonDB('servers', true, true);

var Discord = require('discord.js');
var bot = new Discord.Client();

var auth = require('./auth.json');

var GIT_REPO = 'https://github.com/link00000000/battle-bot';

bot.on('message', function(msg) {
  if(msg.content.substring(0, 4) === '!bf4') {

      // Get Server
    if(msg.content.length === 4) {
      bot.reply(msg, '\nERROR: Unable to parse parameters.\nType !bf4help of a list of commands.');
      log(msg, 'Unable to parse parameters in command ' + msg.content);

    } else if(msg.content.charAt(4) === ' ') {
      var serverName = msg.content.substr(5, msg.content.length);
      try {
        var jsonUrl = db.getData('/' + serverName + '/json');

          // Fetches the JSON from battlelog and parses
          request(jsonUrl, function(err, res, body) {
            body = JSON.parse(body);
            var type = body.type;

            if(type == 'success') {
              // Executes if data is retreived successfully
              var data = '\n__**' + body.message.SERVER_INFO.name + '**__\n' +
                                '**Players:** ' + body.message.SERVER_INFO.slots['2'].current + '/' + body.message.SERVER_INFO.slots['2'].max + '\n' +
                                '**Map:** ' + mapName(body.message.SERVER_INFO.map) + '\n' +
                                '**Gamemode:** ' + gamemodeName(body.message.SERVER_INFO.mapMode) + '\n\n' +
                                db.getData('/' + serverName + '/url');
              bot.reply(msg, data);
              log(msg, 'Server data requested. ' + serverName);

            } else if (type == 'error') {
              log(msg, 'Error adding server ' + body.message + '.');
              bot.reply(msg, '\nERROR: ' + body.message + '.');
            }

          });
      } catch (err) {
        bot.reply(msg, '\n\nERROR: Unable to find server\nType !bf4list for a list of servers stored in the database.');
        log(msg, 'Unable to find server ' + serverName + '.');
      }


      // Add Server
    } else if(msg.content.substring(0, 7) === '!bf4add') {

      if(msg.content.charAt(7) === ' ') {
        var params = msg.content.substr(8, msg.content.length);
        var url, name;
        try {
          if(params.replace(/[^ ]/g, "").length > 1) {
            bot.reply(msg, '\nThere cannot be spaces in the server name.');
            log(msg, 'Tried to add server with a name with spaces.');
          } else {
            name = params.substring(0, params.indexOf(' '));
            url = params.substring(params.indexOf(' ') + 1, params.length);
          }
        } catch (err) {
          log(msg, err);
          bot.reply(msg, err);
        }
        if(name && url) {
          request(url + '?json=1', function (err, res, body) {
            body = JSON.parse(body);
            var type = body.type;

            if(type == 'success') {
              try {
                var data = db.getData('/' + name);
                bot.reply(msg, '\n' + name + ' is already in the database. Type !bf4list for a list of servers currently in the database.');
                log(msg, 'Tried to add server that was already in the database. ' + name);
              } catch (err) {
                db.push('/' + name, {"json": url + '?json=1', "url": url});
                bot.reply(msg, '\n' + name + ' added to database successfully.');
                log(msg, name + ' added to database successfully.');
              }
            } else {
              bot.reply(msg, '\nERROR: Unable to find server on battlelog.');
              log(msg, name + ' failed to add to database. Unable to find server on battlelog.')
            }
          });
        }


      } else {
        bot.reply(msg, '\nERROR: Unable to parse parameters.\nType !bf4help of a list of commands.');
        log(msg, 'Unable to parse parameters in command ' + msg.content);
      }


      // List Servers
    } else if(msg.content.substring(0, 8) === '!bf4list') {

      var serverList = '\n**BF4 Servers in database**\n';
      var data = db.getData('/');
      var arr = Object.keys(data);

      for(i in arr) {
        serverList+= '  • ' + arr[i] + '\n';
      }

      bot.reply(msg, serverList);
      log(msg, 'Server list requested.');

      // Remove Server
    } else if(msg.content.substring(0, 10) === '!bf4remove' || msg.content.substring(0, 10) === '!bf4delete') {

      if(msg.content.charAt(10) === ' ') {
        var serverName = msg.content.substr(11, msg.content.length);

        try {
          var data = db.getData('/' + serverName);
          try {
            db.delete('/' + serverName);
            bot.reply(msg, '\n' + serverName + ' successfully removed from the database.');
            log(msg, serverName + ' successfully removed from the database.');
          } catch (err) {
            log(msg, 'There was an error removing ' + serverName + ' from the database.');
            bot.reply(msg, '\nThere was an error removing the server from the database.');
          }
        } catch (err) {
          bot.reply(msg, '\nERROR: Server not in database.\nType !bf4list to view a list of servers in the database.');
          log(msg, 'Tried to remove a server that was not in the database. ' + serverName);
        }

      } else {
        bot.reply(msg, '\nERROR: Unable to parse parameters.\nType !bf4help of a list of commands.');
        log(msg, 'Unable to parse parameters in command ' + msg.content);
      }

      // Rename Server
    } else if(msg.content.substring(0, 10) === '!bf4rename') {
      if(msg.content.charAt(10) === ' ') {
        var params = msg.content.substring(11, msg.content.length);
        var origName = params.substr(0, params.indexOf(' '));
        var newName = params.substr(params.indexOf(' ') + 1, params.length);
        try {
          var data = db.getData('/' + origName);

          try {
            db.getData('/' + newName);
            bot.reply(msg, '\n' + newName + ' is already in the database.\nPlease delete this server from the database or choose a new name.');
            log(msg, 'Tried to rename server to one already in the database. ' + newName);
          } catch (err) {

            db.delete('/' + origName);
            db.push('/' + newName, data);
            bot.reply(msg, '\n' + origName + ' successfully renamed to ' + newName + '.');
            log(msg, origName + ' successfully renamed to ' + newName + '.');

          }

        } catch (err) {
          bot.reply(msg, '\n' + origName + ' is not currently in the database.\nType !bf4list for a list of server currently in the database.');
          log(msg, 'Tried to rename a server that was not in the database. ' + origName);
        }

      } else {
        bot.reply(msg, '\nERROR: Unable to parse parameters.\nType !bf4help of a list of commands.');
        log(msg, 'Unable to parse parameters in command ' + msg.content);
      }

      // List commands
    } else if(msg.content.substring(0, 8) === '!bf4help') {
        var commands =  '\n**Commands List**\n' +
                        '  • !bf4 <server name> | Gets server information.\n' +
                        '  • !bf4list | Lists the servers currently in the database.\n' +
                        '  • !bf4add <server name> <server url> | Adds a server to the database.\n' +
                        '  • !bf4remove <server name> | Removes a server from the database.\n' +
                        '  • !bf4delete <server name> | Removes a server from the database.\n' +
                        '  • !bf4rename <server name> <new name> | Renames a server in the database.\n' +
                        '  • !bf4help | Shows this list.\n' +
                        '  • !bf4git | Links to the github repository.' +
                        '  • !bf4github | Links to the github repository.';
        bot.reply(msg, commands);
        log(msg, 'Commands List was requested');


        // Github Repo
    } else if(msg.content.substring(0, 10) === '!bf4github' || msg.content.substring(0, 7) === '!bf4git') {
        bot.reply(msg, '\nGithub: ' + GIT_REPO);
        log(msg, 'Requested link to github repo.');

      // Default unknown
    } else {
      bot.reply(msg, '\nCommand Unknown\nType !bf4help for a list of commands.');
      log(msg, 'Unknown Command. ' + msg.content);
    }

  }
});

if(auth.token) {
  bot.loginWithToken(auth.token);
} else {
  bot.login(auth.email, auth.password);
}

process.on('exit', function() {
  bot.logout();
});

function mapName(orig) {
  switch (orig.toLowerCase()) {
    case "mp_tremors":
      return "Dawnbreaker";
      break;
    case "mp_flooded":
      return "Flood Zone";
      break;
    case "mp_journey":
      return "Golmud Railway";
      break;
    case "mp_resort":
      return "Hainan Resort";
      break;
    case "mp_damage":
      return "Lancang Dam";
      break;
    case "mp_prison":
      return "Operation Locker";
      break;
    case "mp_naval":
      return "Paracel Storm";
      break;
    case "mp_thedish":
      return "Rouge Transmisson";
      break;
    case "mp_siege":
      return "Siege of Shanghai";
      break;
    case "mp_abandoned":
      return "Zavod 311";
      break;
    case "xp1_001":
      return "Silk Road";
      break;
    case "xp1_002":
      return "Altai Range";
      break;
    case "xp1_003":
      return "Guilin Peaks";
      break;
    case "xp1_004":
      return "Dragon Pass";
      break;
    case "xp0_caspian":
      return "Caspain Border";
      break;
    case "xp0_oman":
      return "Gulf of Oman";
      break;
    case "xp0_firestorm":
      return "Operation Firestorm";
      break;
    case "xp0_metro":
      return "Operation Metro";
      break;
    case "xp2_001":
      return "Lost Islands";
      break;
    case "xp2_002":
      return "Nansha Strike";
      break;
    case "xp2_003":
      return "Wave Breaker";
      break;
    case "xp2_004":
      return "Operation Mortar";
      break;
    case "xp3_urbangdn":
      return "Lumphini Garden";
      break;
    case "xp3_marketpl":
      return "Pearl Market";
      break;
    case "xp3_prpganda":
      return "Propaganda";
      break;
    case "xp3_wtrfront":
      return "Sunken Dragon";
      break;
    case "xp4_wlkrftry":
      return "Giants of Karelia";
      break;
    case "xp4_subbase":
      return "Hammerhead";
      break;
    case "xp4_titan":
      return "Hangar 21";
      break;
    case "xp4_arctic":
      return "Operation Whiteout";
      break;
    case "xp5_night_01":
      return "Zavod: Graveyard Shift";
      break;
    case "xp6_cmp":
      return "Operation Outbreak";
      break;
    case "xp7_valley":
      return "Dragon Valley 2015"
      break;
    default:
      return "Error retreiving map name";
  }
};

function gamemodeName(orig) {
  switch (orig.toLowerCase()) {
    case "8388608":
      return "Air Superiority";
      break;
    case "524288":
      return "Capture the Flag";
      break;
    case "134217728":
      return "Carrier Assault";
      break;
    case "67108864":
      return "Carrier Assault Large";
      break;
    case "34359738368":
      return "Chain Link";
      break;
    case "1":
      return "Conquest";
      break;
    case "64":
      return "Conquest Large";
      break;
    case "16777216":
      return "Defuse";
      break;
    case "1024":
      return "Domination";
      break;
    case "512":
      return "Gun Master";
      break;
    case "2097152":
      return "Obliteration";
      break;
    case "2":
      return "Rush";
      break;
    case "8":
      return "Squad Deathmatch";
      break;
    case "137438953472":
      return "Squad Obliteration";
      break;
    case "32":
      return "Team Deathmatch";
      break;
    case "33554432":
      return "Carrier Assault";
      break;
    case "68719476736" :
      return "Conquest";
      break;
    case "2097152":
      return "Obliteration";
      break;
    case "524288":
      return "Capture the Flag";
      break;
    case "2048":
      return "Commander";
      break;
    default:
      return "Error retreiving gamemode name";
  }
}

function log(msg, text) {

  var date = new Date();
  var timestamp;
    var hrs, mins, secs;
    if(date.getHours() < 10) {
      hrs = "0".toString() + date.getHours().toString();
    } else { hrs = date.getHours(); }
    if(date.getMinutes() < 10) {
      mins = "0".toString() + date.getMinutes().toString();
    } else { mins = date.getMinutes(); }
    if(date.getSeconds() < 10) {
      secs = "0".toString() + date.getSeconds().toString();
    } else { secs = date.getSeconds(); }
  timestamp = '[' + hrs +':' + mins + ':' + secs + ']';
  var author = '[' + msg.author.username + ']';
  var data = timestamp + ' ' + author + ' ' + text;

  var fileName = './logs/' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() + '.log';

  console.log(data);

  try {
    fs.accessSync(fileName, fs.F_OK);
    fs.appendFile(fileName, data + '\r');
  } catch (err) {
    fs.writeFile(fileName, data);
  }

}
