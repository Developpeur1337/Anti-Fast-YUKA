const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const chemin = path.join(__dirname, '../events');
    const chargé = [];

    const load = (dir) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                load(filePath);
            } else if (file.endsWith('.js')) {
                const event = require(filePath);
                if (event && event.name) {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(client, ...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(client, ...args));
                    }
                    chargé.push(filePath.replace(`${chemin}\\`, '')); 
                }
            }
        }
    };

    load(chemin);
    console.log(`[EVENT] Tous les événements ont été chargés !`.green);
};
