import { fruitsTable, users } from "../database/schemas"

export default defineEventHandler(async(event) =>{

    const body = await readBody(event)

    //save to db
   await db.insert(fruitsTable).values(body)

    console.log(body)

    return {message : "success"}

})