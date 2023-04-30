const router = require("express").Router();
const { body } = require('express-validator');
const busController = require("../controllers/busController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");


router.post("/", admin,
    body("code").isString().withMessage("Please enter a valid code")
        .isLength({ min: 3, max: 6 }).withMessage("code should be at least 3 characters"),    
    body("capacity").isNumeric().withMessage("Please enter valid number"), 
      (req, res) => {
          busController.createBus(req, res);
        }
);


router.put("/:id", admin,
    body("code").isString().withMessage("Please enter a valid code")
         .isLength({ min: 3, max: 10 }).withMessage("code should be at least 3 characters"),    
    body("capacity").isNumeric().withMessage("Please enter valid number"), 
      (req, res) => {
          busController.updateBus(req, res);
        }
);


router.delete("/:id", admin, (req, res) => {
    busController.deleteBus(req, res);
})

router.get("/", admin, (req, res) => {
    busController.getBusses(req, res);
})

router.get("/:id", admin, (req, res) => {
    busController.getBus(req, res);
})






module.exports = router;