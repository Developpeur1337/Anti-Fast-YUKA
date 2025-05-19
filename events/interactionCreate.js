module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.guild) return;

        if (interaction.isCommand()) {
            const commande = client.commands.get(interaction.commandName);
            if (!commande) return;

            if (commande.permissions) {
                if (commande.botOwnerOnly) {
                    if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                };

                if (commande.guildOwnerOnly) {
                    if (interaction.member.guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                };

                if (commande.botOwner){
                    if (!client.config.owners.includes(interaction.user.id) && !client.perms.owners.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                }

                if (commande.wlOnly){
                    if (!client.config.owners.includes(interaction.user.id) && !client.perms.owners.includes(interaction.user.id) && !client.perms.wl.includes(interaction.user.id)) return interaction.reply({
                        content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                        ephemeral: true
                    });
                }
                
                const authorPerms = interaction.channel.permissionsFor(interaction.user) || interaction.member.permissions;
                if (!authorPerms.has(commande.permissions) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                    content: `\`❌\` 〃 Vous n'avez pas les permissions d'utiliser cette commande`,
                    ephemeral: true
                });
            };

            commande.executeSlash(client, interaction);
            console.log("[CMD-S]".brightBlue, `${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.tag} | ${commande.name}`);
        };
    }
}