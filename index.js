// import the discord.js library for use in your code
// the {} here destructure the import, and import specifically the Client and Intents classes from the library
const { Client, Intents } = require("discord.js");
// create a new instance of the Client class and pass it the partials and intents it needs to function
const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"], intents: Object.keys(Intents.FLAGS) });

// import your config file and attach it to the client object
client.config = require("./config");
// log your client into Discord using the token in your config file
client.login(config.token);

// create an event listener on the ready event, emitted when the bot is ready (connected to Discord)
client.on("ready", async () => {
    console.log(`Client connected! [${client.user.tag}]`);

    // import some libaries that we need to create application commands
    const { REST } = require('@discordjs/rest'); // MUST BE INSTALLED (npm install @discordjs/rest)
    const { Routes } = require('discord-api-types/v9'); // MUST BE INSTALLED (npm install discord-api-types/v9)
    const fs = require('fs'); // comes packaged with Node and does not need to be installed

    // create an empty list and a new map to store our application commands
    const commands = [];
    client.commands = new Map();
    // loop through all our command files found in the commands directory
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        // import the command code
        const command = require(`./commands/${file}`);
        // create a json version of the command data and add it to our commands list
        commands.push(command.data.toJSON());
        // add the command to our map so it can be fetched later
        client.commands.set(command.data.name, command);
    }
    
    // create a new rest client
    const rest = new REST({ version: '9' }).setToken(token);
    // create an async wrapper to make the bot wait until this has finished before continuing
    (async () => {
        // attempt to register application commands
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            console.log('Successfully reloaded application (/) commands.');
        // if error, catch and log the error to the terminal
        } catch (error) {
            console.error(error);
        }
    })();
});

// create an event listenter on the interactionCreate event, emitted when a new interaction is created (slash command used, button clicked)
client.on("interactionCreate", async interaction => {
    // if the interaction isn't a slash command, do nothing
    if (!interaction.isCommand()) return;
    // fetch the command using its name
	const command = client.commands.get(interaction.commandName);
    // if no command with that name exists, do nothing
	if (!command) return;

    // attempt to execute the command
	try {
        // call the execute method on our command, passing it the client and interaction objects
		await command.execute(client, interaction);
    // if error, catch and log the error and reply to the user
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
