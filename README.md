# Mentor Request for Slack

![swamphacks_logo](https://i.imgur.com/ERqvgGI.png)

A slackbot to help hackathons manage mentorship requests during their hackathon. Written during KnightHacks from Jan 15, 2016 - Jan 16, 2016.

## Usage

There are three kinds of users: attendees, mentors, and admins.

### Attendees

Want help with something? Use this Slack bot to help! There are a few commands that you should be aware of:

#### `.mentor`

The base command that the bot looks for. It also brings up the help menu :smile:

#### `.mentor keywords`

These are keywords that mentors have signed up to have a high knowledge level in. Using one of these keywords in your request can help your issue get to the right person to help you out!

If your issue does not fit into any of the available keywords, use `ALL` as your keyword.

#### `.mentor available`

This command just lists the mentors that are available.

#### `.mentor {keyword} {issue}`

This command will dispatch the bot to select a mentor, set up a private group chat, and set the topic of that group as your issue. Having a clear issue will help the mentor guide you!

Examples of this command can be:

1. `.mentor javascript How exactly does this callback work?`
2. `.mentor rails Is there a gem that can automagically generate an admin dashboard?`
3. `.mentor ALL What do you think of this design?`

### Mentors

#### `.mentor done`

Once you are available again (either by resolving an issue OR passing off the issue), put yourself back in the queue with this command.

#### `.mentor away`

Need to take a break? Use `.mentor away` to remove yourself from the available mentor list.

### Admins

#### `.mentor add {keyword} {username}`

Need to add a mentor or keyword? Use this!

#### `.mentor delete {keyword} {username}`

Need to delete a mentor? Use this! (NOTE: use `ALL` as the keyword in order to delete the mentor from all keywords.)

## Installation

### Bot API Key

You need an API key for your bot. In order for the groups to work, you _must_ not have a bot API key.

Grab that API key. Save it for the config file in a second.

### Manually...

Clone this repo, make sure you have `node` and `npm` installed!

Edit the `package.json` with your name.

Run `npm install` to install dependencies.

Rename `config.sample.js` to `config.js` and edit it with your own config.

Run `node /path/to/bot.js /path/to/config.js` to get it running.

Invite your `mentor_request` user to your channel!

### ... or with Docker

You can also use this with Docker! Update the `Dockerfile` with your email address.

    docker build -t your-name/mentor-request-bot .
    docker run -d your-name/mentor-request-bot

Nice.
