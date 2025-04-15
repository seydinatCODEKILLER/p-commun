import {
    sidebar,
    topbar,
    listeClasses,
    selectNiveau,
    selectFiliere,
    ouvrePopup,
    fermePopup,
    FormSubmit,
    supprimerClass,
    modifierClasse,
      } from "../../../services/rpService.js";
      import { fetchData, } from "../../../services/apiService.js";

      import { handleNotifications } from "../../../store/notificationStore.js";
      
      document.addEventListener("DOMContentLoaded", async () => { 
        const niveau=await fetchData("niveaux")
        // let submitBtn = document.getElementById("submitBtn"); 
        sidebar();
        topbar();
        selectNiveau();
        listeClasses();
        selectFiliere();
        supprimerClass();
        let overlay = document.querySelector(".overlay");
        let popup = document.querySelector("#formPopup");
        

        const addBtn = document.getElementById("add");
        addBtn.addEventListener("click", () => ouvrePopup(overlay,popup));
        overlay.addEventListener("click", () =>  fermePopup(overlay,popup));

        // appel de form
        const form = document.getElementById("formClasse");
        form.addEventListener("submit", async (e) => {
          const isDone = await FormSubmit(e);
          if (isDone) {
            fermePopup(overlay, popup);
          }
        });
                  
        modifierClasse(overlay,popup)

       });

