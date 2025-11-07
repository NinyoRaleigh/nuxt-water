import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { db } from "~~/server/utils/db"; // ✅ import your actual db connection
import { register } from "~~/server/database/schemas";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username and password must be provided in the request body",
    });
  }

  const user = await db
    .select()
    .from(register)
    .where(eq(register.username, username))
    .limit(1);
    

    const foundUser = user[0];
      if (!foundUser) {
        throw createError({ statusCode: 404, message: 'User not found'});
    }


  if (!(await compare(password, foundUser.password))){
    throw createError({ statusCode: 401, message: 'Invalid credentials'});
}

  // ✅ Return successful login
  return { message: "Login successful", username: user[0].username };
});
