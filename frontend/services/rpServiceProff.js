// composant sidebar
import { fetchData } from "./apiService.js";

let currentPage = 1;
const itemsPerPage = 6;
// lste avec paginnation
export async function listeProff() {
    const profs = await fetchData("professeurs");
    const users = await fetchData("utilisateurs");
    const roles = await fetchData("roles");
    const container = document.getElementById("proff");
  
    container.innerHTML = "";
  
    // Récupérer uniquement les utilisateurs qui sont des professeurs (id_role == 2)
    const profUsers = users.filter((u) => u.id_role == "2");
  
    // pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = profUsers.slice(start, end);
  
    pageItems.forEach((user) => {
      const prof = profs.find((p) => p.id_utilisateur == user.id);
      
        if (prof && prof.statut.toLowerCase() !== "archiver") {
          // console.log(prof);
          
        container.innerHTML += `
          <div class="card bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">${user.prenom} ${user.nom}</h2>
              <div class="flex space-x-2 text-xl text-gray-500" data-id="${prof.id}">
                <i class="edit-btn ri-pencil-line cursor-pointer hover:text-pink-600"></i>
                <i class="ri-delete-bin-6-line cursor-pointer hover:text-red-500"></i>
              </div>
            </div>
            <p><span class="font-medium">Spécialité:</span> ${prof.specialite}</p>
            <p><span class="font-medium">Grade:</span> ${prof.grade}</p>
                <button data-id="${prof.id}" class="voir-classes-btn bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 w-fit self-end">
                  Voir classes
                </button>
          </div>
        `;
      }
    });

    let overlay = document.querySelector(".overlay");
    let popup = document.querySelector("#formPopup");
  
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.closest("[data-id]").dataset.id;
        editingId = id;
           await modifierProfs(overlay, popup);
      });
    });
  
    document.querySelectorAll('.voir-classes-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const profId = btn.dataset.id;
        console.log("profId:", profId);
        const classesDuProf = await getProfessorCurrentClasses(profId);
      });
    });
    
    renderPagination(profUsers.length); // pagination correcte
  }
  
// paginnation
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");

  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded ${
      i === currentPage ? "bg-pink-600 text-white" : "bg-gray-200"
    }`;
    btn.addEventListener("click", () => {
      currentPage = i;
      listeProff();
    });
    paginationContainer.appendChild(btn);
  }
}

// suppression
export function supprimerClass() {
  let idToDelete = null;

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("ri-delete-bin-6-line")) {
      // Récupère l'id de la classe (on suppose qu’il est stocké dans un attribut)
      const card = e.target.closest("div");
      idToDelete = card.dataset.id;
      document.getElementById("confirmPopup").classList.remove("hidden");
    }
  });

  // si NON
  document.getElementById("cancelDelete").addEventListener("click", () => {
    document.getElementById("confirmPopup").classList.add("hidden");
    idToDelete = null;
  });

  // Si OUI
  document.getElementById("confirmDelete") .addEventListener("click", async () => {
      if (!idToDelete) return;
      await fetch(`http://localhost:3000/classes/${idToDelete}`, {
        method: "DELETE",
      });
      idToDelete = null;
      document.getElementById("confirmPopup").classList.add("hidden");
      listeClasses();
    });
}

// Modifier
export async function modifierProfs(overlay,popup) {
  const professeurs = await fetchData("professeurs", editingId);
  const utilisateur = await fetchData("utilisateurs");
  const users = utilisateur.find(u =>u.id== professeurs.id_utilisateur);

  if (!utilisateur || !professeurs) return;

  // Remplir les champs du formulaire
  document.getElementById("nom").value = users.nom;
  document.getElementById("prenom").value = users.prenom;
  document.getElementById("email").value = users.email;
  document.getElementById("pass").value = users.password;
  document.getElementById("adresse").value = users.adresse;
  document.getElementById("telephone").value = users.telephone;
  document.getElementById("specialite").value = professeurs.specialite;
  document.getElementById("grade").value = professeurs.grade;

  // Cocher les classes associées
  const classes_professeur = await fetchData("classes_professeur");
  const classesAssociees = classes_professeur
    .filter(c => c.id_professeur == professeurs.id)
    .map(c => c.id_classe.toString());

  document.querySelectorAll('input[name="classes[]"]').forEach(cb => {
    cb.checked = classesAssociees.includes(cb.value);
  });

  
        submitBtn.innerText = "Modifier";
        ouvrePopup(overlay,popup);
  }

