import { fetchData } from "./apiService.js";

export async function login(email, password) {
  const users = await fetchData("utilisateurs");
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  return user;
}
