import {
    listeCoursPlanifie,
    //     selectNiveau,
    // selectFiliere,
    // ouvrePopup,
    // fermePopup,
    // FormSubmit,
    // archiverClasse,
    // modifierClasse,
      } from "../../../services/coursRpService.js";
      import { sidebar, topbar } from "../../../services/rpService.js";

      import { fetchData, } from "../../../services/apiService.js";

      import { handleNotifications } from "../../../store/notificationStore.js";
      
      document.addEventListener("DOMContentLoaded", async () => { 
        const niveau=await fetchData("niveaux")
        // let submitBtn = document.getElementById("submitBtn"); 
        sidebar();
        topbar();
        listeCoursPlanifie() 
        // selectNiveau();
        // listeClasses();
        // selectFiliere();
        // archiverClasse();
        let overlay = document.querySelector(".overlay");
        let popup = document.querySelector("#formPopup");
        

        // const addBtn = document.getElementById("add");
        // addBtn.addEventListener("click", () => ouvrePopup(overlay,popup));
        // overlay.addEventListener("click", () =>  fermePopup(overlay,popup));

        // // appel de form
        // const form = document.getElementById("formClasse");
        // form.addEventListener("submit", async (e) => {
        //   const isDone = await FormSubmit(e);
        //   if (isDone) {
        //     fermePopup(overlay, popup);
        //   }
        // });
                  
        // modifierClasse(overlay,popup)

       });

