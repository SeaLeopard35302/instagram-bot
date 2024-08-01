const { SlashCommandBuilder } = require("discord.js")

const say_hi = {
  data: new SlashCommandBuilder()
    .setName('say-hi')
    .setDescription('Send an Instagram message'),
  async execute(interaction) {
    try {
      return interaction.reply({ content: `Hi`, ephemeral: false });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Failed to send the message', ephemeral: true });
    }
  }
}


module.exports = say_hi