// archiver
export function archiverProff() {
    let idToArchive = null;
  
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("ri-delete-bin-6-line")) {
        const card = e.target.closest("div");
        idToArchive = card.dataset.id;
        document.getElementById("confirmPopup").classList.remove("hidden");
      }
    });
  
    document.getElementById("cancelDelete").addEventListener("click", () => {
      document.getElementById("confirmPopup").classList.add("hidden");
      idToArchive = null;
    });
  
    document.getElementById("confirmDelete").addEventListener("click", async () => {
      if (!idToArchive) return;
  
      await fetch(`http://localhost:3000/professeurs/${idToArchive}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ statut: "archiver" })
      });
  
      idToArchive = null;
      document.getElementById("confirmPopup").classList.add("hidden");
      listeClasses(); // Recharge les classes visibles
    });
  }
  
// selectionner niveau
export async function selectSpecialite() {
  const proff = await fetchData("professeurs");
  const specSelect = document.querySelector(".specialite");
    specSelect.innerHTML =    `<option value="">Sélectionnez une spécialité </option>` +
    proff
      .map((p) => `<option value="${p.specialite}">${p.specialite}</option>`)
      .join("");
  };
// selectionner filiere
export async function selectFiliere() {
  const filiere = await fetchData("filieres");
  const filiereSelect = document.querySelectorAll(".filiere");
  filiereSelect.forEach(fs => {
    fs.innerHTML =
    `<option value="">Sélectionnez une filière</option>` +
    filiere
      .map((f) => `<option value="${f.id_filiere}">${f.libelle}</option>`)
      .join("");
  });
}

//ouverture  popup formulaire
export async function ouvrePopup(overlay, popup) {
  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");
}

//fermeture  popup formulaire
export async function fermePopup(overlay, popup) {
  overlay.classList.add("hidden");
  popup.classList.add("hidden");
}

// généré id
export async function genererId(classes) {
  //   const classes = await fetchData("classes");
  if (!classes || classes.length === 0) return 1;

  const ids = classes.map((c) => Number(c.id));
  const maxId = Math.max(...ids);
  return maxId + 1;
}

// pour l'ajout
let editingId = null;
const submitBtn = document.getElementById("submitBtn");
export async function FormSubmit(e) {
  e.preventDefault();

  // recupérer les classes sélectionnés
  const checkedBoxes = document.querySelectorAll('input[name="classes[]"]:checked');
  const classesSelectionnees = Array.from(checkedBoxes).map(cb => cb.value);

  if (classesSelectionnees.length == 0) {
    document.getElementById("classesError").textContent = "Veuillez sélectionner au moins une classe.";
    return;
  }

  const nom = document.getElementById("nom").value.trim();
  const email = document.getElementById("email").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const password = document.getElementById("pass").value.trim();
  const specialite = document.getElementById("specialite").value.trim();
  const grade = document.getElementById("grade").value.trim();
  const telephone = document.getElementById("telephone").value.trim();
  const adresse = document.getElementById("adresse").value.trim();

  // Réinitialisation des messages d'erreur
  document.getElementById("emailError").textContent = "";

  let isValid = true;

  isValid = estVide(nom, "nom") && isValid;
  isValid = estVide(prenom, "prenom") && isValid;
  isValid = estVide(email, "email") && isValid;
  isValid = estVide(password, "pass") && isValid;
  isValid = estVide(specialite, "specialite") && isValid;
  isValid = estVide(grade, "grade") && isValid;
  isValid = estVide(adresse, "adresse") && isValid;
  isValid = estVide(telephone, "telephone") && isValid;

  const utilisateurs = await fetchData("utilisateurs");
  const existe = utilisateurs.some(u => u.email.toLowerCase() === email.toLowerCase());

  if (existe && !editingId) {
    document.getElementById("emailError").textContent = "Ce mail existe déjà.";
    isValid = false;
  }

  if (!isValid) return false;

  const utilisateur = {
    nom,
    prenom,
    email,
    password,
    id_role: 2,
    telephone,
    adresse
  };
  console.log(utilisateur);

  if (editingId) {
    utilisateur.id = editingId;
  
    // MAJ utilisateur
    await fetch(`http://localhost:3000/utilisateurs/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(utilisateur),
    });
  
    // MAJ professeur
    const professeurs = await fetchData("professeurs");
    const prof = professeurs.find(p => p.id_utilisateur == editingId);
    if (prof) {
      const dataProf = {
        ...prof,
        specialite,
        grade
      };
  
      await fetch(`http://localhost:3000/professeurs/${prof.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataProf),
      });
  
      // Supprimer anciennes classes associées
      const classes_prof = await fetchData("classes_professeur");
      const liers = classes_prof.filter(c => c.id_professeur === prof.id);
      for (const liaison of liers) {
        await fetch(`http://localhost:3000/classes_professeur/${liaison.id}`, {
          method: "DELETE"
        });
      }
  
      // Réassocier les nouvelles classes
      for (let id_classe of classesSelectionnees) {
        const classes_professeur = await fetchData("classes_professeur");
        const newLiaison = {
          id: (await genererId(classes_professeur)).toString(),
          id_classe,
          id_professeur: prof.id,
          date_affectation: new Date().toISOString().split('T')[0],
          est_principal: 0
        };
  
        await fetch("http://localhost:3000/classes_professeur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLiaison)
        });
      }
    }
  
    editingId = null;
    submitBtn.innerText = "Valider";
  }   else {
    console.log(utilisateurs);
    utilisateur.id = (await genererId(utilisateurs)).toString();
    

    await fetch("http://localhost:3000/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(utilisateur),
    });

    const professeurs = await fetchData("professeurs");
    const data = {
      id_utilisateur: utilisateur.id,
      specialite,
      grade,
      date_embauche: new Date().toISOString().split('T')[0]
    };
    data.id= (await genererId(professeurs)).toString();

  
    

   const resProf= await fetch("http://localhost:3000/professeurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    //const id_professeur = data.id;
   
    const dataClassprof = {
      //id: (await genererId(classes_professeur)).toString(),
      id_professeur:data.id,
      date_affectation: new Date().toISOString().split('T')[0],
      est_principal: 0
    };
  
    // Étape 5 : Lier chaque classe sélectionnée au professeur
    for (let id_classe of classesSelectionnees) {
      const classes_professeur=await fetchData("classes_professeur");
      console.log(id_classe);
      dataClassprof.id_classe = id_classe;
      dataClassprof.id =  (await genererId(classes_professeur)).toString();
      console.log(dataClassprof);
      await fetch("http://localhost:3000/classes_professeur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataClassprof)
      });
      }
  }

  //form.reset();
  //listeProff();
  //afficherCheckboxClasses();
  // alert('ajoter avec succes')
  return true;
}

