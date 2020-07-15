const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {

    const { hub_mode, hub_challenge, hub_verify_token } = req.query;
    if (hub_verify_token == "tokentestverify") {
        res.status(200).json({ "hub_challenge": hub_challenge})
    } else {
        res.status(400)
    }
})

module.exports = router