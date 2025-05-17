import { usersTable, type UpdateUser } from "@/db";
import db from "@/lib/db.server";
import { eq } from "drizzle-orm";

function getAllUsers() {
  return db.query.usersTable.findMany();
}

function getUserById(id: string) {
  return db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

function getAllAccessRequests() {
  return db.query.requestAccessTable.findMany();
}

function getAllActivityLogs() {
  return db.query.userActivityTable.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          role: true,
          permission: true,
          createdAt: true,
          email: true,
          isOnline: true,
        },
      },
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
          replies: {
            orderBy: (replies, { desc }) => [desc(replies.createdAt)],
            with: {
              user: {
                columns: {
                  name: true,
                  image: true,
                },
              },
              comment: {
                with: {
                  user: {
                    columns: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: (activities, { desc }) => [desc(activities.createdAt)],
  });
}

function getActivityLogsById(id: string) {
  return db.query.userActivityTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          role: true,
          permission: true,
          createdAt: true,
          email: true,
          isOnline: true,
        },
      },
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
          replies: {
            orderBy: (replies, { desc }) => [desc(replies.createdAt)],
            with: {
              user: {
                columns: {
                  name: true,
                  image: true,
                },
              },
              comment: {
                with: {
                  user: {
                    columns: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: (activities, { desc }) => [desc(activities.createdAt)],
  });
}

function getActivityLogsByUserId(id: string) {
  return db.query.userActivityTable.findMany({
    where: (table, { eq }) => eq(table.userId, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
          role: true,
          permission: true,
          createdAt: true,
          email: true,
          isOnline: true,
        },
      },
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
          replies: {
            orderBy: (replies, { desc }) => [desc(replies.createdAt)],
            with: {
              user: {
                columns: {
                  name: true,
                  image: true,
                },
              },
              comment: {
                with: {
                  user: {
                    columns: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: (activities, { desc }) => [desc(activities.createdAt)],
  });
}

function getAllComments() {
  return db.query.userCommentTable.findMany({
    with: {
      user: {
        columns: {
          name: true,
          image: true,
        },
      },
      replies: true,
    },
  });
}

function updateUser(id: string, data: UpdateUser) {
  return db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, id))
    .returning();
}

function getUserByEmail(email: string) {
  return db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });
}

export const UserRepository = {
  getAllUsers,
  getAllActivityLogs,
  getActivityLogsById,
  getActivityLogsByUserId,
  getUserById,
  getAllAccessRequests,
  getAllComments,
  updateUser,
  getUserByEmail,
};