// champs vides
export function estVide(valeur, champId) {
    const champError = document.getElementById(`${champId}Error`);
    if (!valeur) {
      champError.textContent = "Champ requis*";
      return false;
    } else {
      champError.textContent = "";
      return true;
    }
  }
  

//   filtrer par specialite
export async function filtrerSpecialite(e) {
    const specialiteChoisie = e.target.value.toLowerCase(); 
    const utilisateurs = await fetchData("utilisateurs");
    const profs = await fetchData("professeurs");
  
    const profUsers = utilisateurs
      .map((user) => {
        const prof = profs.find((p) => p.id_utilisateur == user.id);
        if (!prof) return null;
  
        return {
          ...user,
          specialite: prof.specialite,
          grade: prof.grade,
          id_prof: prof.id, // au cas où tu veux l'utiliser
        };
      })
      .filter((user) => {
        if (!user) return false;
        return specialiteChoisie
          ? user.specialite.toLowerCase() === specialiteChoisie
          : true;
      });
  
    listeProfFilter(profUsers);     
    }
// liste proff filtre
export async function listeProfFilter(profss) {
    const container=document.getElementById("proff")
    //const users=await fetchData("utilisateurs");
  
    container.innerHTML = "";
    
  
  
    // pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = profss.slice(start, end);
    
  
    pageItems.forEach((user) => {
      const prof = profss;
  
      if (prof) {
        container.innerHTML += `
          <div class="card bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">${user.prenom} ${user.nom}</h2>
              <div class="flex space-x-2 text-xl text-gray-500" data-id="${prof.id}">
                <i class="edit-btn ri-pencil-line cursor-pointer hover:text-pink-600"></i>
                <i class="ri-delete-bin-6-line cursor-pointer hover:text-red-500"></i>
              </div>
            </div>
            <p><span class="font-medium">Spécialité:</span> ${user.specialite}</p>
            <p><span class="font-medium">Grade:</span> ${user.grade}</p>
          </div>
        `;
      }
    });
    //console.log(prof);

    renderPagination(profss.length); // pagination correcte
  }

  // checkbox  classe
