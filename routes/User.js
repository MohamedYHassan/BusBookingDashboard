const router = require("express").Router();
const { body } = require('express-validator');
const UserController = require("../controllers/userController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");
const upload = require("../middleware/uploadImages");


router.post("/",  admin, upload.single("image"),
    body("email").isEmail().withMessage("Please enter valid email"),
    body("name")
        .isString().withMessage("Please enter a valid name")
        .isLength({ min: 8, max: 30 }).withMessage("Name should be no longer than 30 characters"),
    body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })
        .withMessage("Please enter a valid password"),
      (req, res) => {
            UserController.createUser(req, res);
        }
);


router.put("/:id", authorized, upload.single("image"),
    body("email").isEmail().withMessage("Please enter valid email"),
    body("name")
    .isString().withMessage("Please enter a valid name")
    .isLength({ min: 8, max: 30 }).withMessage("Name should be no longer than 30 characters"),
    body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage("Please enter a valid password"),  (req, res) => {
    UserController.updateUser(req, res);
});


router.delete("/:id", admin,  (req, res) => {
    UserController.deleteUser(req, res);
});

router.get("/", (req, res) => {
    UserController.getUsers(req, res);
});

router.get("/:id", (req, res) => {
    UserController.getUser(req, res);
})



module.exports = router;
