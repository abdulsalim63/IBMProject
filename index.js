import express from 'express';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import generalRouter from './Routes/general.js';
import authRouter from './Routes/auth_users.js';

let users = [];

const tokenKey = "tokenku";

const existedUser = (username) => {
    let user = users.find(user => user.username == username);
    if (user) {
        return true;
    }

    return false;
}

const authenticatedUser = (username, password) => {
    let user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return true;
    }
    
    return false;
}

const app = new express();
app.use(session({secret: "fingerprint", resave:true, saveUninitialized:true}));
app.use(express.json());

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        jwt.verify(token, tokenKey, (err, user) => {
            if (err) {
                return res.status(403).json({message: "Unauthorized"});
            }
            else {
                console.log(user)
                req.user = user;
                next();
            }
        })
    }
    else {
        return res.status(403).json({message: "User not logged in"});
    }
})

app.post("/customer/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        if (!existedUser(username)) {
            users.push({
                id: users.length + 1,
                username, password
            })
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
        else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    else {
        return res.status(400).json({message: "Unable to register user"});
    }
})

app.post("/customer/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        if (authenticatedUser(username, password)) {
            let id = users.find(user => user.username === username && user.password === password).id;
            let accessToken = jwt.sign({
                data: {id, username}
            }, tokenKey, { expiresIn: 60 * 5 });

            req.session.authorization  = {
                accessToken, username
            }

            return res.status(200).json({message: "User successfully logged in"});
        }
        else {
            return res.status(404).json({message: "Invalid username or password"});
        }
    }
    else {
        return res.status(400).json({message: "Invalid request"});
    }
})

app.use('/books', generalRouter);
app.use('/customer/auth', authRouter);

app.listen(5000, () => {
    console.log("Listening to 5000...");
})