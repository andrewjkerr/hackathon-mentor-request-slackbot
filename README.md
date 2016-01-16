# PINGBOT for Slack

![PINGBOT](https://i.imgur.com/sc8XvQu.png)

## Installation

### Bot API Key

You need an API key for your bot.

Go to your Slack instance, go to Integrations, then Bot integrations, and make a new one.

Grab that API key. Save it for the config file in a second.

### Manually...

Clone this repo, make sure you have `node` and `npm` installed!

Edit the `package.json` with your name.

Run `npm install` to install dependencies.

Rename `config.sample.js` to `config.js` and edit it with your own config.

Run `node /path/to/bot.js /path/to/config.js` to get it running.

Invite pingbot to your channel!

### ... or with Docker

You can also use this with Docker! Update the `Dockerfile` with your email address.

    docker build -t your-name/pingbot .
    docker run -d your-name/pingbot

Nice.

## Usage

Update the `config.js` file with your teams and then use `.ping team` to ping all of the members on that team!
