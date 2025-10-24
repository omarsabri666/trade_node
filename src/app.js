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

// const target = 9;
// const arr = [2,7,4,3,5]
// function extractNumber(arr,target){
//     console.log('run')
//     console.log(arr,'arr')
//  const   indexs = [];
//     for(let i = 0 ; i < arr.length;i++) {
//         console.log('inside loop')
//         console.log(arr[i])
//         for(let k = i + 1;k< arr.length; k++ ) {
//            if( arr[i] + arr[k] === target) {
//             indexs.push(i,k)

//            }
//         }

//     }
//     return indexs;



// }

// function betterSol(arr,target){
//     // [2,7,4,3,5] 2:0 ; 7:1; 4:2
//     let hashMap = new Map();
//     const indexs = []
//     for(let i = 0 ; i < arr.length; i++){
//   const check =    target -    arr[i]
//   if (hashMap.has(check)) {
//     hashMap.get(check)
    
//     indexs.push(hashMap.get(check),i);
    


//   } else {
//     hashMap.set(arr[i],i)
//   }
//     }
//     return indexs;


// }

// const res = betterSol(arr, target);
// // const res =  extractNumber(arr,target)
// console.log(res)
// const arr = ['x++',"x--","x++"]
// function sum(arr){
//       let x = 0;
//       for (let i = 0; i < arr.length; i++) {
//         if (arr[i].includes("++")) {
//           x = x + 1;
//         } else {
//           x = x - 1;
//         }
//       }
//       console.log(x)
//       return x;

// }

// sum(arr)