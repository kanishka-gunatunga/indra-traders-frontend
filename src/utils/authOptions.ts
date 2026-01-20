import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const backendURL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
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
                        headers: { "Content-Type": "application/json" },
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

                    const { accessToken, user } = data;

                    if (user && accessToken) {
                        return {
                            ...user,
                            id: user.id.toString(),
                            accessToken: accessToken,
                            system: 'admin'
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
        CredentialsProvider({
            id: 'service-booking',
            name: 'Service Booking',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
                branch: { label: 'Branch', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password || !credentials?.branch) {
                    throw new Error('Username, password and branch are required');
                }
                if (!backendURL) {
                    console.error("BACKEND_API_URL is not set in environment variables");
                    throw new Error("Server configuration error");
                }

                try {
                    const response = await fetch(`${backendURL}/service-booking/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                            branch_id: credentials.branch,
                        }),
                    });

                    // Check for network errors (no response received)
                    if (!response) {
                        throw new Error("NETWORK_ERROR");
                    }

                    // Check for connection errors (fetch failed)
                    if (response.status === 0 || response.type === 'error') {
                        throw new Error("NETWORK_ERROR");
                    }

                    if (!response.ok) {
                        // If backend is reachable but returns error, it's an auth issue
                        if (response.status >= 500) {
                            throw new Error("SERVER_ERROR");
                        }
                        throw new Error("INVALID_CREDENTIALS");
                    }

                    const data = await response.json();
                    const { accessToken, user } = data;

                    if (user && accessToken) {
                        return {
                            ...user,
                            id: user.id.toString(),
                            accessToken: accessToken,
                            branch: credentials.branch,
                            branchId: credentials.branch, // branch ID for API calls
                            branchName: user.branch || user.branch_name, // branch name from backend for display
                            system: 'service-booking'
                        };
                    }
                    return null;
                } catch (error) {
                    // Re-throw network/server errors with specific codes
                    if (error instanceof TypeError && error.message.includes('fetch')) {
                        throw new Error("NETWORK_ERROR");
                    }
                    if (error instanceof Error && error.message === "NETWORK_ERROR") {
                        throw error;
                    }
                    if (error instanceof Error && error.message === "SERVER_ERROR") {
                        throw error;
                    }
                    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
                        throw error;
                    }
                    // Default to invalid credentials for unknown errors
                    throw new Error("INVALID_CREDENTIALS");
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email!;
                token.full_name = user.full_name;
                token.user_role = user.user_role;
                token.department = user.department;
                token.branch = user.branch;
                token.branchId = user.branchId;
                token.branchName = user.branchName;
                token.accessToken = user.accessToken;
                token.system = user.system;
            }
            return token;
        },
        async session({ session, token }) {
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
                branchId: token.branchId,
                branchName: token.branchName,
                accessToken: token.accessToken,
                system: token.system,
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