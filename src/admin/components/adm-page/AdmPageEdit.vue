<template>
    <div>
        <Toast></Toast>

        <Panel header="Configuration Page" class="p-mb-2">
            <div class="p-grid p-justify-end">
                <Button label="Save" icon="pi pi-check" class="p-button-success p-mr-2" @click="onSave"></Button>
                <Button label="Clean" icon="pi pi-star-o" class="p-button-primary p-mr-2" @click="onClean"></Button>
                <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-mr-2" @click="onCancel"></Button>
            </div>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-8">
                    <label for="url">Page:</label>
                    <InputText id="url" v-model="admPage.url" required="true" 
                    :class="{'p-invalid': submitted && !admPage.url}" />
                    <small class="p-error" v-if="submitted && !admPage.url">Page is required.</small>
                </div>
                <div class="p-field p-col-12">
                    <label for="description">Description:</label>
                    <InputText id="description" v-model="admPage.description" required="true" 
                    :class="{'p-invalid': submitted && !admPage.description}" />
                    <small class="p-error" v-if="submitted && !admPage.description">Description is required.</small>
                </div>
                <div class="p-field p-col-12 p-md-8">
                    <label for="pageProfiles">Page profile(s):</label>
                    <PickList v-model="pageProfiles" dataKey="id">
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

import AdmPageService from '@/admin/services/AdmPageService';
import { AdmPage, cleanAdmPage, emptyAdmPage } from '@/admin/models/AdmPage';
import { StorageService } from '@/base/services/StorageService';
import AdmProfileService from '@/admin/services/AdmProfileService';
import { AdmProfile } from '@/admin/models/AdmProfile';

export default {
    setup() {
        const admProfileService = ref<AdmProfileService>(new AdmProfileService());
        const admPageService = ref<AdmPageService>(new AdmPageService());
        const storageService = ref<StorageService>(new StorageService());
        
        const listaAdmPage = ref<AdmPage[]>([]);
        const admPage = ref<AdmPage>(emptyAdmPage);
        const submitted = ref<boolean>(false);
        const toast = useToast();

        const pageProfiles = ref<AdmProfile[][]>();

        const loadAdmProfiles = (page: AdmPage) => {
            let sourceProfiles: AdmProfile[] = [];
            let targetProfiles: AdmProfile[] = [];

            if (page.id != null) {
                admProfileService.value.findProfilesByPage(page).then(item => {
                    targetProfiles = item;

                    admProfileService.value.findAll().then(profiles => {
                        sourceProfiles = profiles.filter(profile => !item.find(target => target.id === profile.id));

                        pageProfiles.value = [sourceProfiles, targetProfiles];
                    });

                });
            } else {
                admProfileService.value.findAll().then(profiles => pageProfiles.value = [profiles, []]);
            }
        }

        onMounted(() => {
            const vPage: AdmPage = storageService.value.getPersistedObj('admPage') as AdmPage; 
            admPage.value = vPage;

            admPageService.value.findAll().then(item => listaAdmPage.value = item);

            loadAdmProfiles(vPage);
        })

        const onClean = () => {
            admPage.value = cleanAdmPage;
        }

        const onCancel = () => {
            router.push('/admPage');
        }

        const onSave = () => {
            submitted.value = true;

			if (admPage.value.description.trim()) {
                if (admPage.value.id) {
                    listaAdmPage.value[admPageService.value
                        .findIndexById(listaAdmPage.value, admPage.value.id)] = admPage.value;
                    toast.add({severity:'success', summary: 'Successful', detail: 'Page Updated', life: 3000});
                }
                else {
                    admPage.value.id = listaAdmPage.value.length + 1;
                    listaAdmPage.value.push(admPage.value);
                    toast.add({severity:'success', summary: 'Successful', detail: 'Page Created', life: 3000});
                }

                admPage.value = emptyAdmPage;
                router.push('/admPage');
            }
        };

        return { listaAdmPage, admPage, submitted, pageProfiles, onClean, onCancel, onSave }
    }
}
</script>

<style>

</style>
