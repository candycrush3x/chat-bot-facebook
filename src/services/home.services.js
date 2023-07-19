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
  axios({
    url: `https://graph.facebook.com/${sender_psid}`,
    params: {
      fields: "first_name,last_name,profile_pic",
      access_token: process.env.PAGE_ACCESS_TOKEN,
    },
    method: "GET",
  })
    .then((res) => {
      const result = JSON.parse(res.data);
    })
    .catch((err) => {
      console.error("Unable to send message:" + err);
    });
};

const handleGetStarted = async (sender_psid) => {
  const response = { text: "Welcome Tai Sao to my chat bot website!" };
  await callSendAPI(sender_psid, response);
};

module.exports = { getUserName, handleGetStarted };
