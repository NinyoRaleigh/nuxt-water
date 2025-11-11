import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { db } from "~~/server/utils/db"; // ✅ import your actual db connection
import { register } from "~~/server/database/schemas";
import jwt from "jsonwebtoken";

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

  const token = jwt.sign({id: foundUser.id , username: foundUser.username}, process.env.JWT_PRIVATE!, {
    algorithm: 'HS256',
    expiresIn: '10s'
  })

  // ✅ Return successful login
  return { token };
});
