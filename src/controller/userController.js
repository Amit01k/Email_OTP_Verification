
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")
const bcrybt = require('bcrypt')
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'maggie32@ethereal.email',
        pass: 'DUYg3SUNz7dUeUuQa1'
    }
});
const isrequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}
// const isValidReferralCode = (referral_code) => {
//     return ['ABCD', 'EFGH', 'IJKL','MNOP','QRST'].indexOf(referral_code) !== -1

// }
//isValidobjectId function, checking input id is valiad or not according to mongoDB id.
const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//isValid will check input field,input field undefined, null, string and input length=0 or not
const isValid = (value) => {
    if (typeof value === "undefined" || value === null)
        return false
    if (typeof value === "string" && value.trim().length === 0)
        return false
    else
        return true
}
//userRegister function for create new user
const inputUser = []
const userRegister = async (req, res) => {
    try {
        if (!isrequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Invalid parameters, please provide user details" })
        }
        //distructuring the input fields
        const { first_name, last_name, phone_number, email } = req.body

        if (!isValid(first_name)) {
            return res.status(400).send({ status: false, message: "please provide user_name" })

        }
        if (!isValid(last_name)) {
            return res.status(400).send({ status: false, message: "please provide last_name" })

        }

        if (!isValid(phone_number)) {
            return res.status(400).send({ status: false, message: "please provide phone_number" })
        }
        if (!(/^\d{10}$/.test(phone_number))) {
            return res.status(400).send({ status: false, message: "Mobile Number is not valid" })
        }

        let duplicatephone = await userModel.findOne({ phone_number, isDeleted: false });
        if (duplicatephone) {
            return res.status(400).send({ status: false, message: "Mobile Number is already in use,please use other Mobile Number" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "please provide email" })
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: "email is not valid" })
        }

        let isDuplicateEmail = await userModel.findOne({ email });
        if (isDuplicateEmail) {
            return res.status(404).send({ status: false, message: "Email is already in use, please use other Email ID" })
        }
        OTP = generateOTP()
        const newUser = {
            ...req.body,
            otp: OTP
        }
        await userModel.create(newUser)
            .then((result) => {
                SendOTPVerificactionEmail(result.email, result.otp)
            }).catch((err) => {
                return res.send(400).send({ status: false, error: err })
            }
            )
        return res.json({ status:true,message: 'Registration successful. Please verify your email with OTP.' });
    }
    catch (err) {
        return res.send(err.message)

    }
}



//login function for creating jsonwebtoken
const login = async (req, res) => {
    try {
        const { email, otp } = req.query
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "please provide email" })
        }
        if (!isValid(otp)) {
            return res.status(400).send({ status: false, message: "please provide otp" })
        }
        let findemail = await userModel.findOneAndUpdate({ email: email, otp: otp, isDeleted: false }, { isVerified: true }, { new: true });
        if (!findemail) {
            return res.status(400).send({ status: false, message: "Email not registerd, please regirster yourself" })
        }
        console.log(findemail)
        let token = jwt.sign({
            userId: findemail._id,
            email: findemail.email,
            iat: Math.floor(Date.now() / 1000),         //doubt clear about this after some time   //payload
            exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60    //1 hourds:minute:second
        }, "Email_OTP_Verification")
        return res.status(200).send({ message: "successfully login", token: token })
    } catch (err) {
        return res.status(404).send({ status: false, message: err.message })
    }
}

//getall function , by this function we can see all the users data
const getall = async (req, res) => {
    data = await userModel.find({ isDeleted: false,isVerified: true });
    return res.status(200).send({ status: true, message: "users list", data: data })

}


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



const SendOTPVerificactionEmail = async ({ email, OTP }, res) => {
    try {
        const mailOptions = {
            from: "maggie32@ethereal.email",
            to: email,
            subject: "Verify your Email",
            text: `enter ${OTP} in the app to verify your email`
        }
        let sendOTP = await transporter.sendMail(mailOptions)
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports.getall = getall;
module.exports.userRegister = userRegister;
module.exports.login = login;
