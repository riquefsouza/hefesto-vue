<template>
    <div>
        <BarraMenu></BarraMenu>
        <Toast></Toast>
        <div class="centered p-shadow-8" style="width: 350px;">
            <Panel header="Log in" class="p-mb-2">
            <div class="p-fluid p-formgrid">
            <div class="p-field p-col-12">
                    <label for="login">Login:</label>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-user"></i>
                        </span>
                        <InputText id="login" v-model="admUser.login" required="true" maxlength="10" 
                        placeholder="Enter your username" 
                        :class="{'p-invalid': submitted && !admUser.login}" />                        
                    </div>
                    <small class="p-error" v-if="submitted && !admUser.login">Login is required.</small>
                </div>
                <div class="p-field p-col-12">
                    <label for="currentPassword">password:</label>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-lock"></i>
                        </span>
                        <Password id="currentPassword" v-model="admUser.password" required="true" :feedback="false" maxlength="10"
                        placeholder="Enter your password"
                        :class="{'p-invalid': submitted && !admUser.password}" />
                    </div>    
                    <small class="p-error" v-if="submitted && !admUser.password">Password is required.</small>
                </div>
            </div>  
            <div class="p-grid p-justify-center">
                <Button label="Enter" icon="pi pi-check" class="p-button-success p-mr-2" @click="login"></Button>
            </div>          
            </Panel>
        </div>        
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';
import './Login.css';

import { AdmUser, cleanAdmUser, emptyAdmUser } from '@/admin/models/AdmUser';
import LoginService from '@/admin/services/LoginService';
import UserService from '@/base/user/UserService';

export default {
    setup() {
        const loginService = ref<LoginService>(new LoginService());
        const userService = ref<UserService>(new UserService());
        
        const admUser = ref<AdmUser>(emptyAdmUser);
        const submitted = ref<boolean>(false);
        const toast = useToast();

        const onClean = () => {
            admUser.value = {...cleanAdmUser};
        }

        onMounted(() => {
            onClean();
            userService.value.logout();
        })

        const login = () => {
            submitted.value = true;

            loginService.value.login(admUser.value).then((islogged: boolean) => {
                if (islogged) { 
                    router.push('/home');
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'login not allowed!', life: 3000 });
                }
            })
            .catch(() => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'login not allowed!', life: 3000 });
            });
        }

        return { admUser, submitted, onClean, login }
    }
}
</script>

<style>

</style>
