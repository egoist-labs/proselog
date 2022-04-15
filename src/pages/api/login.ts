import { setAuthCookie } from "$server/auth"
import { getJWT } from "$server/jwt"
import { prisma } from "$server/prisma"
import { nanoid } from "nanoid"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const token = req.query.token as string
  if (!token) return res.send("no token provided")

  const loginToken = await prisma.loginToken.findUnique({
    where: {
      id: token,
    },
  })

  if (!loginToken) {
    return res.send(`invalid token`)
  }

  if (loginToken.expiresAt < new Date()) {
    return res.send(`token expired`)
  }

  let user = await prisma.user.findUnique({
    where: {
      email: loginToken.email,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: loginToken.email,
        name: loginToken.email.split("@")[0],
        apiToken: `PK_${nanoid(30)}`,
        username: nanoid(7),
      },
    })
  }

  await prisma.loginToken.delete({
    where: {
      id: loginToken.id,
    },
  })

  const jwt = await getJWT({ userId: user.id })
  if (process.env.NODE_ENV === "development") {
    console.log("login with jwt", jwt)
  }
  setAuthCookie(res, jwt)

  res.redirect("/dashboard")
}

export default handler
