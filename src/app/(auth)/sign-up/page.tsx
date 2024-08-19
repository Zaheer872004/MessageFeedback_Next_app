'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import * as z from 'zod'
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const Page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500);
    // const debouncedUsername = useDebounceValue(username, 500);

    const { toast } = useToast();
    const router = useRouter();

    // Zod implementation schema checking
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    // API call to check if the username is valid or not
    useEffect(() => {
        const checkUsernameUniqueness = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
                    if (response) {
                        console.log(response);
                        // setUsernameMessage(response.data.message);
                        // if above not work then do below things
                        let msg = response.data.message
                        setUsernameMessage(msg);
                        
                    }
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUniqueness();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            console.log(data);

            // API call
            const response = await axios.post<ApiResponse>(`/api/sign-up`, data);

            // Validation check
            if (response.data.message !== 'User registered Successfully') {
                toast({
                    title: 'Signup failed',
                    description: response.data.message,
                    variant: 'destructive',
                });
            }

            console.log(response);

            // Toast success
            toast({
                title: 'Success',
                description: response.data.message,
            });

            // Redirect to the verify page
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
             setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-400 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-extrabold tracking-tight text-center lg:text-5xl mb-6">
                    Join Feedback Application
                </h1>
                <p className="mb-4 text-center">Sign up to start your feedback messages</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>

                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                        {usernameMessage}
                                    </p>
                                    <FormDescription>
                                        You Entered Username.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You Entered Email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You Entered Password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : ('Sign Up')}
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p>
                        Already a member?{' '}
                        <Link href={'/sign-in'} className="text-blue-500 hover:text-blue-800">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page;
