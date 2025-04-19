import {
  listeProff,
  estVide,
  selectSpecialite,
  filtrerSpecialite,
  ouvrePopup,
  fermePopup,
  FormSubmit,
  afficherCheckboxClasses,
  archiverProff,
   modifierProfs,
   getCurrentAcademicYear,
   getProfessorCurrentClasses,
} from "../../../services/rpServiceProff.js";

import { sidebar, topbar } from "../../../services/rpService.js";
import { fetchData } from "../../../services/apiService.js";

import { handleNotifications } from "../../../store/notificationStore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const niveau = await fetchData("niveaux");
  const afficheFilter = document.getElementById("filtreSpecialite");
  sidebar();
  topbar();
  selectSpecialite();
  listeProff();
  afficherCheckboxClasses();
  archiverProff();
  getCurrentAcademicYear();
    let overlay = document.querySelector(".overlay");
  let popup = document.querySelector("#formPopup");

  const addBtn = document.getElementById("add");
  addBtn.addEventListener("click", () => ouvrePopup(overlay, popup));
  overlay.addEventListener("click", () => fermePopup(overlay, popup));

  // appel de form
  const form = document.getElementById("formClasse");
  form.addEventListener("submit", async (e) => {
    const isDone = await FormSubmit(e);
    if (isDone) {
      fermePopup(overlay, popup);
    }
  });

  // const modifierBtn = document.querySelectorAll(".edit-btn ");
  // modifierBtn.forEach(btn => {
  //   btn.addEventListener("click", async (e) => {
  //     // const id = e.target.closest("[data-id]").dataset.id;
  //     // editingId = id;
  //     alert("sdfghjklmiuytrez");
  //     // await modifierProfs(overlay, popup);
  //   });
  // });

  afficheFilter.addEventListener("change", async (e) => {
    console.log(e);

    filtrerSpecialite(e);
  });

//   const id = e.target.closest("[data-id]").dataset.id;
// const professorId = id; // Remplacez par l'ID du professeur concerné
// const classesDuProfesseur = getProfessorCurrentClasses(professorId);
// console.log(classesDuProfesseur);


});
