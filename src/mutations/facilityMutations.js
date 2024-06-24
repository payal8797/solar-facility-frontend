import { gql } from '@apollo/client';

// Mutation to create a new facility
export const CREATE_FACILITY = gql`
  mutation CreateFacility($name: String!, $nominalPower: Int!) {
    createFacility(name: $name, nominalPower: $nominalPower) {
      id
      name
      nominalPower
    }
  }
`;

// Mutation to update an existing facility
export const UPDATE_FACILITY = gql`
  mutation UpdateFacility($id: ID!, $name: String, $nominalPower: Int) {
    updateFacility(id: $id, name: $name, nominalPower: $nominalPower) {
      id
      name
      nominalPower
    }
  }
`;

// Mutation to delete a facility by ID
export const DELETE_FACILITY = gql`
  mutation DeleteFacility($id: ID!) {
    deleteFacility(id: $id) {
      id
      name
      nominalPower
    }
  }
`;
