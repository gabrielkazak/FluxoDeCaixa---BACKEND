import prisma from '../database/prisma';

//Exemplos de métodos
export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (name: string, email: string) => {
  return await prisma.user.create({
    data: { name, email },
  });
};
