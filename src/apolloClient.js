import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import {setContext} from '@apollo/client/link/context';

// Create HTTP link to GraphQL server
const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql"
});

// Set up authentication context link
const authLink = setContext((_, {header}) =>{
    const token = localStorage.getItem('token');
    
    return {
        headers: {
            ...header,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

// Create Apollo Client instance
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default client;