
import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

import { signUpSchema } from "@/schemas/signUpSchema";
import { z } from "zod";


const signUpVerificationQuerySchema = z.object({
     userData : signUpSchema
})

export async function POST (request:Request ){
    // firstly established a connection to the database
    await dbConnect()



    try {


        // const userData = await request.json()
        const { username, email, password } = await request.json()

        const userData = {username,email,password}

        const result = signUpVerificationQuerySchema.safeParse({userData})

        if(!result.success){
            return Response.json({
                success : false,
                message : `Please provide valid username,email,password `
            })
        }

        // if(!username || !email || !password){
        //     return Response.json({
        //         success : false,
        //         message : ` Please provider full credentials `
        //     },{status : 400})
        // }


        // checked for the username exists with verification if yes return error
        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username,
                isVerified : true,
            }
        )

        if( existingUserVerifiedByUsername ){
            return Response.json(
                {
                    success: false,
                    message: `username exist already | username is taken by someone else`,
                },
                {
                    status : 400
                }
            )
        }

        // VerifyCode
        const verifyCode = Math.floor(100000 + Math.random() * 100000).toString();
        
        // check the  email exist already if yes return response with error
        const existingUserByEmail = await UserModel.findOne({email})

        if( existingUserByEmail ){
            // true // TODO : Back here
            // check IsVerified if not then you can do verify that email,

            // if yes then return response with email already exist
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success : false,
                        message : "User already exists with this email"
                    },
                    {
                        status : 400
                    }
                )
            }else{
                const hashPassword = await bcrypt.hash(password,10)

                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 5min.

                await existingUserByEmail.save();

        
            }
        }else{
            // new user comes 
            const hashPassword = await bcrypt.hash(password,10)

            // here expiryDate of the otpVerify

            // const expiryDate = new Date()
            // expiryDate.setHours(expiryDate.getHours() *5*60*1000)   // means 5 minutes or 300 second


            const newUser = new UserModel({
                username,
                email,
                password : hashPassword,
                verifyCode,
             verifyCodeExpiry: new Date(Date.now() + 60 * 60 * 1000),
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            
            })
            await newUser.save();

        }

        // send verification Email 
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        console.log(`email response is this : `,emailResponse)
 
        if(!emailResponse.success){
 
            return Response.json({
                success : false,
                message: emailResponse.message
            },
            {
                status : 500
            }
            )
        }

        console.log(existingUserByEmail?.verifyCode);
        return Response.json({
            success : true,
            message: `User registered Successfully. Please verify your email`
        },
        {
            status : 201
        }
        )


    } catch (error) {
        console.error(`Error registering user`,error);

        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status : 500
            }
        )
        
    }
}