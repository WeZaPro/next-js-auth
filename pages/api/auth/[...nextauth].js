import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// karn.yong@mecallapi.com
// mecallapi

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "next-js-auth",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("credentials--> ", credentials);
        const res = await fetch(
          "https://mern-api-yp9k.onrender.com/api/signin",
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("res--> ", res);

        const data = await res.json();
        console.log("data--> ", data);
        console.log("status--> ", data.success);
        console.log("token--> ", data.token);
        if (data.success == true) {
          //   return data.token;
          return {
            email: credentials.email, // mockup data
            status: data.success,
            token: data.token,
            image: "https://www.pngmart.com/files/3/Man-PNG-Pic.png", // mockup data
          };
        }
        return null;
      },
    }),
  ],
  secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
});
