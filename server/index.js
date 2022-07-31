const express = require("express");
const app = express();
const User = require("./models/user");
const Contact = require("./models/contact");
// const Conversation = require("./models/conversation")
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const localStratergy = require("passport-local");
const cookieParser = require("cookie-parser");
const io = require("socket.io")(5000, { origin: "http://localhost:3000" });

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("secret code"));
app.use(
  session({
    secret: "keyboard cat",
    cookie: { httpOnly: false },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect("mongodb://localhost:27017/text-cord", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connection Successful!");
  })
  .catch((e) => {
    console.log("Mongo Connection Unsuccessful", e.message);
  });

app.get("/", (req, res) => {
  console.log(req.user);
  console.log("app touched!");
});

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body.userData;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log("post request recieved");
    console.log(req.body);
    // console.log(JSON.parse(req.body))
    res.send(req.body);
    req.login(registeredUser, (err) => {
      if (err) console.log(err);
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", true);
    }
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/login", (req, res, next) => {
  try {
    console.log("login request initaited!");
    console.log(req.body);
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return res.status(401).json(err);
      }
      if (user) {
        const loggedInUser = User.findOne(
          { username: req.body.username },
          (err, doc) => {
            if (err) throw err;
            if (!doc) {
              console.log("No such user exists.");
            } else {
              res.status(200).json(doc);
              if (typeof window !== "undefined") {
                localStorage.setItem("isLoggedIn", true);
              }
              next();
            }
          }
        );
      } else {
        res.status(401).json(info);
      }
    })(req, res, next);
    // console.log(req.user);
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/list-contacts", async (req, res) => {
  let contacts = [];
  try {
    const user = await User.findById(req.body.id).exec();
    for (let contact of user.contacts) {
      const foundContact = await Contact.findById(contact);
      // console.log(foundContact);
      contacts.push(foundContact);
    }
    res.send(contacts);
    // console.log(user.contacts);
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/user/:id/contacts", async (req, res) => {
  console.log("new contact route reached!");
  try {
    const { id } = req.params;
    const user = await User.findById(id).exec();
    const contact = await new Contact({
      name: req.body.newContact.name,
      email: req.body.newContact.email,
    });
    user.contacts.push(contact);
    await contact.save();
    await user.save();
    // console.log("success!");
  } catch (e) {
    console.log(e.message);
  }
});

app.post("/user", (req, res, next) => {
  // const { userUsername } = req.params;
  // console.log(userUsername);
  console.log("/user");
  console.log(req.body);
  const loggedInUser = User.findOne(
    { username: req.body.username },
    (err, doc) => {
      if (err) throw err;
      if (!doc) {
        console.log("No such user exists.");
      } else {
        res.send(doc);
        next();
      }
    }
  );
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
  });
});

// app.use((req, res, next) => {
//   res.locals.currentUser = req.user;
//   next();
// });

// socket.io functioning ->
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", (receiverId, message) => {
    socket.broadcast.to(receiverId).emit("receive-message", {
      receiverId,
      senderId: id,
      message,
    });
  });
});

app.listen("3001", () => {
  console.log("App is listening on port 3001...");
});