export  async function afficherCheckboxClasses() {
    const classes = await fetchData("classes");
  
    const selectcheckbox = document.getElementById("checkboxClasses");
    selectcheckbox.innerHTML = ""; // Nettoyer si rechargé
  
    classes
      .filter(c => c.statut === "en_cours")
      .forEach(c => {
        const checkbox = document.createElement("div");
        checkbox.innerHTML = `
          <label class="flex items-center space-x-2">
            <input type="checkbox" name="classes[]" value="${c.id}" class="form-checkbox text-pink-600">
            <span>${c.libelle}</span>
          </label>
        `;
        selectcheckbox.appendChild(checkbox);
      });
  }
 
  // lister classes prof
// Fonction pour obtenir l'année scolaire actuelle
export function getCurrentAcademicYear() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // Janvier est 0
  return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

// Fonction pour lister les classes d'un professeur pour l'année scolaire en cours
export async function getProfessorCurrentClasses(professorId) {
  const currentAcademicYear = getCurrentAcademicYear();
  const classes_professeur=await fetchData("classes_professeur");
  const inscriptions=await fetchData("inscriptions");
  const classes=await fetchData("classes");


  // Filtrer les affectations du professeur
  const professorAssignments = classes_professeur.filter(
    (cp) => cp.id_professeur == professorId
  );

  // Filtrer les inscriptions de l'année scolaire actuelle
  const currentYearEnrollments = inscriptions.filter(
    (insc) => insc.annee_scolaire === currentAcademicYear
  );

  // Identifier les id_classe des inscriptions de l'année scolaire actuelle
  const currentYearClassIds = new Set(
    currentYearEnrollments.map((insc) => insc.id_classe)
  );

  // Identifier les id_classe des affectations du professeur
  const professorClassIds = new Set(
    professorAssignments.map((cp) => cp.id_classe)
  );

  // Intersection des classes entre les affectations du professeur et les inscriptions de l'année scolaire actuelle
  const relevantClassIds = [...professorClassIds].filter((id) =>
    currentYearClassIds.has(id)
  );

  // Lister les classes correspondantes avec statut "en_cours"
  const relevantClasses = classes.filter(
    (cls) => relevantClassIds.includes(cls.id) && cls.statut === "en_cours"
  );

  return relevantClasses;
}

// Exemple d'utilisation :
// const id = e.target.closest("[data-id]").dataset.id;
// const professorId = id; // Remplacez par l'ID du professeur concerné
// const classesDuProfesseur = getProfessorCurrentClasses(professorId);
// console.log(classesDuProfesseur);

// popup voir classes
// export async function voirClasses(params) {
  
// }
  // const profs = await fetchData("professeurs");
  //   const users = await fetchData("utilisateurs");
  //   const roles = await fetchData("roles");
  //   const container = document.getElementById("proff");
  
  //   container.innerHTML = "";
  
  //   // Récupérer uniquement les utilisateurs qui sont des professeurs (id_role == 2)
  //   const profUsers = users.filter((u) => u.id_role == "2");
  
  //   // pagination
  //   const start = (currentPage - 1) * itemsPerPage;
  //   const end = start + itemsPerPage;
  //   const pageItems = profUsers.slice(start, end);
  
  //   pageItems.forEach((user) => {
  //     const prof = profs.find((p) => p.id_utilisateur == user.id);
      
  //       if (prof && prof.statut.toLowerCase() !== "archiver") {
  //         console.log(prof);
          
  //       container.innerHTML += `
  //         <div class="card bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2">
  //           <div class="flex justify-between items-center">
  //             <h2 class="text-lg font-semibold">${user.prenom} ${user.nom}</h2>
  //             <div class="flex space-x-2 text-xl text-gray-500" data-id="${prof.id}">
  //               <i class="edit-btn ri-pencil-line cursor-pointer hover:text-pink-600"></i>
  //               <i class="ri-delete-bin-6-line cursor-pointer hover:text-red-500"></i>
  //             </div>
  //           </div>
  //           <p><span class="font-medium">Spécialité:</span> ${prof.specialite}</p>
  //           <p><span class="font-medium">Grade:</span> ${prof.grade}</p>
  //               <button data-id="${prof.id}" class="voir-classes-btn bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 w-fit self-end">
  //                 Voir classes
  //               </button>
  //         </div>
  //       `;
  //     }
  //   });
  
  
