const { SlashCommandBuilder } = require("discord.js")
const sleep = require("../../handlers/sleep.js")
const fs = require('fs');

const screenshot = {
  data: new SlashCommandBuilder()
    .setName("screenshot")
    .setDescription("screenshots and instagram webpage of a user")
    .addStringOption((option) =>
      option.setName('user').setDescription('Instagram username of the person to screenshot profile of').setRequired(true)
    ),

  async execute(interaction, page) {
    const user = interaction.options.getString('user');
    try {
      interaction.deferReply()
      await page.goto(`https://www.instagram.com/${user}/`);
      sleep(5000)
      await page.screenshot({ path: 'ss.png' })

      await interaction.channel.send({
        files: [{
          attachment: 'ss.png',
          name: `${user}.png`
        }]
      })

      fs.unlinkSync("F:/CODES/JavaScripts/instagram bot/ss.png")
      return await interaction.editReply({ content: 'Screenshot of profile has been posted' })
    } catch (error) {
      console.log(error);
      return await interaction.reply({ content: 'Failed to take a screenshot, check logs for error' })
    }
  }
}

module.exports = screenshot