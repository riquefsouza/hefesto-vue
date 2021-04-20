<template>
    <div>
        <Toast></Toast>

        <Panel header="Configuration Parameter" class="p-mb-2">
            <div class="p-grid p-justify-end">
                <Button label="Save" icon="pi pi-check" class="p-button-success p-mr-2" @click="onSave"></Button>
                <Button label="Clean" icon="pi pi-star-o" class="p-button-primary p-mr-2" @click="onClean"></Button>
                <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-mr-2" @click="onCancel"></Button>
            </div>
            <div class="p-fluid p-formgrid p-grid">
                <div class="p-field p-col-12 p-md-6">
                    <label for="admParameterCategory">Parameter Category:</label>
                    <Dropdown id="admParameterCategory" v-model="admParameter.admParameterCategory" :options="listaAdmParameterCategory"
                        optionLabel="description" placeholder="Select a parameter category"></Dropdown>
                </div>
                <div class="p-field p-col-12 p-md-6">
                    <label for="code">Code:</label>
                    <InputText id="code" v-model="admParameter.code" required="true" 
                    :class="{'p-invalid': submitted && !admParameter.code}" />
                    <small class="p-error" v-if="submitted && !admParameter.code">Code is required.</small>
                </div>
                <div class="p-field p-col-12">
                    <label for="value">Value:</label>
                    <Textarea id="value" v-model="admParameter.value" required="true" rows="3" cols="20" 
                    :class="{'p-invalid': submitted && !admParameter.value}" />
                    <small class="p-error" v-if="submitted && !admParameter.value">Value is required.</small> 
                </div>
                <div class="p-field p-col-12">
                    <label for="description">Description:</label>
                    <InputText id="description" v-model="admParameter.description" required="true" 
                    :class="{'p-invalid': submitted && !admParameter.description}" />
                    <small class="p-error" v-if="submitted && !admParameter.description">Description is required.</small>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';

import AdmParameterService from '@/admin/services/AdmParameterService';
import { AdmParameter, cleanAdmParameter, emptyAdmParameter } from '@/admin/models/AdmParameter';
import AdmParameterCategoryService from '@/admin/services/AdmParameterCategoryService';
import { StorageService } from '@/base/services/StorageService';
import { AdmParameterCategory } from '@/admin/models/AdmParameterCategory';

export default {
    setup() {
        const admParameterService = ref<AdmParameterService>(new AdmParameterService());
        const admParameterCategoryService = ref<AdmParameterCategoryService>(new AdmParameterCategoryService());
        const storageService = ref<StorageService>(new StorageService());
        
        const listaAdmParameter = ref<AdmParameter[]>([]);
        const admParameter = ref<AdmParameter>(emptyAdmParameter);
        const submitted = ref<boolean>(false);
        const listaAdmParameterCategory = ref<AdmParameterCategory[]>([]);
        const toast = useToast();

        onMounted(() => {
            admParameterCategoryService.value.findAll().then(item => listaAdmParameterCategory.value = item);

            // admParameter.value = storageService.value.getStorage();
            admParameter.value = storageService.value.getPersistedObj('admParameter') as AdmParameter;

            admParameterService.value.findAll().then(item => listaAdmParameter.value = item);
        })

        const onClean = () => {
            admParameter.value = cleanAdmParameter;
        }

        const onCancel = () => {
            router.push('/admParameter');
        }

        const onSave = () => {
            submitted.value = true;

			if (admParameter.value.description.trim()) {
                if (admParameter.value.id) {
                    listaAdmParameter.value[admParameterService.value
                        .findIndexById(listaAdmParameter.value, admParameter.value.id)] = admParameter.value;
                    toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Updated', life: 3000});
                }
                else {
                    admParameter.value.id = listaAdmParameter.value.length + 1;
                    listaAdmParameter.value.push(admParameter.value);
                    toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Created', life: 3000});
                }

                admParameter.value = emptyAdmParameter;
                router.push('/admParameter');
            }
        };

        return { listaAdmParameter, admParameter, submitted, listaAdmParameterCategory, onClean, onCancel, onSave }
    }
}
</script>

<style>

</style>
