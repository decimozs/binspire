import argon2 from "argon2";

const hash = async (text: string) => {
  return await argon2.hash(text);
};

const test = await hash("admin12345");
