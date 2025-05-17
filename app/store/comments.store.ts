import type { Comment } from "@/lib/types";
import { create } from "zustand";

type CommentStore = {
  comments: Comment[];
  addComment: (comment: Comment) => void;
  setComments: (comments: Comment[]) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
}));
