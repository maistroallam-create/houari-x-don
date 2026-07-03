const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
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
        const { connection, lastDisconnect, qr } = update;
        if (connection === 'close') {
            connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('MAYSTRO-X Online! 😈🔥');
            sock.sendMessage('212697852207@s.whatsapp.net', { text: 'المايسترو شاعل دابا! 😈🔥' });
        }
    });

    // Pairing Code Logic
    setTimeout(async () => {
        const code = await sock.requestPairingCode('212697852207');
        console.log('كود الاقتران الخاص بك هو: ' + code);
    }, 5000);
}

connectToWhatsApp();
