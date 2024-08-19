import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import { usernameValidation } from "@/schemas/signUpSchema";

import { verifyCodeSchema } from "@/schemas/verifySchema";

import { z } from "zod";

const verifyCodeQuerySchema = z.object({
  code: verifyCodeSchema,
  username: usernameValidation,
});

export async function POST(request: Request) {
  await dbConnect();

  console.log("is here");

  try {
    const { code, username } = await request.json();

    console.log(code, username, "is here");

    const decodedUsername = decodeURIComponent(username);

    // const result = verifyCodeQuerySchema.safeParse({code ,username});

    // console.log(result)
    // if(result.error){
    //     console.error(result.error); // Log the errors
    //     return Response.json(
    //         {
    //             success : false,
    //             message: 'Provide valid verify Code'
    //         },{
    //             status : 404
    //         }
    //     )
    // }

    let user = await UserModel.findOne({ username:decodedUsername });

    console.log('here user data is ',user?.isVerified)
    
    if (!user) {
      return Response.json(
        {
            success: false,
          message: `User not found`,
        },
        {
            status: 401,
        }
    );
}

    console.log('here user data is ',user)

    const checkValidCode = user.verifyCode === code;

    const checkCodeExpiry =
      new Date(user?.verifyCodeExpiry) > new Date();


    if (checkValidCode && checkCodeExpiry) {
      
        user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: `User Account verified Successfully`,
        },
        {
          status: 200,
        }
      );
    }

    if(!checkValidCode){
        return Response.json(
            {
              success: false,
              message: `Please provide the valid code (Incorrect code )`,
            },
            {
              status: 401,
            }
          );
    }
    if(!checkCodeExpiry){
        return Response.json(
                    {
                        success : false,
                        message : `Your code expired | Please sign-up again `
                    },{
                        status : 401
                    }
        )
    }
    

    // const checkCodeExpiry = new Date(user?.verifyCodeExpiry as Date) >= new Date();
    // if(!checkCodeExpiry){
    //     return Response.json(
    //         {
    //             success : false,
    //             message : `Your code expired | Please sign-up again `
    //         },{
    //             status : 401
    //         }
    //     )
    // }



  } catch (error) {
    console.error(`Something went wrong in codeVerification time`, error);
    return Response.json(
      {
        success: false,
        message: `Error while verify verificationCode `,
      },
      {
        status: 500,
      }
    );
  }
}







