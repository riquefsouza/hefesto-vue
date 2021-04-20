import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import User from "@/views/User.vue";
import NotFound from "@/views/NotFound.vue";
import AdmParameterCategory from "@/admin/components/adm-parameter-category/AdmParameterCategory.vue";
import AdmParameterCategoryEdit from "@/admin/components/adm-parameter-category/AdmParameterCategoryEdit.vue";
import AdmParameter from "@/admin/components/adm-parameter/AdmParameter.vue";
import AdmParameterEdit from "@/admin/components/adm-parameter/AdmParameterEdit.vue";
import AdmPage from "@/admin/components/adm-page/AdmPage.vue";
import AdmPageEdit from "@/admin/components/adm-page/AdmPageEdit.vue";
import AdmProfile from "@/admin/components/adm-profile/AdmProfile.vue";
import AdmProfileEdit from "@/admin/components/adm-profile/AdmProfileEdit.vue";
import AdmUser from "@/admin/components/adm-user/AdmUser.vue";
import AdmUserEdit from "@/admin/components/adm-user/AdmUserEdit.vue";
import AdmMenu from "@/admin/components/adm-menu/AdmMenu.vue";
import ChangePasswordEdit from "@/admin/components/change-password/ChangePasswordEdit.vue";
import Login from "@/admin/components/login/Login.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/about", name: "About", component: About }, 
  { path: "/user/:name", name: "User", component: User, props: true },
  { path: "/:catchAll(.*)", component: NotFound },
  { path: "/admParameterCategory", name: "AdmParameterCategory", component: AdmParameterCategory },
  { path: "/admParameterCategoryEdit", name: "AdmParameterCategoryEdit", component: AdmParameterCategoryEdit },
  { path: "/admParameter", name: "AdmParameter", component: AdmParameter },
  { path: "/admParameterEdit", name: "AdmParameterEdit", component: AdmParameterEdit },
  { path: "/admPage", name: "AdmPage", component: AdmPage },
  { path: "/admPageEdit", name: "AdmPageEdit", component: AdmPageEdit },
  { path: "/admProfile", name: "AdmProfile", component: AdmProfile },
  { path: "/admProfileEdit", name: "AdmProfileEdit", component: AdmProfileEdit },
  { path: "/admUser", name: "AdmUser", component: AdmUser },
  { path: "/admUserEdit", name: "AdmUserEdit", component: AdmUserEdit },
  { path: "/admMenu", name: "AdmMenu", component: AdmMenu },
  { path: "/changePasswordEdit", name: "ChangePasswordEdit", component: ChangePasswordEdit },
  { path: "/login", name: "Login", component: Login }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
