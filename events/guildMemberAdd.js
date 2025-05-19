const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8"));
        await member.fetch();

        if (!config.status) return;

        const age = Date.now() - member.user.createdAt;

        if (age < config.antiDcc * 24 * 60 * 60 * 1000) {
            let lien = "indisponible";
            try {
                const invites = await member.guild.invites.fetch();
                const usable = invites.find(i => !i.maxAge && !i.maxUses);
                if (usable) lien = `https://discord.gg/${usable.code}`;
                else {
                    const invite = await member.guild.invites.create(member.guild.systemChannel || member.guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(client.user).has("CreateInstantInvite")), {
                        maxAge: 0,
                        maxUses: 0,
                        reason: "Invite pour message d'expulsion automatique",
                    });
                    lien = `https://discord.gg/${invite.code}`;
                }
            } catch (e) {
                console.error("Impossible de générer une invitation :", e);
            }

            const dmEmbed = new EmbedBuilder()
                .setDescription(`<:990not:1370637827834122300> __Vous avez été expulsé de__ [\`${member.guild.name}\`](${lien})\n\n<:fleche:1370644539538276405> Votre compte a été créé trop récemment (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)\n\n*Veuillez réessayer plus tard*.`)
                .setColor(0x2B2D31);

            try {
                await member.send({ embeds: [dmEmbed] });
            } catch (err) {
                console.warn(`Impossible d’envoyer un DM à ${member.user.tag}`);
            }

            await member.kick("Compte trop récent");
        }
    }
};
