import { lucia } from "lucia";
import { github } from "@lucia-auth/oauth/providers";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { h3 } from "lucia/middleware";
import { createClient } from "@libsql/client";
// import "lucia/polyfill/node";


const db = createClient({
	url: 'http://127.0.0.1:8080'
});


export const auth = lucia({
	adapter: libsql(db, {
		user: "user",
		session: "user_session",
		key: "user_key"
	}),
	middleware: h3(),
	env: process.dev ? "DEV" : "PROD",
	getUserAttributes: (data) => {
		return {
			githubUsername: data.github_username
		};
	}
});

const runtimeConfig = useRuntimeConfig();

export const githubAuth = github(auth, {
	clientId: runtimeConfig.githubClientId,
	clientSecret: runtimeConfig.githubClientSecret
});

export type Auth = typeof auth;
