const { Client, Intents } = require("discord.js");
const client = new Discord.Client({ Intents: [Intents.FLAGS.GUILDS]});

// create a config.js with a token
const config = require("./config");
client.login(config.token);

client.on("ready", async () => {
    console.log(`Client connected! [${client.user.tag}]`);

    if (!client.application?.owner) await client.application?.fetch();

    client.commands = new Map();
    fs.readdir("./commands/", async (err, files) => {
        if (err) return console.error(err);
        let count = 0;
        let commands = [];
        for (let file of files) {   
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            count += 1;
        }
        await client.guilds.cache.get("GUILD ID HERE")?.commands.set(commands);
        //await client.application?.commands.set(commands);
        console.log(`Registered ${count} commands!`);
    });
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});