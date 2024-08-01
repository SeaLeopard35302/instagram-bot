const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const puppeteer = require('puppeteer');

const username = process.env.USER;
const password = process.env.PASSWORD;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const commands = require("./src/commands/cmdHandler.js")
let browser;
let page;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const CLIENT_ID = client.user.id;
  const GUILD_ID = process.env.GUILD_ID;
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands.map(command => command.data.toJSON()) });

      console.log(`Successfully reloaded ${commands.length} application (/) commands.`);

      console.log("Lauching a new instance of instagram");

      browser = await puppeteer.launch({ headless: true });
      page = await browser.newPage();
      // Navigate to Instagram login page
      await page.goto('https://www.instagram.com/accounts/login/');
      await page.waitForSelector('input[name="username"]');
      // Enter username and password
      await page.type('input[name="username"]', username, { delay: 100 });
      await page.type('input[name="password"]', password, { delay: 100 });
      // Click login button
      await page.click('button[type="submit"]');
      await page.waitForNavigation();
      //handle not now 
      await page.locator('div ::-p-text(Not now)').click();
      await page.locator('button ::-p-text(Not Now)').click();

      console.log("New Instagram instance launched");

    } catch (error) {
      console.error(error);
    }
  })();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  commands.map(async (command) => {
    if (interaction.commandName === command.data.name) {
      if (command.execute.length === 2)
        await command.execute(interaction, page);
      else
        await command.execute(interaction);
    }
  })

  const { commandName, options } = interaction;

  if (commandName === 'send_message') {

  }
});

client.login(process.env.TOKEN);
