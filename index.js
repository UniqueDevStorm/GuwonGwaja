const app = require('express')();
const port = 3000;

const KEY = process.env.API_KEY;
const REDIRECT_URI = {
    Kakao : 'http://localhost:3000/api/oauth2/kakao/callback'
}

app.get('/api/oauth2/kakao', (req, res) => {
    res.redirect(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KEY}&redirect_uri=${REDIRECT_URI.Kakao}`)
})

app.get('/api/oauth2/kakao/callback', (req, res) => {
    res.send(req.query.code)
})

app.listen(port, () => {
    console.log(`현재 서버가 http://localhost:${port}/ 에서 열리고 있습니다.`)
})