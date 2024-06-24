import { gql } from '@apollo/client';

// Mutation to login
export const LOGIN_USER =  gql`
    mutation Mutation(
        $loginInput: LoginInput
    ){
        loginUser(
            loginInput: $loginInput
        ){
            email
            username
            token   
        }
    }
`
