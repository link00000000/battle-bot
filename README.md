<p align="center">
  <img src="http://i.imgur.com/ts9J5XU.png">
</p>

#### Battlefield 4 Battlelog Discord Bot

Logs saved to /logs by date.

Anything saved to the logs will be shown in the console also.

## Installation

#### Using a username and password

1. Download and extract the .zip file.
2. Make a new discord account.
3. Log into the discord account on either the discord web application or the downloaded application.
4. Connect to all servers that you would like the bot to be accessed on.
5. Log out of the bot account.
6. Edit "auth.json" to include the email and password to the discord account and save the file. Leave the token blank.
7. Run "Battle Bot.exe". - Alternatively, "start.bat" can be run instead.

Example
```json
{
  "token": "",
  "email": "DISCORD_BOT_EMAIL",
  "password": "DISCORD_BOT_PASSWORD"
}
```

#### Using a discord bot token

1. Download and extract the .zip file.
2. Go to https://discordapp.com/developers/applications/me and make a new application (You may have to login/create a discord account). Give the bot an 'app name' and click 'Create Application'.
3. Click on 'Create a Bot User' and accept.
4. Reveal the token for the app bot user.
5. Edit "auth.json" to include the token and save the file. Leave the email and password blank.
6. Run "Battle Bot.exe". - Alternatively, "start.bat" can be run instead.

Example
```json
{
  "token": "DISCORD_BOT_TOKEN",
  "email": "",
  "password": ""
}
```

### Troubleshooting

If the program closes immediately after launch, make sure that the username and password in "auth.json" are correct.

## Commands List
  • !bf4 <server name> | Gets server information.

  • !bf4list | Lists the servers currently in the database.

  • !bf4add <server name> <server url> | Adds a server to the database.

  • !bf4remove <server name> | Removes a server from the database.

  • !bf4delete <server name> | Removes a server from the database.

  • !bf4rename <server name> <new name> | Renames a server in the database.

  • !bf4rename <server name> <new name> | Renames a server in the database.

  • !bf4help | Shows this list.

  • !bf4git | Links to the github repository.

  • !bf4github | Links to the github repository.

## Credits
link00000000

## License
MIT License

Copyright (c) 2016 link00000000

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
