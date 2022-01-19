const axios = require('axios');

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

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

const handler = async (req, res) => {
  const {profile} = req.query;
  let result;

  try {
    result = await axios.get(`https://www.instagram.com/${profile}/?__a=1`);
  } catch (err) {
    res.end(err)
  }

  console.log(result.data)
  const posts = result.data.graphql.user.edge_owner_to_timeline_media.edges;
  const view = [];

  posts.map(post => {
    view.push({
      instagram_link: `https://www.instagram.com/p/${post.node.shortcode}/`,
      link: corsDown(post.node.display_url),
      caption: post.node.edge_media_to_caption.edges[0].node.text,
    })
  })
  res.end(JSON.stringify(view))
}

module.exports = allowCors(handler)