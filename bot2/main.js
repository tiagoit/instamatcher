const { IgApiClient } = require('instagram-private-api');
// const { sample } from 'lodash';
const ig = new IgApiClient();

const username = 'linkeiclub';
const password = 'Linkei#1212';

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(username);
// Optionally you can setup proxy url
// ig.state.proxyUrl = process.env.IG_PROXY;
(async () => {
  // Execute all requests prior to authorization in the real Android application
  // Not required but recommended
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(username, password);
  // console.log({loggedInUser});
  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(async () => await ig.simulate.postLoginFlow());
  // Create UserFeed instance to get loggedInUser's posts
  // const userFeed = ig.feed.user(loggedInUser.pk);
  try {
    const targetUser = await ig.user.searchExact('brunamarquezine');
    const following = targetUser.friendship_status.following;
    const isPrivate = targetUser.friendship_status.is_private;
    console.log({targetUser});

    // const info = await ig.user.info(targetUser.pk);
    // console.log({info});

    // const accDetails = await ig.user.accountDetails(targetUser.pk);
    // console.log({accDetails});

    // const pk = await ig.user.getIdByUsername('brunamarquezine');
    // console.log({pk});
    
    // if(!following) {
    //   const follow = await ig.friendship.create(targetUser.pk);
    //   console.log({follow});
    // }
    
    // const targetUserFeed = ig.feed.user(targetUser.pk);
    // // console.log({targetUserFeed});
    // const targetUserFeedPosts = await targetUserFeed.items();
    // // console.log({targetUserFeedPosts});

    // await ig.media.like({
    //   mediaId: targetUserFeedPosts[1].id,
    //   moduleInfo: {
    //     module_name: 'profile',
    //     user_id: targetUser.pk,
    //     username: targetUser.username,
    //   },
    //   d: 0,
    // });

    const reelsFeed = ig.feed.reelsMedia({ userIds: [targetUser.pk] });
    const storyItems = await reelsFeed.items();
    if (storyItems.length === 0) {
      console.log(`${targetUser.username}'s story is empty`);
      return;
    }
    const seenResult = await ig.story.seen(storyItems);
    // now we can mark story as seen using story-service, you can specify multiple stories, in this case we are only watching the first story
  
    console.log(seenResult.status); // seenResult.status should be "ok"

  } catch (error) {
    console.log('##############ERR', {error});
  }

  // const posts = await userFeed.items();
  // console.log(posts);
  // ig.user.fo
  // const myPostsFirstPage = await userFeed.items();
  // console.log({myPostsFirstPage});
  // // All the feeds are auto-paginated, so you just need to call .items() sequentially to get next page
  // const myPostsSecondPage = await userFeed.items();
  // await ig.media.like({
  //   // Like our first post from first page or first post from second page randomly
  //   mediaId: myPostsFirstPage[0].id,
  //   moduleInfo: {
  //     module_name: 'profile',
  //     user_id: loggedInUser.pk,
  //     username: loggedInUser.username,
  //   },
  //   d: 0,
  // });
})();
