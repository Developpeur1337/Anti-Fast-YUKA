const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config.json");
require("node:fs");
require("colors");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
    ],
    presence: {
        activities: [{
            name: `🚧`,
            type: 0,
            url: "https://www.twitch.tv/developpeur1337"
        }],
        status: "online"
    },
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    }
});

client.config = config;
client.commands = new Map();  

require("./handlers/commandes.js")(client);
require("./handlers/events")(client);

client.login(client.config.token);

async function errorHandler(error) {
    if (error.code == 10003) return; // Unknown channel
    if (error.code == 10062) return; // Unknown interaction
    if (error.code == 50013) return; // Missing Permissions
    if (error.code == 40060) return; // Interaction has already been acknowledged
    console.log(`[ERROR] ${error}`.red);
};

process.on("unhandledRejection", errorHandler);
process.on("uncaughtException", errorHandler);
