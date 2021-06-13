const admin = require('firebase-admin');
const sanitizeHtml = require('sanitize-html');

const serviceAccount = require('./service-account.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const bannedWords = ['Insta', 'Instagram'];

const { IgApiClient } = require('instagram-private-api');
const ig = new IgApiClient();

const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));

const login = async () => {
  ig.state.generateDevice('linkeiclub');
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login('linkeiclub', 'Linkei#1212');
  process.nextTick(async () => await ig.simulate.postLoginFlow());
}

