const express = require('express');
const app = express();
const port = 3000;


const connect = require('./schemas')
connect();
const indexRouter = require('./routes/index.js')

app.use(express.json());
app.use('/', indexRouter)

app.get('/', (req, res) => {
  res.send('항해99 Node.js 입문주차 과제입니다');
});



app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});