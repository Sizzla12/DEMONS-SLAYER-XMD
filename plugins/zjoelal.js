import fs from 'fs';

// Function to get the uptime in a human-readable format
const getUptime = () => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Helper function to get the platform name
const getPlatformName = () => {
  const platform = process.platform;
  if (platform === 'darwin') return 'macOS';
  if (platform === 'win32') return 'Windows';
  if (platform === 'linux') {
    // Check for specific Linux distros
    if (fs.existsSync('/etc/heroku-release')) return 'Heroku';
    if (fs.existsSync('/etc/koyeb-release')) return 'Koyeb';
    if (fs.existsSync('/etc/render-release')) return 'Render';
    return 'Linux';
  }
  return 'Unknown';
};


// Letter-by-letter typewriter effect function
const typeWriterEffect = async (m, Matrix, key, message) => {
  const typingSpeed = 100; // Speed in milliseconds
  let i = 0;

  const typewriterInterval = setInterval(async () => {
    if (i < message.length) {
      const typedText = message.slice(0, i + 1);
      await Matrix.relayMessage(m.from, {
        protocolMessage: {
          key: key,
          type: 14,
          editedMessage: {
            conversation: typedText,
          },
        },
      }, {});
      i++;
    } else {
      clearInterval(typewriterInterval);
    }
  }, typingSpeed);
};

// Main command function
const serverStatusCommand = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (['pong', 'respone', 'online'].includes(cmd)) {
    const uptime = getUptime();
    const platform = getPlatformName();

    try {
      const loadingMessages = [
        "*「▰▰▰▱▱▱▱▱▱▱」*",
        "*「▰▰▰▰▱▱▱▱▱▱」*",
        "*「▰▰▰▰▰▱▱▱▱▱」*",
        "*「▰▰▰▰▰▰▱▱▱▱」*",
        "*「▰▰▰▰▰▰▰▱▱▱」*",
        "*「▰▰▰▰▰▰▰▰▱▱」*",
        "*「▰▰▰▰▰▰▰▰▰▱」*",
        "*「▰▰▰▰▰▰▰▰▰▰」*",
        "*「 joel  xd  v3 by joel」*",
      ];

      const loadingMessageCount = loadingMessages.length;
      let currentMessageIndex = 0;

      const { key } = await Matrix.sendMessage(m.from, { text: loadingMessages[currentMessageIndex] }, { quoted: m });

      const loadingInterval = setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessageCount;
        Matrix.relayMessage(m.from, {
          protocolMessage: {
            key: key,
            type: 14,
            editedMessage: {
              conversation: loadingMessages[currentMessageIndex],
            },
          },
        }, {});
      }, 500);


      await new Promise(resolve => setTimeout(resolve, 4000));

      clearInterval(loadingInterval);

      // Create the status message
      const statusMessage = `╭───────────────━⊷\n║ ᴊᴏᴇʟ-xᴍᴅ ᴍᴀɪɴ\n╰───────────────━⊷\n╭───────────────━⊷\n║*ɴᴀᴍᴇ:* ᴊᴏᴇʟ-xᴍᴅ\n║*ᴜᴘᴛɪᴍᴇ:*  ${uptime}\n║*ᴄʜʀᴏᴍᴇ:* ${platform}\n║ *ᴏᴡɴᴇʀ:* ʟᴏʀᴅ ᴊᴏᴇʟ
╰───────────────━⊷\n╭───────────────━⊷\n║ sᴛᴀʀ ᴛʜᴇɴ ғᴏʀᴋ ᴍʏ ʀᴇᴘᴏ\n║ ʀᴇᴘᴏ ʟɪɴᴋ: https://shorturl.at/MV98C\n╰───────────────━⊷\n\nρσωєяє∂ ву ℓσя∂ ʝσєℓ`;

      await typeWriterEffect(m, Matrix, key, statusMessage);
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }
};

export default serverStatusCommand;
