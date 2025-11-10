import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event);

  if (!token) {
    throw createError({ statusCode: 400, message: "No token was passed" });
  }

  const user = jwt.verify(token, process.env.JWT_PRIVATE!) as JwtUserInfo;
  if (user) {
    return {
      success: true, user: {
        user
      },
    };
  }
});
