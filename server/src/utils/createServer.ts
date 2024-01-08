import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { CORS_ORIGIN } from "../constants";
import jwt from "@fastify/jwt";
import path from "path";
import fs from "fs";
import cookie from "@fastify/cookie";
import userRoutes from "../modules/user/user.route";
import vaultRoutes from "../modules/vault/vault.route";

function createServer() {
  const app = fastify();

  app.register(cors, { origin: CORS_ORIGIN, credentials: true });

  app.register(jwt, {
    secret: {
      private: fs.readFileSync(
        `${(path.join(process.cwd()), "certs")}/private.key`
      ),
      public: fs.readFileSync(
        `${(path.join(process.cwd()), "certs")}/public.key`
      ),
    },
    sign: { algorithm: "RS256" },
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  app.register(cookie, {
    parseOptions: {},
  });

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await request.jwtVerify<{ _id: string }>();
        request.user = user;
      } catch (err) {
        return reply.send(err);
      }
    }
  );

  app.register(userRoutes, { prefix: "/api/users" });
  app.register(vaultRoutes, { prefix: "/api/vaults" });
  return app;
}

export default createServer;