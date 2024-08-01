const { SlashCommandBuilder } = require("discord.js")

const send_message = {
  data: new SlashCommandBuilder()
    .setName('send_message')
    .setDescription('Send an Instagram message')
    .addStringOption((option) =>
      option.setName('user').setDescription('Instagram username of the person to send the message').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('message').setDescription('The message to send').setRequired(true)
    ),
  async execute(interaction, page) {
    const user = interaction.options.getString('user');
    const message = interaction.options.getString('message');

    try {
      interaction.deferReply()
      await page.goto(`https://www.instagram.com/${user}/`);
      // Click on message button
      await page.waitForSelector('div[role="button"]');
      const buttons = await page.$$('div[role="button"]');
      for (let button of buttons) {
        const text = await button.evaluate(el => el.textContent.trim());
        if (text === 'Message') {
          await button.click();
          break;
        }
      }

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      // Type in the text box
      await page.keyboard.type(message);
      await page.keyboard.press('Enter');
      console.log(`Message sent to ${user}: ${message}`);
      return await interaction.editReply({ content: `Message sent to ${user}`, ephemeral: false });
    } catch (error) {
      console.error(error);
      return await interaction.reply({ content: 'Failed to send the message', ephemeral: false });
    }
  }
}


module.exports = send_message