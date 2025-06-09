const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "settings",
    description: "Affiche les paramètres de l'antiraid.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: true,
    botOwner: false,
    wlOnly: false,
    async executeSlash(client, interaction) {
        const configPath = path.join(__dirname, "../config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        const jours = config.antiDcc;
        const status = config.status ? "`✅` Activé" : "`❌` Désactivé";

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Paramètres du serveur")
            .addFields(
                { name: "Anti-Double Compte", value: `Nombre de jours minimum : \`${jours} jours\`\n*__Statut :__* ${status}` }
            );

        return interaction.reply({ embeds: [embed], ephemeral: true });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    }
};
