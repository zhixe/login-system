import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
    link: new HttpLink({
        uri: "http://localhost:4000/graphql", // Change to your backend GraphQL endpoint
        credentials: "include", // or "same-origin" or "omit" based on your auth setup
    }),
    cache: new InMemoryCache(),
});