const { User, validationLoginUser,validationRegisterUser,validationSendCode ,validationConfrimCode} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiErrorCode = require("../../../core/errors/apiError") 
const sendEmail = require("../../../core/utils/send-email")
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../../../core/middleware/verify-token");

const express = require("express");
router = express.Router();

router.post("/login", async (req, res) => {
  const { error } = validationLoginUser(req.body);

  if (error) {
    res.status(400).json({
      status_code: ApiErrorCode.validation,
      message: error.message,
      error: {
        message: error.message,
      },
    });
  } else {
    User.findOne({ email: req.body.email })
    .then(async (docs) => {
      if (docs) {
        const { password, __v, ...other } = docs._doc;
        const validPassword = await bcrypt.compare(
          req.body.password,
          docs.password
        );

        if(docs.isVerified == true){

          if (validPassword ) {
            const token = jwt.sign(
              {
                id: docs._id,
                isAdmin: docs.isAdmin,
              },
              process.env.JWT_SECRET_KEY
            );
            docs.token.push(token);
            docs
              .save()
              .then((result) => {
                res.status(200).json({
                  status_code: 1,
                  message: "Welcome back Mr." + docs.username,
                  data: {
                    user: {
                      ...other,
                      token: token,
                    },
                  },
                });
  
              })
              .catch((error) => {
                res.status(500).json({
                  status_code: ApiErrorCode.internalError,
                  message: "The server is down, please try again later",
                  error: {
                    message: error.message,
                  },
                });
              });
          } else {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: "Please enter a valid email and password",
              data: null,
            });
          }

        }else {

          const salt = await bcrypt.genSalt(10)

          let otpCode =  Math.floor(Math.random() * 9000) + 1000;

          await sendEmail(req.body.email,otpCode)

          otpCode = await bcrypt.hash( otpCode.toString(),salt )

          docs.otpCode = otpCode

          await docs.save()

          res.status(400).json({
            status_code: ApiErrorCode.authorization,
            message: "Your account is not verified",
            data: null,
            error : {
              message : "Please verifiy your account to be able to login"
            }
          });
        }
       

        
      } else {
        res.status(400).json({
          status_code: -1,
          message: "There are no accounts connected to this email",
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "The server is down, please try again later",
        error: {
          message: error.message,
        },
      });
    });
  }

  

});

router.post("/register", async (req, res) => {

  const { error } = validationRegisterUser(req.body);

  if(error) {
    res.status(400).json({
      status_code: ApiErrorCode.validation,
      message: error.message,
      error: {
        message: error.message,
      },
    });
  } else {
    User.findOne({
      email : req.body.email
    })
      .then(async (docs) => {
        if (docs) {
          res.status(400).json({
            status_code: ApiErrorCode.alreadyExists,
            message: "This email already exists, try to login to your account",
            data: null,
            error: {
              message: "This email already exists, try to login to your account",
            },
          });
        } else {


          const salt = await bcrypt.genSalt(10)

          let otpCode =  Math.floor(Math.random() * 9000) + 1000;

          await sendEmail(req.body.email,otpCode)

          req.body.password = await bcrypt.hash( req.body.password,salt )
          otpCode = await bcrypt.hash( otpCode.toString(),salt )

          const user = new User({
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
            otpCode : otpCode
          })
          
          await user.save()
          .then((docs)=> {

            const {__v , password , token,otpCode, ...other} = docs._doc

            res.status(200).json({
              status_code: 1,
              message: "An email has been sent to your address, check your inbox to confirm your email",
              data: {
                ...other
              },
            
            });

          }).catch((error)=> {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message: error.message,
              data: null,
              error: {
                message: error.message,
              },
            });
          })
        }
      })
      .catch((error) => {
        res.status(500).json({
          status_code: ApiErrorCode.internalError,
          message: error.message,
          data: null,
          error: {
            message: error.message,
          },
        });
      });
  }
  
  
});

router.post("/send-code", async (req, res) => {

  const { error } = validationSendCode(req.body);

  if(error) {
    res.status(400).json({
      status_code: ApiErrorCode.validation,
      message: error.message,
      error: {
        message: error.message,
      },
    });
  } else {

          User.findOne({ email: req.body.email })
          .then(async (docs)=> {

            if(docs){

              const salt = await bcrypt.genSalt(10)
              let otpCode =  Math.floor(Math.random() * 9000) + 1000;
              await sendEmail(req.body.email,otpCode)
              otpCode = await bcrypt.hash( otpCode.toString(),salt )
              docs.otpCode = otpCode
              await docs.save()
              res.status(200).json({
                status_code: 1,
                message: "A code has been sent to your email, check your inbox",
                data: null,
              });

            }else{
              res.status(404).json({
                status_code: ApiErrorCode.notFound,
                message: "You have not been registered to the app",
                error: {
                  message: "You have not been registered to the app",
                },
              });
            }
            
          })
          .catch((error)=> {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          })

          
  }
  
  
});

router.post("/confirm-code", async (req, res) => {

  const { error } = validationConfrimCode(req.body);

  if(error) {
    res.status(400).json({
      status_code: ApiErrorCode.validation,
      message: error.message,
      data : null,
      error: {
        message: error.message,
      },
    });
  } else {

    User.findOne({ email: req.body.email })
    .then(async (docs)=> {

      const validCode = await bcrypt.compare(
        req.body.otpCode,
        docs.otpCode
      );

      if(validCode){
        docs.isVerified = true;
        docs.otpCode = null;
        await docs.save()
        res.status(200).json({
          status_code: 1,
          message: "Your email has been verified",
          data : null,
         
      });

      }else {
        res.status(400).json({
            status_code: ApiErrorCode.notFound,
            message: "Your have entered a wrong code",
            data : null,
            error: {
            message: "Your have entered a wrong code",
          },
        });
      }

    })
    .catch((error)=> {
        res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: error.message,
            data : null,
            error: {
              message: error.message,
            },
        });
    })
  }
  
  
});

router.post("/logout", verifyToken, async (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $set: { token: [] } })
    .select("-token -password -__v")
    .then((docs) => {
      if (docs) {
        res.status(200).json({
          status_code: 1,
          message: "You have been logged out from your account",
          data: docs,
        })
      } else {
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Didn't find user",
          data: null,
          error: error.message,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "internal server error",
        error: error.message,
      });
    });
});

router.get("/get-password", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  res.status(200).json({
    status_code: 1,
    message: "This is a hashed password",
    data: {
      password: req.body.password,
    },
  });
});

module.exports = router;
