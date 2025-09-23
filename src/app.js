 require("dotenv").config({path:"../.env"});
 const cookieParser = require("cookie-parser");
 const express = require("express");
 const app = express();
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cookieParser());
 app.use("/auth", require("./routes/authRoute"));
 app.use("/users", require("./routes/userRoute"));

 



app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));