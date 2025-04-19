// composant sidebar
import { fetchData } from "./apiService.js";
export function sidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `
            <img src="../../assets/images/image.png" class="w-24 h-24 rounded place-self-center" alt="" srcset="">
            <nav class="space-y-4">
                <a href="dashboard.html" class="sidebar-link flex items-center space-x-2 hover:text-gray-200" data-page="dashboard">
                <i class="ri-dashboard-line text-xl"></i>
                <span>Tableau de bord</span>
                </a>
                <a href="classe.html" class="sidebar-link flex items-center space-x-2 hover:text-gray-200" data-page="classe">
                <i class="ri-building-2-line text-xl"></i>
                <span>Liste des classes</span>
                </a>
                <a href="proff.html" class="sidebar-link flex items-center space-x-2 hover:text-gray-200" data-page="proff">
                <i class="ri-user-add-line text-xl"></i>
                <span>Professeur</span>
                </a>
                <a href="cours.html" class="sidebar-link flex items-center space-x-2 hover:text-gray-200" data-page="cours">
                <i class="ri-calendar-event-line text-xl"></i>
                <span>Cours planifiés</span>
                </a>
            </nav>
            <button class="text-white hover:text-gray-200 flex items-center space-x-2 mt-6">
                <i class="ri-logout-box-r-line text-xl"></i>
                <span>Déconnexion</span>
            </button>
`;
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");
  const links = sidebar.querySelectorAll(".sidebar-link");

  links.forEach((link) => {
    const page = link.getAttribute("data-page");
    if (page === currentPage) {
      link.classList.add("text-pink-500", "font-semibold"); // active style
    }
  });
}

// composant top-bar
export function topbar() {
  const topbar = document.querySelector("#topbar");
  topbar.innerHTML = `
                    <h1 class="text-xl font-semibold">Tableau de Bord RP</h1>
                <div class="flex items-center space-x-4">
                    <!-- <div class="relative">
            <input type="text" placeholder="Rechercher..." class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div> -->
                    <div class="flex items-center space-x-2">
                        <i class="ri-user-3-line text-pink-600 text-xl"></i>
                        <div class="text-sm">
                            <p class="font-semibold">Fatou Ndiaye</p>
                            <p class="text-gray-500">Responsable Pédagogique</p>
                        </div>
                    </div>
                </div>
`;
}
// courbe des cours par proffesseur
export async function courbeCoursParProfs() {
  const professeurs = await fetchData("professeurs");
  const cours = await fetchData("cours");
  const utilisateurs = await fetchData("utilisateurs");
  // Regrouper le nombre de cours par professeur
  const dataParProf = professeurs  .filter(prof => prof.statut.toLowerCase() !== "archiver")
  .map((prof) => {
    
    const totalCours = cours.filter(
      (c) => c.id_professeur == prof.id
    ).length;
    const nomUser = utilisateurs.find(
      (u) => u.id == prof.id_utilisateur
    );
    return {
      nom: nomUser ? nomUser.nom : "Inconnu",
      total: totalCours,
    };
  });

  // Extraire noms et totaux pour la courbe
  const labels = dataParProf.map((p) => p.nom);
  const data = dataParProf.map((p) => p.total);

  const profCtx = document.getElementById("profChart");
  new Chart(profCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nombre de cours",
          data: data,
          backgroundColor: "rgba(236, 72, 153, 0.7)",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, // 🔥 Affiche uniquement des entiers
            callback: function (value) {
              if (Number.isInteger(value)) {
                return value;
              }
            },
          },
        },
      },
    },
  });
}

// courbes des cours par classe
export async function courbeCoursParClasse() {
  const classes = await fetchData("classes");
  const coursClasses = await fetchData("cours_classes");

  const dataParClasse =classes .filter(classe => classe.statut.toLowerCase() !== "archiver")
   .map((classe) => {
    const totalCours = coursClasses.filter(
      (cc) => cc.id_classe == classe.id
    ).length;
    return {
      libelle: classe.libelle,
      total: totalCours,
    };
  });

  const labels = dataParClasse.map((c) => c.libelle);
  const data = dataParClasse.map((c) => c.total);
  const classCtx = document.getElementById("classChart");
  new Chart(classCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Nombre de cours",
          data: data,
          backgroundColor: "rgba(244, 114, 182, 0.7)",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: function (value) {
              if (Number.isInteger(value)) {
                return value;
              }
            },
          },
        },
      },
    },
  });
}

// le nombre de classe
export async function classeTotal() {
  const classe = await fetchData("classes");
  const total=classe.filter(c=>c.statut.toLowerCase()!=="archiver").length
//   const total = classe.length;
  const totalClass = document.querySelector("#total_classe");
  totalClass.textContent = total;
}

