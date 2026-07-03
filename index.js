const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('MAYSTRO-X ONLINE 😈🔥');
            sock.sendMessage('212653595016@s.whatsapp.net', { text: 'المايسترو شاعل دابا يا المطور! 😈🔥' });
        }
    });

    // كود الاقتران
    setTimeout(async () => {
        const code = await sock.requestPairingCode('212653595016');
        console.log('كود الاقتران الخاص بك هو: ' + code);
    }, 5000);
}

connectToWhatsApp();
