import { hash } from "bcrypt-ts";
import { db } from "~~/server/utils/db"; // use your db.ts connection
import { register } from "~~/server/database/schemas";

export default defineEventHandler (async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!(username && password)) {
        throw createError({ statusCode: 400, message: 'username and password must be provided in data body'});
    }

    const hashedPassword = await hash(password, 8);

    await db.insert(register).values({
        username : username,
        password : hashedPassword
    });

    console.log(body);
});