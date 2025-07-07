import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.WORDPRESS_API_URL as string;

const graphqlClient = new GraphQLClient(endpoint);

export default graphqlClient;
