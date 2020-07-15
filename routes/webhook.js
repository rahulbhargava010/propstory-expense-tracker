const express = require("express")
const router = express.Router()

router.post('/webhook', (req, res) => {

    // const { hub.mode, hub.challenge, hub.verify_token } = req.params;
    const mode = req.params.hub.mode
    const challenge = req.params.hub.challenge
    const verify_token = req.params.hub.verify_token
    if (verify_token == "tokentestverify") {
        res.status(200).json({ "hub.challenge": challenge})
    }
})

module.exports = router