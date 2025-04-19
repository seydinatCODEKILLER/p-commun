import {
sidebar,
topbar,
courbeCoursParProfs,
courbeCoursParClasse,
classeTotal,
ProfTotal,
  } from "../../../services/rpService.js";
  import { handleNotifications } from "../../../store/notificationStore.js";
  
  document.addEventListener("DOMContentLoaded", async () => {
    sidebar();
    topbar();
    courbeCoursParProfs();
    courbeCoursParClasse();
    classeTotal();
    ProfTotal();

    handleNotifications();
  });