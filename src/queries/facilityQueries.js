import { gql } from '@apollo/client';

// GraphQL query to fetch all facilities
export const GET_FACILITIES = gql`
  query GetFacilities {
    facilities {
      id
      name
      nominalPower
    }
  }
`;

// GraphQL query to fetch a single facility by its ID
export const GET_FACILITY = gql`
  query GetFacility($id: ID!) {
    facility(id: $id) {
      id
      name
      nominalPower
    }
  }
`;
