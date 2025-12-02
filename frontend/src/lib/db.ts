// lib/db.ts
import { PrismaClient } from "@/../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for NextAuth
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function createUser(email: string, name: string, password: string) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Project-related functions
export async function getProjectsByUserId(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        responses: true,
      },
    });
    return projects;
  } catch (error) {
    console.error('Error getting projects by user ID:', error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        responses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return project;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
}

export async function createProject(userId: string, title: string, description?: string) {
  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId,
        status: 'IN_PROGRESS',
      },
    });
    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

export async function deleteProject(id: string) {
  try {
    const project = await prisma.project.delete({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.error('Error deleting project:', error);
    return null;
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const project = await prisma.project.update({
      where: {
        id,
      },
      data,
    });
    return project;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

// Session functions
export async function getSessionBySessionToken(sessionToken: string) {
  try {
    const session = await prisma.session.findUnique({
      where: {
        sessionToken,
      },
      include: {
        user: true,
      },
    });
    return session;
  } catch (error) {
    console.error('Error getting session by session token:', error);
    return null;
  }
}

export async function createSession(userId: string, sessionToken: string, expires: Date) {
  try {
    const session = await prisma.session.create({
      data: {
        userId,
        sessionToken,
        expires,
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
}

export async function updateSession(sessionToken: string, data: any) {
  try {
    const session = await prisma.session.update({
      where: { sessionToken },
      data,
    });
    return session;
  } catch (error) {
    console.error('Error updating session:', error);
    return null;
  }
}

export async function deleteSession(sessionToken: string) {
  try {
    await prisma.session.delete({
      where: { sessionToken },
    });
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
}

// Account functions (for OAuth)
export async function getAccountByProviderAccountId(provider: string, providerAccountId: string) {
  try {
    const account = await prisma.account.findFirst({
      where: {
        provider,
        providerAccountId,
      },
    });
    return account;
  } catch (error) {
    console.error('Error getting account by provider account ID:', error);
    return null;
  }
}

export async function createAccount(data: any) {
  try {
    const account = await prisma.account.create({
      data,
    });
    return account;
  } catch (error) {
    console.error('Error creating account:', error);
    return null;
  }
}

// Verification token functions
export async function getVerificationToken(identifier: string) {
  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier,
      },
    });
    return token;
  } catch (error) {
    console.error('Error getting verification token:', error);
    return null;
  }
}

export async function createVerificationToken(identifier: string, token: string, expires: Date) {
  try {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    });
    return verificationToken;
  } catch (error) {
    console.error('Error creating verification token:', error);
    return null;
  }
}

export async function deleteVerificationToken(token: string) {
  try {
    await prisma.verificationToken.delete({
      where: { token },
    });
    return true;
  } catch (error) {
    console.error('Error deleting verification token:', error);
    return false;
  }
}

// Agent Response functions
export async function createAgentResponse(projectId: string, agentType: string, content: any) {
  try {
    const response = await prisma.agentResponse.create({
      data: {
        projectId,
        agentType: agentType as any, // Cast to Enum
        content,
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating agent response:', error);
    return null;
  }
}