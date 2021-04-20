<template>
    <div>
        <Toast></Toast>

        <Panel header="Configuration Profile" class="p-mb-2">
            <div class="p-grid p-justify-end">
                <Button label="Save" icon="pi pi-check" class="p-button-success p-mr-2" @click="onSave"></Button>
                <Button label="Clean" icon="pi pi-star-o" class="p-button-primary p-mr-2" @click="onClean"></Button>
                <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-mr-2" @click="onCancel"></Button>
            </div>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-6">
                    <label for="description">Description:</label>
                    <InputText id="description" v-model="admProfile.description" required="true" 
                    :class="{'p-invalid': submitted && !admProfile.description}" />
                    <small class="p-error" v-if="submitted && !admProfile.description">Description is required.</small>
                </div>
                <div class="p-field p-col-1 p-md-1">
                    <label for="general" style="margin: 4px;">All users:</label>
                    <Checkbox id="general" v-model="admProfile.general" :binary="true"></Checkbox>
                </div>    
                <div class="p-field p-col-2 p-md-2">
                    <label for="administrator" style="margin: 4px;">System administrators:</label>
                    <Checkbox id="administrator" v-model="admProfile.administrator" :binary="true"></Checkbox>
                </div>
            </div>
            <div className="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-8">
                    <label for="profileUsers">User(s):</label>
                    <PickList v-model="profileUsers" dataKey="id">
                        <template #sourceHeader>Available</template>
                        <template #targetHeader>Selected</template>
                        <template #item="slotProps">
                            <div>
                                {{slotProps.item.name}}
                            </div>
                        </template>
                    </PickList>
                </div>
                <div class="p-field p-col-12 p-md-8">
                    <label for="profilePages">Page(s):</label>
                    <PickList v-model="profilePages" dataKey="id">
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

import AdmProfileService from '@/admin/services/AdmProfileService';
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from '@/admin/models/AdmProfile';
import { StorageService } from '@/base/services/StorageService';
import AdmPageService from '@/admin/services/AdmPageService';
import AdmUserService from '@/admin/services/AdmUserService';
import { AdmPage } from '@/admin/models/AdmPage';
import { AdmUser } from '@/admin/models/AdmUser';

export default {
    setup() {
        const admProfileService = ref<AdmProfileService>(new AdmProfileService());
        const admUserService = ref<AdmUserService>(new AdmUserService());
        const admPageService = ref<AdmPageService>(new AdmPageService());
        const storageService = ref<StorageService>(new StorageService());
        
        const listaAdmProfile = ref<AdmProfile[]>([]);
        const admProfile = ref<AdmProfile>(emptyAdmProfile);
        const submitted = ref<boolean>(false);
        const toast = useToast();

        const profileUsers = ref<AdmUser[][]>();
        const profilePages = ref<AdmPage[][]>();

        const loadAdmUsers = (profile: AdmProfile) => {
            let sourceUsers: AdmUser[] = [];
            let targetUsers: AdmUser[] = [];
            
            if (profile.id != null) {
                targetUsers = profile.admUsers;

                admUserService.value.findAll().then(users => {
                    sourceUsers = users.filter(user => !targetUsers.find(target => target.id === user.id));

                    profileUsers.value = [sourceUsers, targetUsers];
                });
            } else {
                admUserService.value.findAll().then(users => profileUsers.value = [users, []]);
            }
        }

        const loadAdmPages = (profile: AdmProfile) => {
            let sourcePages: AdmPage[] = [];
            let targetPages: AdmPage[] = [];
            
            if (profile.id != null) {
                targetPages = profile.admPages;

                admPageService.value.findAll().then(pages => {
                    sourcePages = pages.filter(page => !targetPages.find(target => target.id === page.id));

                    profilePages.value = [sourcePages, targetPages];
                });
            } else {
                admPageService.value.findAll().then(pages => profilePages.value = [pages, []]);
            }
        }

        onMounted(() => {
            const vProfile: AdmProfile = storageService.value.getPersistedObj('admProfile') as AdmProfile; 
            admProfile.value = vProfile;

            admProfileService.value.findAll().then(item => listaAdmProfile.value = item);

            loadAdmUsers(vProfile);
            loadAdmPages(vProfile);
        })

        const onClean = () => {
            admProfile.value = cleanAdmProfile;
        }

        const onCancel = () => {
            router.push('/admProfile');
        }

        const onSave = () => {
            submitted.value = true;

			if (admProfile.value.description.trim()) {
                if (admProfile.value.id) {
                    listaAdmProfile.value[admProfileService.value
                        .findIndexById(listaAdmProfile.value, admProfile.value.id)] = admProfile.value;
                    toast.add({severity:'success', summary: 'Successful', detail: 'Profile Updated', life: 3000});
                }
                else {
                    admProfile.value.id = listaAdmProfile.value.length + 1;
                    listaAdmProfile.value.push(admProfile.value);
                    toast.add({severity:'success', summary: 'Successful', detail: 'Profile Created', life: 3000});
                }

                admProfile.value = emptyAdmProfile;
                router.push('/admProfile');
            }
        };

        return { listaAdmProfile, admProfile, submitted, profileUsers, profilePages, onClean, onCancel, onSave }
    }
}
</script>

<style>

</style>
