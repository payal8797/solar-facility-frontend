import { gql } from '@apollo/client';

// Mutation to register
export const REGISTER_USER =  gql`
        mutation Mutation(
            $registerInput: RegisterInput
        ){
            registerUser(
                registerInput: $registerInput
            ){
                email
                username
                token   
            }
        }
`
