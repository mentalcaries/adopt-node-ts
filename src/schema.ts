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

let pets: Pet[] = [
  {
    id: 1,
    name: 'Ruff',
    age: 1,
    type: 'dog',
    gender: 'male',
    location: 'Penal, Trinidad',
    breed: 'ratter',
    shelter: 'Animal House',
    photo:
      'https://www.akc.org/wp-content/uploads/2017/04/Lagotto-Romangolo-Tongue-Out.jpg',
    vaccinated: true,
    neutered: false,
  },
  {
    id: 2,
    name: 'Marco',
    age: 1,
    type: 'dog',
    gender: 'female',
    location: 'Penal, Trinidad',
    breed: 'German Sheppy',
    shelter: 'Animal House',
    photo:
      'http://cdn.akc.org/content/article-body-image/keeshond_dog_pictures.jpg',
  },
];

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
