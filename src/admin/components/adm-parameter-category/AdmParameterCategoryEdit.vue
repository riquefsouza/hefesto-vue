<template>
    <Toast></Toast>

    <Panel header="Configuration Parameter Category" class="p-mb-2">
        <div class="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" class="p-button-success p-mr-2" @click="onSave"></Button>
          <Button label="Clean" icon="pi pi-star-o" class="p-button-primary p-mr-2" @click="onClean"></Button>
          <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-mr-2" @click="onCancel"></Button>
        </div>
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12">
                <label for="description">Description</label>
                <Textarea id="description" v-model="admParameterCategory.description" required="true" autofocus rows="3" cols="30" 
                :class="{'p-invalid': submitted && !admParameterCategory.description}" />
                <small class="p-error" v-if="submitted && !admParameterCategory.description">Description is required.</small> 
            </div>
            <div class="p-field p-col-12 p-md-6">
                <label for="order">Order</label>
                <InputNumber id="order" v-model="admParameterCategory.order" integeronly />
            </div>          
        </div>
    </Panel>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';

import AdmParameterCategoryService from '@/admin/services/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '@/admin/models/AdmParameterCategory';
import { StorageService } from '@/base/services/StorageService';

export default {
    setup() {
        const toast = useToast();
        const listaAdmParameterCategory = ref();
        const admParameterCategory = ref(emptyAdmParameterCategory);
        const admParameterCategoryService = ref(new AdmParameterCategoryService());
        const storageService = ref(new StorageService());
        const submitted = ref(false);

        onMounted(() => {
            // admParameterCategory.value = storageService.getStorage();
            admParameterCategory.value = storageService.value.getPersistedObj('admParameterCategory') as AdmParameterCategory;

            admParameterCategoryService.value.findAll().then(item => listaAdmParameterCategory.value = item);
        })

        const onClean = () => {
            admParameterCategory.value = emptyAdmParameterCategory;
        }

        const onCancel = () => {
            router.push('/admParameter');
        }

        const onSave = () => {
            submitted.value = true;

			if (admParameterCategory.value.description.trim()) {
                if (admParameterCategory.value.id) {
                    listaAdmParameterCategory.value[admParameterCategoryService.value
                        .findIndexById(listaAdmParameterCategory.value, admParameterCategory.value.id)] = admParameterCategory.value;
                    toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Category Updated', life: 3000});
                }
                else {
                    admParameterCategory.value.id = listaAdmParameterCategory.value.length + 1;
                    listaAdmParameterCategory.value.push(admParameterCategory.value);
                    toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Category Created', life: 3000});
                }

                admParameterCategory.value = emptyAdmParameterCategory;
                router.push('/admParameterCategory');
            }
        };

        return { listaAdmParameterCategory, admParameterCategory, submitted, onClean, onCancel, onSave }
    }
}
</script>

<style>

</style>