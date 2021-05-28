import { createWebHistory, createRouter } from "vue-router";
import About from "@/views/About.vue";
import User from "@/views/User.vue";
import BarraMenu from "@/base/components/BarraMenu.vue";
import NotFoundComponent from "@/base/components/NotFoundComponent.vue";
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
import UserService from '@/base/user/UserService';
import { ref } from "vue";

const userService = ref<UserService>(new UserService());

const routes = [
  { path: "/", name: "Root", redirect: '/login' },
  { path: "/home", name: "Home", component: BarraMenu },

  { path: "/about", name: "About", component: About }, 
  { path: "/user/:name", name: "User", component: User, props: true },
  
  { path: "/admin/admParameterCategory", name: "AdmParameterCategory", component: AdmParameterCategory },
  { path: "/admin/admParameterCategoryEdit", name: "AdmParameterCategoryEdit", component: AdmParameterCategoryEdit },
  { path: "/admin/admParameter", name: "AdmParameter", component: AdmParameter },
  { path: "/admin/admParameterEdit", name: "AdmParameterEdit", component: AdmParameterEdit },
  { path: "/admin/admPage", name: "AdmPage", component: AdmPage },
  { path: "/admin/admPageEdit", name: "AdmPageEdit", component: AdmPageEdit },
  { path: "/admin/admProfile", name: "AdmProfile", component: AdmProfile },
  { path: "/admin/admProfileEdit", name: "AdmProfileEdit", component: AdmProfileEdit },
  { path: "/admin/admUser", name: "AdmUser", component: AdmUser },
  { path: "/admin/admUserEdit", name: "AdmUserEdit", component: AdmUserEdit },
  { path: "/admin/admMenu", name: "AdmMenu", component: AdmMenu },
  { path: "/admin/changePasswordEdit", name: "ChangePasswordEdit", component: ChangePasswordEdit },
  { path: "/login", name: "Login", component: Login },
  { path: "/:catchAll(.*)", component: NotFoundComponent }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !userService.value.isLogged()) 
    next({ name: 'Login' })
  else 
    next()
})

export default router;
