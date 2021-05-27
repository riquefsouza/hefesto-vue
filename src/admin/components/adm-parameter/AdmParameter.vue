<template>
    <BarraMenu></BarraMenu>
    <Toast></Toast>

    <Panel header="Configuration Parameter" class="p-mb-2">
        <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
    </Panel>

    <Toolbar class="p-mb-4">
        <template #left>
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="onExport"></Button>
        </template>

        <template #right>
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="onInsert" />
            <Button label="Edit" icon="pi pi-pencil" class="p-button-warning p-mr-2" @click="onEdit(selectedAdmParameter)"
                :disabled="!selectedAdmParameter || !listaAdmParameter || !listaAdmParameter.length"></Button>
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" @click="confirmDelete(selectedAdmParameter)" 
                :disabled="!selectedAdmParameter || !listaAdmParameter || !listaAdmParameter.length" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="onCancel"/>
        </template>
    </Toolbar>  

    <DataTable :value="listaAdmParameter" v-model:selection="selectedAdmParameter" selectionMode="single" :rows="10" dataKey="id" 
        :paginator="true" paginatorPosition="both" :rowsPerPageOptions="[10,25,50,100,150,200]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"        
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" responsiveLayout="scroll">
        <template #header>
            <div style="p-d-flex">
                <Button icon="pi pi-file-excel" @click="exportExcel" class="p-button-success p-mr-2" />
                <Button icon="pi pi-file-pdf" @click="exportPdf" class="p-button-warning p-mr-2" />
            </div>
        </template>
        <template #footer>
            <div className="p-d-flex p-ai-center p-jc-between">
                In total there are {{listaAdmParameter ? listaAdmParameter.length : 0 }} parameters.
            </div>
        </template>

        <Column field="id" header="Id" :sortable="true" style="min-width:12rem"></Column>
        <Column field="admParameterCategory.description" header="Parameter Category" :sortable="true"></Column>
        <Column field="code" header="Parameter" :sortable="true"></Column>
        <Column field="value" header="Value" :sortable="true"></Column>
        <Column field="description" header="Description" :sortable="true"></Column>
    </DataTable>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="admParameter">Are you sure you want to delete <b>{{admParameter.description}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDeleteDialog()"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="onDelete()" />
        </template>
    </Dialog>

</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';

import AdmParameterService from '@/admin/services/AdmParameterService';
import { AdmParameter, emptyAdmParameter } from '@/admin/models/AdmParameter';
import AdmParameterCategoryService from '@/admin/services/AdmParameterCategoryService';
import { ExportService } from '@/base/services/ExportService';
import { StorageService } from '@/base/services/StorageService';
import { AdmParameterCategory } from '@/admin/models/AdmParameterCategory';
import { ItypeReport, PDFReport, SelectItemGroup } from '@/base/services/ReportService';
import { ReportParamForm, emptyReportParamForm } from '@/base/models/ReportParamsForm';

export default {
    setup() {
        const admParameterService = ref<AdmParameterService>(new AdmParameterService());
        const admParameterCategoryService = ref<AdmParameterCategoryService>(new AdmParameterCategoryService());
        const storageService = ref<StorageService>(new StorageService());
        const exportService = ref<ExportService>(new ExportService());
        
        const listaAdmParameter = ref<AdmParameter[]>([]);
        const admParameter = ref<AdmParameter>(emptyAdmParameter);
        const selectedAdmParameter = ref<AdmParameter>(emptyAdmParameter);
        const submitted = ref<boolean>(false);
        const listaAdmParameterCategory = ref<AdmParameterCategory[]>([]);
        const toast = useToast();
        // eslint-disable-next-line
        const cols = ref<any[]>([]);
        // eslint-disable-next-line
        const exportColumns = ref<any[]>([]);
        const deleteDialog = ref<boolean>(false);

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        onMounted(() => {
            admParameterCategoryService.value.findAll().then(item => listaAdmParameterCategory.value = item);

            admParameterService.value.findAll().then(item => listaAdmParameter.value = item);

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'admParameterCategory.description', header: 'Parameter Category' },
                { field: 'code', header: 'Parameter' },
                { field: 'value', header: 'Value' },
                { field: 'description', header: 'Description' }
            ];

            exportColumns.value= cols.value.map(col => ({title: col.header, dataKey: col.field}));

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
            admParameterService.value.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Parameter Exported', detail: 'Parameter Exported', life: 3000 });
            });
        }

        const onCancel = () => {
            router.push("/");
        }

        const onInsert = () => {
            admParameter.value = emptyAdmParameter;
            submitted.value = false;
            
            admParameter.value.admParameterCategory = listaAdmParameterCategory.value[0];

            // storageService.value.setStorage(admParameter);
            storageService.value.persistObj('admParameter', admParameter.value);
            router.push('/admParameterEdit');
        };

        const onEdit = (param: AdmParameter) => {
            admParameter.value = {...param};

            // storageService.value.setStorage(admParameter);
            storageService.value.persistObj('admParameter', admParameter.value);
            router.push('/admParameterEdit');
        }

        const confirmDelete = (param: AdmParameter) => {
            admParameter.value = param;
            deleteDialog.value = true;
        }

        const hideDeleteDialog = () => {
            deleteDialog.value = false;
        }

        const onDelete = () => {
            admParameterService.value.delete(admParameter.value.id).then(() => {
                listaAdmParameter.value = listaAdmParameter.value.filter((val: AdmParameter) => val.id !== admParameter.value.id);
                deleteDialog.value = false;
                admParameter.value = emptyAdmParameter;
                toast.add({severity:'success', summary: 'Successful', detail: 'Parameter Deleted', life: 3000});
            });   
        };

        const exportPdf = () => {
            const head: string[] = [];
            // eslint-disable-next-line
            const data: any[] = [];

            exportColumns.value.forEach(item => head.push(item.title));
                listaAdmParameter.value.forEach(item => data.push(
                [item.id, item.admParameterCategory.description, item.code, item.value, item.description]
            ));

            exportService.value.exportPdf(head, data, 'Parameters.pdf');
        }

        const exportExcel = () => {
            exportService.value.exportExcel(listaAdmParameter.value, 'Parameters');
        }

        return { listaAdmParameter, admParameter, selectedAdmParameter, submitted, listaAdmParameterCategory, deleteDialog,
            onExport, onCancel, onInsert, onEdit, confirmDelete, hideDeleteDialog, onDelete, exportPdf, exportExcel,
            onTypeReportChange, onForceDownloadChange }
    }
}
</script>

<style>

</style>
