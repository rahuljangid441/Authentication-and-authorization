import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        minlength:2,
        maxlength:16,
        required:[true, 'Name is required']
    },
    email:{
        type:String,
        trim:true,
        minlength:8,
        maxlength:325,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        minlength:8,
        maxlength:16,
        required:[true,'Password is required'],
        select:false
    },

    role:{
        type:String,
        enum:['Customer','Seller','Admin'],
        default:'Customer'
    },
    isVerified:{
        type:Boolean,
        default:false
    },

    avatar:{
        type:String,
        default:false
    },
    verificationToken:{
        type:String,
        select:false
    },
     refreshToken : {
        type:String,
        select:false
    },
     resetPasswordToken : {
        type:String,
        select:false
    },
    resetPasswordExpires : {
        type: Date, 
        select:false
    }

},{
    timestamps:true
});

userSchema.pre('save', async function(){
     if (!this.isModified("password")) return;
     this.password = await bcrypt.hash(this.password,12);
});

userSchema.methods.comparePassword = async function(clearTextPassword){
    return bcrypt.compare(clearTextPassword,this.password)
}
export default mongoose.model("User",userSchema);