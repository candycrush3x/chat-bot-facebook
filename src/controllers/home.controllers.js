require("dotenv").config();
const axios = require("axios");

const HomeServices = require("../services/home.services");

const getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

const postWebhook = (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

const getMessageWebhook = (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message.text) {
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
const handlePostback = async (sender_psid, received_postback) => {
  const payload = received_postback.payload;
  let response;

  switch (payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;
    case "no":
      response = { text: "Oops, try sending another image." };
      break;
    case "GET_STARTED":
      await HomeServices.handleGetStarted(sender_psid);
    default:
      response = {
        text: `Oops! I don't have any response for ${payload} postback!`,
      };
      break;
  }

  // callSendAPI(sender_psid, response);
};

const callSendAPI = (sender_psid, response) => {
  axios({
    url: "https://graph.facebook.com/v17.0/me/messages",
    params: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    data: {
      recipient: {
        id: sender_psid,
      },
      message: response,
    },
  })
    .then((res) => {
      console.log("message sent!");
    })
    .catch(() => {
      console.error("Unable to send message:" + err);
    });
};

const setupProfile = async (req, res) => {
  await axios({
    url: "https://graph.facebook.com/v17.0/me/messenger_profile",
    params: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: "POST",
    data: {
      get_started: { payload: "GET_STARTED" },
      whitelisted_domains: ["https://chat-bot-facebook.onrender.com/"],
    },
  })
    .then(() => {
      console.log("Success: ", body);
    })
    .catch(() => {
      console.error("Error setup profile: " + err);
    });

  return res.send("Setup profile success!");
};

module.exports = {
  getHomePage,
  postWebhook,
  getMessageWebhook,
  setupProfile,
};
