<template>
  <div>
    <Menubar class="p-mb-2" :style="logged ? {display: 'none'} : {display: ''}">
      <template #start>
        <a href="/">
          <img alt="logo" src="@/assets/logo.png" height="40" class="p-mr-2" />
        </a>  
      </template>
    </Menubar>
    <Menubar :model="menuItems" class="p-mb-2" :style="logged ? {display: ''} : {display: 'none'}">
      <template #start>
        <a href="/">
          <img alt="logo" src="@/assets/logo.png" height="40" class="p-mr-2" />
        </a>  
      </template>
      <template #end>
        <Button label="Logout" icon="pi pi-power-off" />
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const logged = ref(true);

    const menuItems = ref([
      {
        label: "Configurações",
        items: [
          { label: "Parameter Category", to: '/admParameterCategory' },
          { label: "Parameter", to: '/admParameter' },
          { label: "Profile", to: '/admProfile' },
          { label: "Page", to: '/admPage' },
          { label: "Menu", to: '/admMenu' },
          { label: "User", to: '/admUser' },
          { label: "Change Password", to: '/changePasswordEdit' },
          { label: "Sobre", to: '/about' },
          { label: "Sair", to: '/' }
        ],
      },
    ]);

    return { logged, menuItems };
  },
};
</script>

<style></style>
