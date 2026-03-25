import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60, },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Wrong password");

        if (user.status === "BANNED") throw new Error("User account is banned");
        if (user.status === "PENDING")
          throw new Error("User account is pending approval");
        if (user.status === "REJECTED")
          throw new Error("User account has been rejected");
        if (user.role === "USER")
          throw new Error("User does not have access");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      await connectDB();
      const dbUser = await User.findById(token.sub);
      if (dbUser){
        token.role = dbUser.role;
        token.status = dbUser.status;
        token.name = dbUser.name;
      }
      //if (user) token.role = user.role;

      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/login" },
  redirect: async (url, baseUrl) => {
    if (url === baseUrl || url.includes("/login")) {
      return Promise.resolve(baseUrl + "/dashboard");
    }
    return Promise.resolve(url);
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };