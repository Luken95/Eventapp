const express = require('express');
const cookieParser = require('cookie-parser');
const nedb = require('nedb-promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const database = new nedb({ filename: 'accounts.db', autoload: true });
const ticketsDatabase = new nedb({ filename: 'tickets.db', autoload: true });
const data = require('./database/data.json');
const {
    hashPassword,
    comparePassword
  } = require('./utilis/bcrypt.js');
 
app.use(express.static('../frontend'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));

app.get('/api/ticketsdata', (req, res) => {
    res.send(data);
});

app.post('/api/ticket', async (req, res) => {
    var ticketData = req.body;
    console.log('TicketData:: ', req.body)
    //ticketsDatabase.insert(ticketData);
    await ticketsDatabase.insert(ticketData);
    res.send(ticketData);
});

app.post('/api/create', async (request, response) => {
    const credentials = request.body;
    const resObj = {
      success: true
    }
    const hashedPassword = await hashPassword(credentials.password);
    credentials.password = hashedPassword;
    saveAccount(credentials);
    console.log(hashedPassword)
    
    response.json(resObj);
  }); 

app.post('/api/login', async (request, response) => {
    const credentials = request.body;
    const resObj = {
        success: false,
        token:''
    }
    const account = await database.find({ username: credentials.username });
    const hashedPassword = await hashPassword(credentials.password);
    const isCorrect = comparePassword(hashedPassword, account[0].password)
    if (account.length > 0) {
        if (isCorrect) {
            resObj.success = true;
            const token = jwt.sign({ username: account.username }, "a1b1c1", {
                 expiresIn: 600,       
            });
            resObj.token = token;
            console.log(resObj)
        }
    }
    response.json(resObj);
});


//Verify tickets
app.post('/api/verify', async (request, response) => {
    const req = request.body;
    try {
        if ( !jwt.verify(request.headers.authorization.replace("Bearer ", ""), "a1b1c1")) {
            res.status(401).send("Unauthorized");
            return;
          }
    } catch(error) {
        response.status(401).send("Unauthorized")
        return;
    }
    
    console.log(req.uniqueKey);
    const uKey = parseInt(req.uniqueKey);
    console.log(ticketsDatabase);
    const exists = await ticketsDatabase.find({ uniqueKey: uKey });
    if (exists.length > 0) {
        console.log(exists.length);
        console.log(exists[0]);
        if (exists[0].used === true) {
            console.log('Ticket is already verified');
            response.json("The ticket has already been verified");
        } else {
            ticketsDatabase.update({ uniqueKey: uKey }, { $set: { used: true } });
            response.json("The ticket is now verified");
        }

    } else {
        response.json("Ticket not found");
    }

})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});