const app = require('express')();
const port = 3000;

app.get('/api/oauth2/kakao', (req, res) => {
    res.send('샌즈지 뭐 아 ㅋㅋ')
})

app.listen(port, () => {
    console.log(`현재 서버가 http://localhost:${port}/ 에서 열리고 있습니다.`)
})