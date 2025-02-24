const secret = "troi_oi";
const jwt = require("node-jsonwebtoken");
const maxAge = "1h";
const bcrypt = require('bcryptjs')
exports.adminAuth = (req, res, next) => {
   let beartoken = req.headers.authorization;
   console.log("beartoken =", beartoken)
   if (!beartoken) return res.status(401).json({ thong_bao: "Không vào được. Thiếu token nhé" })
   let token = beartoken.split(' ')[1];  //52A2b39agsdg2342
   console.log("token =", token)
   jwt.verify(token, secret, (err, datadDecoded) => {
      if (err) return res.status(401).json({ thong_bao: "Sai token. Không vào được" })
      if (datadDecoded.role !== 1)
         return res.status(401).json({ thong_bao: "Bạn không phải admin để vào " })
      else next()
   })
}
