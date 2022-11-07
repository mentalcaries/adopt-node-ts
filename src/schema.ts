import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLContext } from './context';
import { prisma } from './db';
import typeDefs from './schema.graphql';

type Pet = {
  id: number;
  name: string;
  age: number;
  type: string;
  gender: 'male' | 'female';
  breed?: string;
  location: string;
  photo: string;
  shelter: string;
  neutered?: boolean;
  vaccinated?: boolean;
};

const resolvers = {
  Query: {
    allPets: async (parent: unknown, args: {}, context: GraphQLContext) => {
      return prisma.pet.findMany();
    },

    petsByLocation: async (
      parent: unknown,
      args: { location: string },
      context: GraphQLContext
    ) => {
      const results = await prisma.pet.findMany({
        where: { location: { contains: args.location } },
      });
      return results;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
