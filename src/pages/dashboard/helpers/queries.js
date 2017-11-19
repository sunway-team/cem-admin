import { gql } from 'react-apollo';

export const ME_QUERY = gql`
  query Me {
    me {
      id
    }
  }
`;

export const GET_ALL_CONFERENCES_BY_USER_ID_QUERY = gql`
  query getConferenceByUserID($user_id: ID!) {
    getConferenceByUserID(user_id: $user_id) {
      id
      title
      description
      start_date
      end_date
      bg_image
      address {
        id
        city
      }
      organizerDetail {
        id
        name
        email
        address
        website
        phone
        user {
          id
          lastname
        }
      }
    }
  }
`;

export default {
  ME_QUERY,
  GET_ALL_CONFERENCES_BY_USER_ID_QUERY,
};