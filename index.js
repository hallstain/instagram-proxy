// create an express app
const express = require("express")
const cors = require('cors')
const axios = require("axios");
const app = express()

app.use(cors())

const atob = (base64) => {
  return Buffer.from(base64, 'base64').toString('binary');
};

// https://github.com/crypto-su/corsDown
const corsDown = (src) => {
  const p = src.split("/");
  let t = '';
  for (let i = 0; i < p.length; i++) {
    if (i === 2) {
      t += p[i].replace(/-/g, '--').replace(/\./g, '-') + atob('LnRyYW5zbGF0ZS5nb29n') + '/';
    } else {
      if (i !== p.length - 1) {
        t += p[i] + '/';
      } else {
        t += p[i];
      }
    }
  }
  return t
}

app.get("/:profile", async (req, res) => {
  const {profile} = req.query;
  let result;

  try {
    result = await axios.get(`https://www.instagram.com/${profile}/channel`, {params: {__a: 1}});
  } catch (err) {
    res.end(err)
  }

  // const posts = result.data.graphql.user.edge_owner_to_timeline_media.edges;
  // const view = [];
  //
  // posts.map(post => {
  //   view.push({
  //     instagram_link: `https://www.instagram.com/p/${post.node.shortcode}/`,
  //     link: corsDown(post.node.display_url),
  //   })
  // })
  // res.send(JSON.stringify(view))
  res.send(result.data)
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log("Server is running...", process.env.PORT || 3000));