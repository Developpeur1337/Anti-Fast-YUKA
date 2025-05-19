const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "antidc",
    description: "Kick automatiquement les nouveaux comptes.",
    botOwnerOnly: true,
    async executeSlash(client, interaction) {
        const configPath = path.join(__dirname, "../config.json");
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        const jours = interaction.options.getInteger("jours");
        const status = interaction.options.getString("status"); 

        let embed;

        if (status) {
            if (status === "activer") {
                config.status = true;
                embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setDescription("<:990yyes:1371830093252399196>・L'anti-double compte est maintenant **activé**.");
            } else if (status === "désactiver") {
                config.status = false;
                embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription("<:990not:1371830095391756379>・L'anti-double compte est maintenant **désactivé**.");
            }
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!config.status) {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription("<:990yyes:1371830093252399196>・L'anti-double compte est désactivé.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (jours) {
            config.antiDcc = jours;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`<:990yyes:1371830093252399196>・Le temps pour l'anti dc a été mis à jour à **${jours}** jours.`);
        } else {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setDescription(`\`⌛\`〃Le temps pour l'anti dc est actuellement de **${config.antiDcc}** jours.`);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addIntegerOption(option =>
                option.setName("jours")
                    .setDescription("Nombre de jours minimum que le compte doit avoir pour éviter le kick.")
            )
            .addStringOption(option =>
                option.setName("status")
                    .setDescription("Activer ou désactiver l'anti-double compte.")
                    .addChoices(
                        { name: "Activer", value: "activer" },
                        { name: "Désactiver", value: "désactiver" }
                    )
            );
    }
};
