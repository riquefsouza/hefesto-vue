<template>
    <BarraMenu></BarraMenu>
    <Toast></Toast>

    <Panel header="Configuration Parameter Category" class="p-mb-2">
        <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
    </Panel>

    <Toolbar class="p-mb-4">
        <template #left>
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="onExport"></Button>
        </template>

        <template #right>
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="onInsert" />
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" 
                @click="confirmDeleteSelected" :disabled="!selectedAdmParameterCategories || !selectedAdmParameterCategories.length" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="onCancel"/>    
        </template>
    </Toolbar>  

    <DataTable :value="listaAdmParameterCategory" v-model:selection="selectedAdmParameterCategories" dataKey="id" 
        :paginator="true" :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
        :rowsPerPageOptions="[10,25,50,100,150,200]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" responsiveLayout="scroll">
        <template #header>
            <div class="table-header">
                <h5 class="p-m-0">Manage Parameter Categories</h5>
            </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="id" header="Id" :sortable="true" style="min-width:12rem"></Column>
        <Column field="description" header="Description" :sortable="true" style="min-width:16rem"></Column>
        <Column field="order" header="Order" :sortable="true" style="min-width:10rem">></Column>
        <Column :exportable="false">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="onEdit(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteAdmParameterCategory(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="admParameterCategoryDialog" :style="{width: '450px'}" header="Parameter Category Details" :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="admParameterCategory.description" required="true" autofocus rows="3" cols="20" 
             :class="{'p-invalid': submitted && !admParameterCategory.description}" />
            <small class="p-error" v-if="submitted && !admParameterCategory.description">Description is required.</small> 
        </div>
        <div class="p-field p-col">
            <label for="order">Order</label>
            <InputNumber id="order" v-model="admParameterCategory.order" integeronly />
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="onSave" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteAdmParameterCategoryDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="admParameterCategory">Are you sure you want to delete <b>{{admParameterCategory.description}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAdmParameterCategoryDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteAdmParameterCategory" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteAdmParameterCategoriesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="admParameterCategory">Are you sure you want to delete the selected?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAdmParameterCategoriesDialog = false"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedAdmParameterCategories" />
        </template>
    </Dialog>

</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';

import AdmParameterCategoryService from '@/admin/services/AdmParameterCategoryService';
import { AdmParameterCategory, emptyAdmParameterCategory } from '@/admin/models/AdmParameterCategory';
import { ItypeReport, PDFReport, SelectItemGroup } from '@/base/services/ReportService';
import { ReportParamForm, emptyReportParamForm } from '@/base/models/ReportParamsForm';

export default {
    setup() {
        const toast = useToast();
        const dt = ref();
        const listaAdmParameterCategory = ref();
        const admParameterCategoryDialog = ref(false);
        const deleteAdmParameterCategoryDialog = ref(false);
        const deleteAdmParameterCategoriesDialog = ref(false);
        const admParameterCategory = ref(emptyAdmParameterCategory);
        const admParameterCategoryService = ref(new AdmParameterCategoryService());
        const selectedAdmParameterCategories = ref();
        const filters = ref({});
        const submitted = ref(false);

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        onMounted(() => {
            admParameterCategoryService.value.findAll().then(item => listaAdmParameterCategory.value = item);

            selectedTypeReport.value = PDFReport.value;
        })

        const onTypeReportChange = (param: { pTypeReport: SelectItemGroup }) => {
            if (param.pTypeReport.value){
                selectedTypeReport.value = param.pTypeReport.value;
                reportParamForm.value = { reportType: param.pTypeReport.value.type, forceDownload: selectedForceDownload.value };
            }        
        }

        const onForceDownloadChange = (param: { forceDownload: boolean }) => {
            selectedForceDownload.value = param.forceDownload;
            if (selectedTypeReport.value){
                reportParamForm.value = { reportType: selectedTypeReport.value.type, forceDownload: param.forceDownload };
            }
        }

        const onExport = () => {
            admParameterCategoryService.value.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Parameter Category Exported', 
                    detail: 'Parameter Category Exported', life: 3000 });
            });
        }

        const onCancel = () => {
            router.push("/");
        }

        const onInsert = () => {
            admParameterCategory.value = emptyAdmParameterCategory;
            submitted.value = false;
            admParameterCategoryDialog.value = true;
        };

        const hideDialog = () => {
            admParameterCategoryDialog.value = false;
            submitted.value = false;
        };

        const onSave = () => {
            submitted.value = true;

			if (admParameterCategory.value.description.trim()) {
                if (admParameterCategory.value.id) {
                    admParameterCategoryService.value.update(admParameterCategory.value).then((obj: AdmParameterCategory) => {
                        admParameterCategory.value = obj;

                        listaAdmParameterCategory.value[admParameterCategoryService.value
                            .findIndexById(listaAdmParameterCategory.value, admParameterCategory.value.id)] = admParameterCategory.value;
                        toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Category Updated', life: 3000});
                    });
                }
                else {
                    admParameterCategoryService.value.insert(admParameterCategory.value).then((obj: AdmParameterCategory) => {
                        admParameterCategory.value = obj;

                        admParameterCategory.value.id = listaAdmParameterCategory.value.length + 1;
                        listaAdmParameterCategory.value.push(admParameterCategory.value);
                        toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Category Created', life: 3000});
                    });
                }

                admParameterCategoryDialog.value = false;
                admParameterCategory.value = emptyAdmParameterCategory;
            }
        };

        const onEdit = (param: AdmParameterCategory) => {
            admParameterCategory.value = {...param};
            admParameterCategoryDialog.value = true;
        };

        const confirmDeleteAdmParameterCategory = (param: AdmParameterCategory) => {
            admParameterCategory.value = param;
            deleteAdmParameterCategoryDialog.value = true;
        };

        const deleteAdmParameterCategory = () => {
            admParameterCategoryService.value.delete(admParameterCategory.value.id).then(() => {
                listaAdmParameterCategory.value = listaAdmParameterCategory.value.filter((val: AdmParameterCategory) => val.id !== admParameterCategory.value.id);
                deleteAdmParameterCategoryDialog.value = false;
                admParameterCategory.value = emptyAdmParameterCategory;
                toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Category Deleted', life: 3000});
            });
        };

        const confirmDeleteSelected = () => {
            deleteAdmParameterCategoriesDialog.value = true;
        };

        const deleteSelectedAdmParameterCategories = () => {
            listaAdmParameterCategory.value = listaAdmParameterCategory.value
                .filter((val: AdmParameterCategory) => !selectedAdmParameterCategories.value.includes(val));
            deleteAdmParameterCategoriesDialog.value = false;
            selectedAdmParameterCategories.value = null;
            toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Categories Deleted', life: 3000});
        };

        return { dt, listaAdmParameterCategory, admParameterCategoryDialog, deleteAdmParameterCategoryDialog, deleteAdmParameterCategoriesDialog, 
            admParameterCategory, selectedAdmParameterCategories, filters, submitted, onExport, onCancel, onInsert, hideDialog, onSave, onEdit,
            confirmDeleteAdmParameterCategory, deleteAdmParameterCategory, confirmDeleteSelected, deleteSelectedAdmParameterCategories,
            onTypeReportChange, onForceDownloadChange }
    }
}
</script>

<style>

</style>