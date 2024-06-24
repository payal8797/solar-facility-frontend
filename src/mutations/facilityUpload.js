// src/mutations/facilityUpload.js
import { gql } from '@apollo/client';

// Mutation to upload csv file
export const UPLOAD_FILE = gql`
  mutation UploadCSVFile($file: Upload!) {
    uploadCSVFile(file: $file)
  }
`;
