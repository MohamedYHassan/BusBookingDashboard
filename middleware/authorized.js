// const connectToDb = require("../db/dbconnectToDb");
const util = require("util");

// const authorized = async (req, res,next) => {
//     const query = util.promisify(connectToDb.query).bind(connectToDb);
//     const { token } = req.headers; 
//     const userData = await query("select * from users where token = ?", [token]);
//     if (userData[0]) {
//         next();
//     } else {
//         res.status(403).json({
//             msg: "you are not authorized to access this route "
//         })
//     }
    

// }

// module.exports = authorized; 



const authorized = async (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(403).json({
        msg: "you are not authorized to access this route "
      });
    }
  }
module.exports = authorized;  