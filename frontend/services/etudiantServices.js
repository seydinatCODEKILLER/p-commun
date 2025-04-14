import { fetchData } from "./apiService.js";

export async function getAllEtudiants() {
  try {
    const etudiants = await fetchData("etudiants");
    return etudiants;
  } catch (error) {
    console.log(error);
  }
}

export async function getEtudiantById(id) {
  try {
    const etudiants = await fetchData("etudiants");
    const validEtudiants = etudiants.find((u) => u.id_etudiant == id);
    return validEtudiants;
  } catch (error) {
    console.log(error);
  }
}
