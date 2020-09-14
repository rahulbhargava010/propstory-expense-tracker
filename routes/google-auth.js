const express = require("express")
const router = express.Router()
const { google } = require("googleapis");

// const { ObjectId } = require("mongodb");
// const google = require("googleapis")



/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: process.env.googleAuthClientId,
  clientSecret: process.env.googleAuthClientSecret,
  redirect: process.env.googleAuthRedirect
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
  console.log("coming inside createConnection")
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  console.log("coming inside getConnectionUrl")
  console.log(auth)
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
// function urlGoogle() {
//   const auth = createConnection();
//   const url = getConnectionUrl(auth);
//   console.log(auth)
//   console.log(url)
//   return url;
// }

router.get('/urlGoogle', (req, res) => {
    console.log('coming inside google')
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    console.log(auth)
    console.log(url)
    res.status(200).send({ url })
    return url;
})
/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */

router.get('/getGoogleAccountFromCode/callback', async (req, res) => {

  const auth = createConnection();
  const data = await auth.getToken(req);
  console.log('data')
  console.log(data)
  const tokens = data.tokens;
  auth.setCredentials(tokens);
  const plus = getGooglePlusApi(auth);
  const me = await plus.people.get({ userId: 'me' });
  const userGoogleId = me.data.id;
  const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  return {
    id: userGoogleId,
    email: userGoogleEmail,
    tokens: tokens,
  };
})


module.exports = router;