const venom = require('venom-bot');
const akaneko = require("akaneko");
const DabiImages = require("dabi-images");
const cloudinary = require('cloudinary').v2
require('dotenv').config()

const cloud = cloudinary;

const DabiClient = new DabiImages.Client();

cloud.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
  secure: true,
});

venom
  .create({
    session: 'tonho',
    multidevice: true
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
    client.onMessage(async (message) => {
    const user = message.from;
    const messageBody = message.body;

    if (!messageBody) return;

    const args = messageBody.slice(0).split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (messageBody === "digita, porra") {
      await client.startTyping(user);
    }

    if (messageBody === "para de digitar, porra") {
      await client.stopTyping(user);
    }

    if (messageBody === 'Oi' || messageBody === "oi") {
      const name = message.sender.pushname;

      if (name === undefined) {
        await client.sendText(user, `Olá`);
      }
      
      await client.sendText(user, `Olá, ${message.sender.pushname}`);
    }

    if (message.type === "image") {
      if (message.caption === "!sticker") {
        try {
          const caption = message.caption;
  
          console.log(`
          caption:
          ${caption}
          `);
  
          const buffer = await client.decryptFile(message);

          cloud.uploader.upload_stream({}, async (error, result) => {
            if (error) {
              console.log(error);
              return;
            }

            if (result) {
              console.log("result:");
              console.log(result);

              try {
                await client.sendImageAsSticker(user, result.url);
              } catch (error) {
                await client.sendText(user, `Ocorreu um erro inesperado! Xingue o desenvolvedor \n\n ${error}`);
                console.log(`send sticker error: ${error}`);
              }
            }
          }).end(buffer);

        } catch (err) {
          await client.sendText(user, "Ocorreu um erro inesperado! Xingue o desenvolvedor");
          console.log(`!sticker: ${err}`);
        }
      }
    }

    if (message.type === "video") {
      if (message.caption === "!sticker") {
        try {
          const caption = message.caption;
  
          console.log(`
          caption:
          ${caption}
          `);

          const buffer = await client.decryptFile(message);

          // cloud.search

          cloud.uploader.upload_stream({
            folder: "stickers",
            resource_type: "video", 
            eager: {
              width: 512, 
              height: 512,
              crop: "crop"
            }
          }, async (error, result) => {
            if (error) {
              console.log(error);
              return;
            }

            if (result) {
              console.log(result);

              const toGif =  result.eager[0].url.replace("mp4", "gif")

              try {
                await client.sendImageAsStickerGif(user, toGif);
              } catch (error) {
                await client.sendText(user, `Ocorreu um erro inesperado! Xingue o desenvolvedor \n\n ${error}`);
                console.log(`send sticker error: ${error}`);
              }
            }
          }).end(buffer);

        } catch (err) {
          await client.sendText(user, "Ocorreu um erro inesperado! Xingue o desenvolvedor");
          console.log(`!sticker: ${err}`);
        }
      }
    }

    if (command === "!hentai") {
      await client.sendImage(user, await akaneko.nsfw.blowjob());
    }

    if (command === "!ass") {
      DabiClient.nsfw.real.ass().then(async (json) => {
        await client.sendImage(user, json.url);

      }).catch((error) => {
          console.log(error);
      });
    }

    if (command === "!feet") {
      await client.sendImage(user, await akaneko.nsfw.feet());
    }

    if (command === "!gay") {
      cloud.api.resources({
        type: 'upload',
        prefix: 'g4i',
        max_results: 30
      }, async (error, result) => { 
        const min = Math.ceil(0);
        const max = Math.floor(27);
        const random = Math.floor(Math.random() * (max - min)) + min;
        console.log("random " + random);

        await client.sendImage(user, result.resources[random].url);
      });
    }
  });
}