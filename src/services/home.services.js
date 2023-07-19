require("dotenv").config();
const axios = require("axios");

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
    .then(() => {
      console.log("Message sent!");
    })
    .catch(() => {
      console.error("Unable to send message:" + err);
    });
};

const getUserName = async (sender_psid) => {
  try {
    const res = await axios({
      url: `https://graph.facebook.com/${sender_psid}`,
      params: {
        fields: "first_name,last_name,profile_pic",
        access_token: process.env.PAGE_ACCESS_TOKEN,
      },
      method: "GET",
    });
    return `${res.data.first_name} ${res.data.last_name}`;
  } catch (err) {
    console.error("Unable to send message:" + err);
  }
};

const handleGetStarted = async (sender_psid) => {
  const username = await getUserName(sender_psid);
  await callSendAPI(sender_psid, getStartedMessageTemplate("TEXT"));
  await callSendAPI(sender_psid, getStartedMessageTemplate("GENERIC"));
};

const getStartedMessageTemplate = (type) => {
  if (type === "TEXT") {
    return {
      text: `Welcome ${username} to my chat bot website!`,
    };
  }

  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            image_url: "https://bit.ly/get-started-image",
            title: "Welcome to my chat bot!",
            subtitle: "The below buttons are my services we have",
            buttons: [
              {
                type: "postback",
                title: "Start Chatting",
                payload: "START_CHATTING",
              },
              {
                type: "postback",
                title: "Call girl",
                payload: "CALL_GIRL",
              },
            ],
          },
        ],
      },
    },
  };
};

module.exports = { handleGetStarted };