// le nombre de proff
export async function ProfTotal() {
  const proff = await fetchData("professeurs");
  const total = proff.filter(p => p.statut.toLowerCase() !== "archiver").length;
  const totalProf = document.querySelector("#total_proff");
  totalProf.textContent = total;
}

let currentPage = 1;
const itemsPerPage = 6;
// lste avec paginnation
export async function listeClasses() {
  const classes = await fetchData("classes");
  const niveaux = await fetchData("niveaux");
  const filieres = await fetchData("filieres");
  const container = document.getElementById("Classes");

  container.innerHTML = "";

  // pagination
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = classes.slice(start, end);

  pageItems.forEach((c) =>  {
    if (c.statut.toLowerCase() !== "archiver") {
    const niveauLibelle =
      niveaux.find((n) => n.id_niveau == c.id_niveau)?.libelle || "Inconnu";
    const filiereLibelle =
      filieres.find((f) => f.id_filiere == c.id_filiere)?.libelle || "Inconnu";

    container.innerHTML += `
        <div class="bg-white rounded-2xl shadow-md p-4 flex flex-col space-y-2">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">${c.libelle}</h2>
            <div class="flex space-x-2 text-xl text-gray-500" data-id="${c.id}">
              <i class="edit-btn ri-pencil-line cursor-pointer hover:text-pink-600"></i>
              <i class="ri-delete-bin-6-line cursor-pointer hover:text-red-500"></i>
            </div>
          </div>
          <p><span class="font-medium">Niveau:</span> ${niveauLibelle}</p>
          <p><span class="font-medium">Filière:</span> ${filiereLibelle}</p>
        </div>
      `;
    }
  });

  renderPagination(classes.length); // afficher les boutons de pagination
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
      listeClasses();
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
// archiver
export function archiverClasse() {
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
  
      await fetch(`http://localhost:3000/classes/${idToArchive}`, {
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
  

// Modifier
export function modifierClasse(overlay,popup) {
    document.addEventListener("click", async (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const card = e.target.closest("div[data-id]");
        editingId = card.dataset.id;
  
        const data = await fetchData("classes", editingId);
  
        document.getElementById("libelle").value = data.libelle;
        document.getElementById("filiere").value = data.id_filiere;
        document.getElementById("niveau").value = data.id_niveau;
  
        submitBtn.innerText = "Modifier";
        ouvrePopup(overlay,popup);
      }
    });
  }

// selectionner niveau
export async function selectNiveau() {
  const niveaux = await fetchData("niveaux");
  const niveauSelect = document.querySelectorAll(".niveau");
  niveauSelect.forEach(select => {
    select.innerHTML =    `<option value="">Sélectionnez un niveau</option>` +
    niveaux
      .map((n) => `<option value="${n.id_niveau}">${n.libelle}</option>`)
      .join("");
  });
}
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

// ajouter classe
let editingId = null;
const submitBtn = document.getElementById("submitBtn");
export async function FormSubmit(e) {
  e.preventDefault();

  const libelle = document.getElementById("libelle").value.trim();
  const id_filiere = document.getElementById("filiere").value;
  const id_niveau = document.getElementById("niveau").value;

  const libelleError = document.getElementById("libelleError");
  const niveauError = document.getElementById("niveauError");
  const filiereError = document.getElementById("filiereError");

  let isValid = true;

  // Réinitialisation des erreurs
  libelleError.textContent = "";
  niveauError.textContent = "";
  filiereError.textContent = "";

  if (!libelle) {
    libelleError.textContent = "Champ requis*";
    isValid = false;
  }
  const classes=await fetchData("classes")
  const existe = classes.some(c => c.libelle.toLowerCase() == libelle.toLowerCase());
  if (existe) {
    libelleError.textContent = "Ce libellé existe déjà.";
    isValid = false;
  }

  if (!id_filiere) {
    filiereError.textContent = "Sélection obligatoire*";
    isValid = false;
  }

  if (!id_niveau) {
    niveauError.textContent = "Sélection obligatoire*";
    isValid = false;
  }

  if (!isValid) return false;

  const donne = {
    libelle,
    id_niveau,
    id_filiere,
  };

  if (editingId) {
    donne.id = editingId;
    await fetch(`http://localhost:3000/classes/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donne),
    });
    editingId = null;
    submitBtn.innerText = "Valider";
  } else {
    const classes = await fetchData("classes");
    donne.id = (await genererId(classes)).toString();

    await fetch("http://localhost:3000/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donne),
    });
  }

  form.reset();
  listeClasses();
  return true;
}

