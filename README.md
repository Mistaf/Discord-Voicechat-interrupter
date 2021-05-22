# Vc Interrupter

A discord to interrupt people when they are talking.

## Available commands

<sup><sub>The commands can only be used by "masters"</sup></sub>

- `/join <id/me>`
    - Joins channel to interrupt the people
    - The id has to be the channel id of what channel you want the bot to join
    You can also type `me` instead of a id for the bot to join your current channel (if you are in any)
- `/leave <id/me>`
    - Leaves the channel because it isn't funny anymore.
    - The id once again has to be the channel id or `me` for your channel
- `/ignore <user>`
    - Stops to interrupt people who are ignored
    - `<user>` can either be the users nickname, username, mention, user id
- `/unignore <user>`
    - Starts to interrupt the ignored person again
    - `<user>` can either be the users nickname, username, mention, user id

## Inviting the bot

First you have to create a new application [here](https://discord.com/developers/applications).
When you created the application first of all save the application id for later since you need that to invite the bot and then you have to make it a bot by going to the bot tab in the navigation at the left side and press the "Add Bot" button.

Now you have a bot you need to get the token, click on "Click to Reveal Token" and copy that token for later (make sure never to share it with anyone because that token gives full control over the bot)

Now to actually invite the bot go to [this](https://discordapi.com/permissions.html) site and select what permissions you want to give the bot. Its advised to give the bot permissions to atleast `Connect` and `Mute Members` to unmute itself when server muted.
You could also just give it Administrator so it has permissions to join every channel

## Setting up the bot


Make sure you got [Node.js](https://nodejs.org/) version 12.0.0 or higher installed and type in a console (while being in the same directory as the bot): `npm install`, that will install all the required packages.

To start the bot use `node ./index.js`.
The first time you start up the bot it will create a `config.json` and a `ignorelist.json`.
In the `config.json` you have to enter your discord bot's token that you got when you created the bot and also add your discord user id to the array called `masters`.
To close to the bot press ctrl + c


## Built With

* [Discord.js](https://discord.js.org/) - Powerful node.js module that allows you to interact with [Discord API](https://discordapp.com/developers/docs/intro)
* [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on [Chrome's V8 JavaScript engine](https://v8.dev/).


## Author

* [**Mistaf**](https://github.com/Mistaf)
