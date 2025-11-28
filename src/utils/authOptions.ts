import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const backendURL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }
                if (!backendURL) {
                    console.error("BACKEND_API_URL is not set in environment variables");
                    throw new Error("Server configuration error");
                }

                try {
                    console.log('Authorize: Sending login request...');

                    const response = await fetch(`${backendURL}/users/login`, {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        console.error("Authorize: Backend login failed", response.status);
                        throw new Error("Invalid credentials");
                    }

                    const data = await response.json();
                    console.log('Authorize: Backend response:', data);

                    const {accessToken, user} = data;

                    if (user && accessToken) {
                        return {
                            ...user,
                            id: user.id.toString(),
                            accessToken: accessToken,
                        };
                    }

                    console.error('Authorize: Login failed, user or token not received from backend.');
                    return null;
                } catch (error) {
                    console.error("Authorize: Login error:", error);
                    throw new Error(error instanceof Error ? error.message : "Invalid credentials");
                }
            },
        }),
    ],

    // useSecureCookies: false,
    // cookies: {
    //     sessionToken: {
    //         name: 'next-auth.session-token',
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: false,
    //         },
    //     },
    // },

    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email!;
                token.full_name = user.full_name;
                token.user_role = user.user_role;
                token.department = user.department;
                token.branch = user.branch;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({session, token}) {
            session.user = {
                // id: token.id,
                // email: token.email,
                // full_name: token.full_name,
                // user_role: token.user_role,
                // department: token.department,
                // branch: token.branch,
                // accessToken: token.accessToken,
                ...session.user,
                id: token.id,
                email: token.email,
                full_name: token.full_name,
                user_role: token.user_role,
                department: token.department,
                branch: token.branch,
                accessToken: token.accessToken,
            };
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 20 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};