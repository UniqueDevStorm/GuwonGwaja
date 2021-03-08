const app = require('express')();
const fetch = require('node-fetch');
const port = 3000;

const KEY = process.env.API_KEY;
const API_BASE_URI = {
    Kakao : 'https://kauth.kakao.com'
}

const REDIRECT_URI = {
    Kakao : 'http://localhost:3000/api/oauth2/kakao/callback'
}

const API_KEY = {
    Kakao : process.env.KAKAO_API_KEY
}

app.get('/api/oauth2/kakao', (req, res) => {
    res.redirect(`${API_BASE_URI.Kakao}/oauth/authorize?client_id=${KEY}&redirect_uri=${REDIRECT_URI.Kakao}&response_type=code&scope=profile,account_email`)
})

app.get('/api/oauth2/kakao/callback', async (req, res) => {
    const code = req.query.code;
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.API_KEY,
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

app.listen(port, () => {
    console.log(`현재 서버가 http://localhost:${port}/ 에서 열리고 있습니다.`)
})