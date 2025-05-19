const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.commands = new Map();

    const chemin = path.join(__dirname, '../commandes');
    const fichiers = fs.readdirSync(chemin);

    fichiers.forEach(file => {
        const filePath = path.join(chemin, file);
        if (fs.statSync(filePath).isDirectory()) {
            fs.readdirSync(filePath).filter(f => f.endsWith('.js')).forEach(subFile => {
                const command = require(path.join(filePath, subFile));
                if (command && command.name) {
                    client.commands.set(command.name, command);
                }
            });
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if (command && command.name) {
                client.commands.set(command.name, command);
            }
        }
    });

    console.log('[CMD] Toutes les commandes ont été chargées !'.green);
};
