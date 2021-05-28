<template>
  <div>
    <Menubar class="p-mb-2" :style="logged ? {display: 'none'} : {display: ''}">
      <template #start>
        <a href="/home">
          <img alt="logo" src="@/assets/logo.png" height="40" class="p-mr-2" />
        </a>  
      </template>
    </Menubar>
    <Menubar :model="menuItems" class="p-mb-2" :style="logged ? {display: ''} : {display: 'none'}">
      <template #start>
        <a href="/home">
          <img alt="logo" src="@/assets/logo.png" height="40" class="p-mr-2" />
        </a>  
      </template>
      <template #end>
        <div v-if="username">
            <i class="pi pi-user p-mr-1"></i>
            <a class="p-mr-5">{{username}}</a>
            <Button label="Logout" icon="pi pi-power-off" @click="logout" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import router from '@/router';
import UserService from '@/base/user/UserService';

export default {
  setup() {
    const userService = ref<UserService>(new UserService());
    const logged = ref(false);

    const username = ref<string>(userService.value.getUserName());

    const logout = () => {
      userService.value.logout();
      router.push('/');
    }
        
    const menuItems = ref(userService.value.getMenuItems());

    /*
    const menuItems = ref([
      {
        label: "Settings",
        items: [
          { label: "Parameter Category", to: '/admin/admParameterCategory' },
          { label: "Parameter", to: '/admin/admParameter' },
          { label: "Profile", to: '/admin/admProfile' },
          { label: "Page", to: '/admin/admPage' },
          { label: "Menu", to: '/admin/admMenu' },
          { label: "User", to: '/admin/admUser' },
          { label: "Change Password", to: '/admin/changePasswordEdit' },
          { label: "Sobre", to: '/about' },
          { label: "Sair", command: () => {logout();} }
        ],
      },
    ])
    */

    onMounted(() => {
      logged.value = userService.value.isLogged();
    })

    return { logged, menuItems, logout, userService, username }
  }
}
</script>

<style></style>
