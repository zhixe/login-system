import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
    link: new HttpLink({
        uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});