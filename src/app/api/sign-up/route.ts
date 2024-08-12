


import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (request:Request ){
    // firstly established a connection to the database
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

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

        const existingUserByEmail = await UserModel.findOne({email})

        // VerifyCode
        const verifyCode = Math.floor(100000 + Math.random() * 100000).toString();


        if( existingUserByEmail ){
            // true // TODO : Back here
            // check IsVerified if not then you can do verify that email,
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
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() * 5 * 60 * 1000);

                await existingUserByEmail.save();

        
            }
        }else{
            // new user comes 
            const hashPassword = await bcrypt.hash(password,10)

            // here expiryDate of the otpVerify
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() *5*60*1000)   // means 5 minutes or 300 second


            const newUser = new UserModel({
                username,
                email,
                password : hashPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            
            })
            await newUser.save();

        }

        // send verification Email 
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

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