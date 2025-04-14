import {
  getAllEtudiants,
  getEtudiantById,
} from "../../../services/etudiantServices.js";
import { handleNotifications } from "../../../store/notificationStore.js";

document.addEventListener("DOMContentLoaded", async () => {
  handleNotifications();
  console.log(await getAllEtudiants());
  console.log(await getEtudiantById(1));
});
