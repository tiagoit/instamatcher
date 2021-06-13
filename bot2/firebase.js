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

const checkInstaUsername = async (username) => {
  try {
    const targetUser = await ig.user.searchExact(username);
    const following = targetUser.friendship_status.following;
    const isPrivate = targetUser.friendship_status.is_private;
    // console.log({targetUser});
    return targetUser;
  } catch (error) {
    // console.log('##############ERR', {error});
    return null;
  }
};


(async () => {
    await login();

    var fs = require('fs');
    var dic = fs.readFileSync('dic.txt').toString().split("\n");
    dic = [...dic, ...bannedWords];
    for(i in dic) {
        dic[i] = dic[i].toLowerCase().trim();
        // console.log(dic[i]);
    }
    const doc = await db.collection('profiles').doc('HFrHRd5wZAh9Bu7Vkwki8r5Xqqu1').get();
    const data = doc.data();
    const hash = {};
    let countProfiles = 0;
    for(let key of Object.keys(data)) {
        countProfiles++;
        if(data[key].description) {
            let sanitized = sanitizeHtml(data[key].description, { allowedTags: [] });
            sanitized = sanitized.replace(/[^a-zA-Z0-9._ ]/g, ' ').toLowerCase().trim();
            sanitized.split(' ').forEach(s => {
                if(s.length > 5) hash[s] = key;
            });
        }
    }
    let c = 0;
    let all = 0;
    for(let dWord of Object.keys(hash)) {
        all++;

        if(!dic.includes(dWord) &&
            !Array.from(dWord).some(c => 'àèìòùâêîôûäëïöüáéíóúãõÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÁÉÍÓÚÃÕ'.includes(c))) {
            // data[hash[dWord]] = { ...data[hash[dWord]], insta: dWord}
            // console.log(dWord);
            c++;

            sleep(500);
            try {
              const targetUser = await checkInstaUsername(dWord);
              if(targetUser) {
                // console.log(data[hash[dWord]]);
                if(!data[hash[dWord]].insta) data[hash[dWord]].insta = [];
                data[hash[dWord]].insta.push(dWord);
                sleep(500);
                const follow = await ig.friendship.create(targetUser.pk);

                sleep(500);
                const targetUserFeed = ig.feed.user(targetUser.pk);
                // console.log({targetUserFeed});
                const targetUserFeedPosts = await targetUserFeed.items();
                // console.log({targetUserFeedPosts});

                await ig.media.like({
                  mediaId: targetUserFeedPosts[1].id,
                  moduleInfo: {
                    module_name: 'profile',
                    user_id: targetUser.pk,
                    username: targetUser.username,
                  },
                  d: 0,
                });
              }
            } catch (error) {
              console.log('Error quering Insta', error);
            }
        }
    }

    for(let key of Object.keys(data)) {
        if(data[key].insta) {
            console.log({insa: data[key].insta});
        }
    }

    await db.collection('profiles').doc('HFrHRd5wZAh9Bu7Vkwki8r5Xqqu1').update(data);

    console.log(`COUNT--- ${c} --- ALL --- ${all}  --- PROFILES --- ${countProfiles}`);
    // console.log({d: doc.data()});
    
})()
