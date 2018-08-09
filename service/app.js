// const userApi = require('./api/userApi');
const lexical = require('./api/lexical/lexicalAnalysisAPI');
const user_basical_function = require('./api/user_basical_function/user_function_API');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api/lexical', lexical);
app.use('/api/user_function',user_basical_function );
app.listen(3000);
console.log('success listen at port: 3000')
