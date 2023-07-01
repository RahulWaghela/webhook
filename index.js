const { default: axios } = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const app = express().use(bodyParser.json());
require('dotenv').config();
const port=process.env.PORT || 6545;
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let challenge = req.query['hub.challenge'];
    let token = req.query['hub.verify_token'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === mytoken) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
});

app.post('/webhook', (req, res) => {

    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));
    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes.value.message &&
            body_param.entry[0].changes[0].value.message[0]) {

            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.message[0].from;
            let msg_body = body_param.entry[0].changes[0].value.message[0].text.body;

            axios({
                method: 'POST',
                url: "https://graph.facebook.com/v17.0/" + phon_no_id + "/messages?access_token=" + token,
                data: {
                    "messaging_product": "whatsapp",
                    to: from,
                    text: {
                        body: "Hi.. from other side"
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });
            res.send(200);
        } else {
            res.send(404);
        }
    }
});
app.get('/',(req,res)=>{
    res.status(200).send('webhook running..')
})
app.listen(port,()=>{
    console.log(`Webhook is Running at http://localhost:${port}`);
})