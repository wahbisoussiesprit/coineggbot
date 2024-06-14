const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = '7478777394:AAHY9dsYZfrqIwcDfgFWTH8ip3p0IY-5sfo';
const bot = new TelegramBot(token, { polling: true });

// Object to store users' TON wallet addresses
const users = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to CoinEgg Distribution Bot! Before You Select Your Offers Please Send Your Rovex Wallet Address So You Can Get Your Diamonds. Once You Send your Wallet Select your Offer')
    .then(() => {
        sendOfferButtons(chatId);
    });
});

// Function to check if the received message is a valid TON wallet address
function isValidTonWalletAddress(address) {
    // Add your validation logic here
    // For example, check if the address matches a specific format or length
    return true; // Replace with actual validation logic
}

// Function to send offer buttons
function sendOfferButtons(chatId) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: '3 Diamonds = 3 USDT', callback_data: '3_USDT' },
                    { text: '10 Diamonds = 10 USDT', callback_data: '10_USDT' },
                    { text: '15 Diamonds = 15 USDT', callback_data: '15_USDT' }
                ],
                [
                    { text: '50 Diamonds = 40 USDT', callback_data: '40_USDT' },
                    { text: '100 Diamonds = 90 USDT', callback_data: '90_USDT' }
                ]
            ]
        })
    };

    bot.sendMessage(chatId, 'Select an offer:', options);
}

// Handle messages containing TON wallet address or /done command
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Check if the message is the /done command
    if (messageText === '/done') {
        handleDoneCommand(chatId);
        return; // Exit early so the rest of the function doesn't run
    }

    // Check if the message contains a valid TON wallet address
    if (isValidTonWalletAddress(messageText)) {
        console.log(`Received ROVEX Wallet Address: ${messageText}`);

        // Store the TON wallet address for this user
        users[chatId] = messageText;
    } else {
        // Optionally handle invalid TON wallet address input here
        console.log('Invalid ROVEX Wallet Address received:', messageText);
    }
});

// Function to handle /done command
function handleDoneCommand(chatId) {
    bot.sendMessage(chatId, 'Thank you for your payment! We will process your order shortly.');
}

// Handle button callbacks for offers
bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    // Process the selected offer (data)
    console.log(`Selected offer: ${data}`);

    // Send payment instructions
    sendPaymentInstructions(chatId, data);
});

// Function to send payment instructions
function sendPaymentInstructions(chatId, offer) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'USDT (TRC20)', callback_data: 'USDT_TRC20' }],
                [{ text: 'USDT (ERC20)', callback_data: 'USDT_ERC20' }],
                [{ text: 'Bitcoin', callback_data: 'BTC' }],
                [{ text: 'Ethereum', callback_data: 'ETH' }],
                [{ text: 'Solana', callback_data: 'SOL' }]
            ]
        })
    };

    bot.sendMessage(chatId, `Selected offer: ${offer}\n\nPlease select a wallet address to copy:`, options);
}

// Handle button callbacks for wallet addresses
bot.on('callback_query', (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    let addressMessage = '';
    switch (data) {
        case 'USDT_TRC20':
            addressMessage = 'TFVc6obYbB5yTGKTYsFDhq7CMwqKWCJMaA';
            break;
        case 'USDT_ERC20':
            addressMessage = '0x138Ae41a2208182d1B378Fa489FEd1b9d036Eefd';
            break;
        case 'BTC':
            addressMessage = 'bc1qaxh85rvgqq62wlxlmypxqpvfnd2v4t8uq3tkzl';
            break;
        case 'ETH':
            addressMessage = '0x138Ae41a2208182d1B378Fa489FEd1b9d036Eefd';
            break;
        case 'SOL':
            addressMessage = 'EoeRWW5i67JeMXzwJ1X4e1Ewb45wAom35ZQTwxoai5db';
            break;
        default:
            addressMessage = 'Select Your Offer Again';
    }

    bot.sendMessage(chatId, `Here is the wallet address: (Type /done Once You Send Your Payment To Get Your Diamonds)\`${addressMessage}\``, { parse_mode: 'Markdown' });
});
