import {z} from 'zod'


export const messagesSchema = z.object({
    content : z
    .string()
    .min(10,{message:`Content must be atleast 10 character`})
    .max(300,{message:`Content must be no longer than 300 character`})
     
    

})