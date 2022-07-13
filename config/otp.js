const otpGenerator = require('otp-generator');

module.exports.generateOTP = () => {
    const OTP = otpGenerator.generate(4,{
        digits:true, specialChars:false, lowerCaseAlphabets:false, upperCaseAlphabets:false
    })
    return OTP;
}