<template>
    <div>
        <Toast></Toast>

        <Panel header="Configuration User" class="p-mb-2">
            <div class="p-grid p-justify-end">
                <Button label="Save" icon="pi pi-check" class="p-button-success p-mr-2" @click="onSave"></Button>
                <Button label="Clean" icon="pi pi-star-o" class="p-button-primary p-mr-2" @click="onClean"></Button>
                <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-mr-2" @click="onCancel"></Button>
            </div>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-2 p-md-2">
                    <label for="active" style="margin: 4px;">Active:</label>
                    <Checkbox id="active" v-model="admUser.active" :binary="true"></Checkbox>
                </div>    
                <div class="p-field p-col-12">
                    <label for="email">E-mail:</label>
                    <InputText id="email" v-model="admUser.email" required="true" 
                    :class="{'p-invalid': submitted && !admUser.email}" />
                    <small class="p-error" v-if="submitted && !admUser.email">E-mail is required.</small>
                </div>
                <div class="p-field p-col-12">
                    <label for="login">Login:</label>
                    <InputText id="login" v-model="admUser.login" required="true" 
                    :class="{'p-invalid': submitted && !admUser.login}" />
                    <small class="p-error" v-if="submitted && !admUser.login">Login is required.</small>
                </div>
                <div class="p-field p-col-12">
                    <label for="name">Name:</label>
                    <InputText id="name" v-model="admUser.name" required="true" 
                    :class="{'p-invalid': submitted && !admUser.name}" />
                    <small class="p-error" v-if="submitted && !admUser.name">Name is required.</small>
                </div>
                <div class="p-field p-col-12 p-md-8">
                    <label for="userProfiles">User profile(s):</label>
                    <PickList v-model="userProfiles" dataKey="id">
                        <template #sourceHeader>Available</template>
                        <template #targetHeader>Selected</template>
                        <template #item="slotProps">
                            <div>
                                {{slotProps.item.description}}
                            </div>
                        </template>
                    </PickList>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';

import AdmUserService from '@/admin/services/AdmUserService';
import { AdmUser, cleanAdmUser, emptyAdmUser } from '@/admin/models/AdmUser';
import { StorageService } from '@/base/services/StorageService';
import AdmProfileService from '@/admin/services/AdmProfileService';
import { AdmProfile } from '@/admin/models/AdmProfile';

export default {
    setup() {
        const admProfileService = ref<AdmProfileService>(new AdmProfileService());
        const admUserService = ref<AdmUserService>(new AdmUserService());
        const storageService = ref<StorageService>(new StorageService());
        
        const listaAdmUser = ref<AdmUser[]>([]);
        const admUser = ref<AdmUser>(emptyAdmUser);
        const submitted = ref<boolean>(false);
        const toast = useToast();

        const userProfiles = ref<AdmProfile[][]>();

        const loadAdmProfiles = (user: AdmUser) => {
            let sourceProfiles: AdmProfile[] = [];
            let targetProfiles: AdmProfile[] = [];

            if (user.id != null) {
                admProfileService.value.findProfilesByUser(user).then(item => {
                    targetProfiles = item;

                    admProfileService.value.findAll().then(profiles => {
                        sourceProfiles = profiles.filter(profile => !item.find(target => target.id === profile.id));

                        userProfiles.value = [sourceProfiles, targetProfiles];
                    });

                });
            } else {
                admProfileService.value.findAll().then(profiles => userProfiles.value = [profiles, []]);
            }
        }

        onMounted(() => {
            const vUser: AdmUser = storageService.value.getPersistedObj('admUser') as AdmUser; 
            admUser.value = vUser;

            admUserService.value.findAll().then(item => listaAdmUser.value = item);

            loadAdmProfiles(vUser);
        })

        const onClean = () => {
            admUser.value = cleanAdmUser;
        }

        const onCancel = () => {
            router.push('/admUser');
        }

        const onSave = () => {
            submitted.value = true;

			if (admUser.value.name.trim()) {
                if (admUser.value.id) {
                    listaAdmUser.value[admUserService.value
                        .findIndexById(listaAdmUser.value, admUser.value.id)] = admUser.value;
                    toast.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
                }
                else {
                    admUser.value.id = listaAdmUser.value.length + 1;
                    listaAdmUser.value.push(admUser.value);
                    toast.add({severity:'success', summary: 'Successful', detail: 'User Created', life: 3000});
                }

                admUser.value = emptyAdmUser;
                router.push('/admUser');
            }
        };

        return { listaAdmUser, admUser, submitted, userProfiles, onClean, onCancel, onSave }
    }
}
</script>

<style>

</style>
