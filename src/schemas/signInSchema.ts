import {z} from 'zod'


export const signInSchema = z.object({
    identifier : z.string(),
    password: z.string().length(6,{message:`Password must be atleast 6 character`}),


})