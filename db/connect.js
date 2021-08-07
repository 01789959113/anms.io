const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true})
.then(()=> console.log('we are connected'))
.catch((err)=> console.log(err))