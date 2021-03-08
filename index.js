const app = require('express')();
const fetch = require('node-fetch');
const port = 3000;
require('dotenv').config();

const LOCAL_BASE_URI = process.env.HOST

const API_BASE_URI = {
    Kakao : 'https://kauth.kakao.com',
    Google : 'https://accounts.google.com/o'
}

const REDIRECT_URI = {
    Kakao : `${LOCAL_BASE_URI}/api/oauth2/kakao/callback`,
    Google : `${LOCAL_BASE_URI}/api/oauth2/google/callback`
}

const API_KEY = {
    Kakao : process.env.KAKAO_API_KEY,
    Google : {
        CLIENT_ID : process.env.GOOGLE_API_CLIENT_ID,
        CLIENT_SECRET : process.env.GOOGLE_API_CLIENT_SECRET
    }
}

app.get('/api/oauth2/kakao', (req, res) => {
    res.redirect(`${API_BASE_URI.Kakao}/oauth/authorize?client_id=${API_KEY.Kakao}&redirect_uri=${REDIRECT_URI.Kakao}&response_type=code&scope=profile,account_email`)
})

app.get('/api/oauth2/kakao/callback', async (req, res) => {
    const code = req.query.code;
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: API_KEY.Kakao,
        redirect_uri: REDIRECT_URI.Kakao,
        code: code
    })
    const request = (await (await fetch(`${API_BASE_URI.Kakao}/oauth/token`, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })).json())
    const access_token = request.access_token;
    const type = request.token_type;
    const user = (await (await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: {
            Authorization: `${type} ${access_token}`
        }
    })).json())
    res.send(user)
})

app.get('/api/oauth2/google', (req, res) => {
    res.redirect(`https://accounts.google.com/o/oauth2/auth?client_id=${API_KEY.Google.CLIENT_ID}&redirect_uri=${REDIRECT_URI.Google}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile`)
})

app.get('/api/oauth2/google/callback', async (req, res) => {
    const code = req.query.code;
    const params = new URLSearchParams({
        client_id: API_KEY.Google.CLIENT_ID,
        client_secret: API_KEY.Google.CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI.Google,
        grant_type: 'authorization_code'
    })
    const request = (await (await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })).json())
    const access_token = request.access_token;
    const user = (await (await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })).json())
    res.send(user);
})

app.listen(port, () => {
    console.log(`현재 서버가 http://localhost:${port}/ 에서 열리고 있습니다.`)
})