import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import {Message} from '@/model/User' 
import { findConfigFile } from "typescript";

export async function POST(request : Request){

    await dbConnect()

    const { username , content } = await request.json()

    try {
        
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success : false,
                    message : 'username not found'
                },
                {
                    status : 401
                }
            )
        }

        // check username is accepting messages or not.
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success : false,
                    message : 'username not accepting messages'
                },
                {
                    status : 401
                }
            )
        }

        const newMessage = { content, createdAt :  new Date()}
        
        user.messages.push(newMessage as Message)

        await user.save();

        return Response.json(
            {
                success : true,
                message : 'message sent successfully'
            },
            {
                status : 200
            }
        )

    } catch (error) {
        console.log(`Error adding messages`,error)
        return Response.json(
            {
                success : false,
                message : 'failed to send the messages | internal server error'
            },
            {
                status : 500
            }
        )
    }




}



