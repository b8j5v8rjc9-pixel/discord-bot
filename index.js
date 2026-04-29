const fetch = require("node-fetch");

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "image") {
    const prompt = interaction.options.getString("prompt");

    await interaction.reply("🔄 Génération en cours...");

    try {
      const res = await fetch("https://api.seaart.ai/v2/api/img/generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SEAART}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "seaart-official:sdxl-lightning-4steps",
          mode: "txt2img",
          params: {
            prompt: prompt + " ultra realistic",
            negative_prompt: "blurry ugly",
            width: 512,
            height: 512,
            steps: 25,
            cfg_scale: 7.5
          }
        })
      });

      const data = await res.json();

      const img = data?.data?.[0]?.image;

      if (!img) {
        return interaction.editReply("❌ erreur génération");
      }

      await interaction.editReply({
        content: "✅ Voilà ton image :",
        files: [img]
      });

    } catch (e) {
      console.log(e);
      interaction.editReply("❌ API cassée");
    }
  }
});
