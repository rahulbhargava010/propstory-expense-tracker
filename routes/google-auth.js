const express = require("express")
const router = express.Router()
const { google } = require("googleapis");

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
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  )
}

const oAuth2Client = new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  )

function getConnectionUrl(auth) {
  // console.log("coming inside getConnectionUrl")
  // console.log(auth)
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

router.get('/urlGoogle', (req, res) => {
    // console.log('coming inside google')
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    // console.log(auth)
    // console.log(url)
    res.status(200).send({ url })
    // return url;
})
/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */

router.get('/getGoogleAccountFromCode/callback', async (req, res) => {

    const code = req.query.code
    if (code) {
        const data = await oAuth2Client.getToken(code, async(err, tokens) => {
            if (err) {
                res.status(400).send({
                    "error": "authentication failed",
                    err
                })
            } else { 
                await oAuth2Client.setCredentials(tokens);
                const plus = await getGooglePlusApi(auth);
                const me = plus.people.get({ userId: 'me' });
                const userGoogleId = me.data.id;
                const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
                res.status(200).send({
                    "success": true,
                    id: userGoogleId,
                    email: userGoogleEmail,
                    tokens: tokens,
                })
            }
        });
    }
})

module.exports = router;