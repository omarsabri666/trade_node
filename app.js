 require("dotenv").config({path:"../.env"});
 const passport = require("passport");
 require("./auth/googleAuth");

 const cookieParser = require("cookie-parser");
 const express = require("express");
 const app = express();
 app.use(passport.initialize());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cookieParser());

 app.use("/auth", require("./routes/authRoute"));
 app.use("/users", require("./routes/userRoute"));
 app.use("/products", require("./routes/productRoute"));
 app.use("/categories", require("./routes/categoryRoute"));
 app.use("/offers", require("./routes/offerRoute"));

 
// [{name : omar, id : 1},{name : sabry, id : 4}]


app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));



