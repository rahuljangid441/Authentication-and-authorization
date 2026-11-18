import ApiError from '../../common/utils/api-error.js';
import User from './auth.model.js'
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from '../../common/utils/jwt-utils.js';
import { sendEmail } from '../../common/config/email.js';
import fs from 'node:fs';
import imageKit from '../../common/config/imageKit.js';


const hashedToken = (token) => crypto.createHash("sha256").update(token).digest('hex')

export const register = async ({ name, email, password, role }) => {
    //check if user is already there or not?
    const existingUser = await User.findOne({ email });


    if (existingUser) {
        ApiError.conflict('User with this email id already exist')
    }

    //make an entry for this user
    const { rawToken, hashedToken } = generateResetToken();


    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: rawToken
    });

    await sendEmail({
        to:user.email,
        subject: "Verify Email Address",
         html: `
      <h2>Welcome ${user.name}!</h2>
      <p>Thank you for registering.</p>
      <p>Please click the link below to verify your email:</p>
      <a href="${rawToken}">Verify Email</a>
      <p>This link expires in 15 minutes.</p>
    `,
    })

    const userObj = user.toObject();
    delete userObj.password
    delete userObj.verificationToken

    return userObj;
}


export const login = async ({ email, password }) => {
    //check if user has given email or password or not for this make a login DTO

    //1. Check if user is there in the DB or not?

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw ApiError.notfound('User does not exist bro....')
    }

    //user exist -> Yes, now check the password

    // const checkPassword = await User.find({email}).select('+password');
    // console.log('Checkpassword is',checkPassword);

    // if (user.password !== password) {
    //     throw ApiError.unauthorized('Invalid Username or password');
    // }

    const isPasswordValid = await user.comparePassword(password); // this will return an boolean value.
    if(!isPasswordValid) throw ApiError.unauthorized('Invalid email or password');

    //now user exist in DB and password entered is also correct as well

    //1.create Tokens accessToken and refreshToken

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = hashedToken(refreshToken);

    //save in db 
    await user.save({ validateBeforeSave: false });
    const userObj = user.toObject();
    delete userObj.refreshToken
    delete userObj.password

    return {
        user: userObj,
        accessToken,
        refreshToken
    }
}

export const refresh = async ({ token }) => {
    // console.log('Token is',token,'Type of token is',typeof token);
    if (!token) throw ApiError.unauthorized('Refresh Token is missing');

    const decoded = verifyRefreshToken(token);
    console.log('Hey dec', decoded);
    const user = await User.findById(decoded.id).select('+refreshToken');
    console.log('Hey user is', user);
    if (!user) {
        throw ApiError.unauthorized('No user with this token is there');
    }

    if (user.refreshToken !== hashedToken(token)) throw ApiError.unauthorized('Invalid Refresh Token');

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = hashedToken(refreshToken);
    await user.save({ validateBeforeSave: true });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return {
        user: userObj,
        accessToken,
        refreshToken
    }
}

export const logout = async ({ userId }) => {
    const user = await User.findByIdAndUpdate(userId, {
        refreshToken: null
    })

    const userObj = user.toObject();
    delete userObj.password
    delete userObj.refreshToken

    return userObj;

}


export const verifyEmail = async (token) => {
    if (!token) throw ApiError.unauthorized('Bhai token to dai kaam sai kam');

    const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
    if (!user) throw ApiError.unauthorized('user does not exist');

    user.isVerified = true;
    user.verificationToken = null;
    await user.save({ validateBeforeSave: true });

    const userObj = user.toObject();
    delete userObj.verificationToken

    return userObj;

}

export const forgotPassword = async (email) => {
    if (!email) throw ApiError.unauthorized('Bhai email to dai kaam sai kam');

    const user = await User.findOne({ email });
    if (!user) throw ApiError.unauthorized('user does not exist');

    const { rawToken, hashedToken } = generateResetToken();
    console.log('RAW token is',rawToken);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;


    await user.save({ validateBeforeSave: false });

    //send email

    const userObj = user.toObject();
    delete userObj.resetPasswordToken;
    delete userObj.resetPasswordExpires;
    console.log('user object is',userObj);

    return {
        userObj,
        rawToken
    }
}

export const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) {
        throw ApiError.badRequest('Token and new password are required');
    }

    const hashResetPasswordToken = hashedToken(token);
    console.log('Hashed Token is',hashResetPasswordToken);

    const user = await User.findOne({ resetPasswordToken: hashResetPasswordToken,
         resetPasswordExpires: { $gt: new Date() } 
        }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) throw ApiError.unauthorized('user does not exist');

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Invalidate existing refresh token
    user.refreshToken = undefined;

    await user.save();

    return {
        message: 'reset password is complelted'
    }


}

export const getMe = async(userId) => {
    const user = await User.findById(userId);
    if(!user) throw ApiError.unauthorized('Not authrozid');
    return user;
}

export const handleUpload = async(userId, file) => {
    console.log('see',userId,file);
    try{
        const fileStream = fs.createReadStream(file.path);

    const uploadResponse = await imageKit.files.upload({
        file:fileStream,
        fileName:file.filename,
        folder:"/user-avatars"
    })

    await User.findByIdAndUpdate(
        userId,
        {
            avatar: uploadResponse.url
        },{
            new:true
        }
    );

    fs.unlinkSync(file.path);

    return{
        url:uploadResponse.url,
        fileId:uploadResponse.fileId
    }
    }
    catch(error){
        throw ApiError.badRequest('error in uploading the file');
    }
}