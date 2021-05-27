<template>
    <BarraMenu></BarraMenu>
    <Toast></Toast>

    <Panel header="Configuration Profile" class="p-mb-2">
        <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
    </Panel>

    <Toolbar class="p-mb-4">
        <template #left>
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="onExport"></Button>
        </template>

        <template #right>
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="onInsert" />
            <Button label="Edit" icon="pi pi-pencil" class="p-button-warning p-mr-2" @click="onEdit(selectedAdmProfile)"
                :disabled="!selectedAdmProfile || !listaAdmProfile || !listaAdmProfile.length"></Button>
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" @click="confirmDelete(selectedAdmProfile)" 
                :disabled="!selectedAdmProfile || !listaAdmProfile || !listaAdmProfile.length" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="onCancel"/>
        </template>
    </Toolbar>  

    <DataTable :value="listaAdmProfile" v-model:selection="selectedAdmProfile" selectionMode="single" :rows="10" dataKey="id" 
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
                In total there are {{listaAdmProfile ? listaAdmProfile.length : 0 }} pages.
            </div>
        </template>

        <Column field="id" header="Id" :sortable="true" style="min-width:12rem"></Column>
        <Column field="description" header="Description" :sortable="true"></Column>
        <Column field="profileUsers" header="User(s)" :sortable="true"></Column>
    </DataTable>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="AdmProfile">Are you sure you want to delete <b>{{AdmProfile.description}}</b>?</span>
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

import AdmProfileService from '@/admin/services/AdmProfileService';
import { AdmProfile, emptyAdmProfile } from '@/admin/models/AdmProfile';
import { ExportService } from '@/base/services/ExportService';
import { StorageService } from '@/base/services/StorageService';
import { ItypeReport, PDFReport, SelectItemGroup } from '@/base/services/ReportService';
import { ReportParamForm, emptyReportParamForm } from '@/base/models/ReportParamsForm';

export default {
    setup() {
        const admProfileService = ref<AdmProfileService>(new AdmProfileService());
        const storageService = ref<StorageService>(new StorageService());
        const exportService = ref<ExportService>(new ExportService());
        
        const listaAdmProfile = ref<AdmProfile[]>([]);
        const admProfile = ref<AdmProfile>(emptyAdmProfile);
        const selectedAdmProfile = ref<AdmProfile>(emptyAdmProfile);
        const submitted = ref<boolean>(false);
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
            admProfileService.value.findAll().then(item => listaAdmProfile.value = item);

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'description', header: 'Description' },
                { field: 'profileUsers', header: 'User(s)' }
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
            admProfileService.value.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Profile Exported', detail: 'Profile Exported', life: 3000 });
            });
        }

        const onCancel = () => {
            router.push("/");
        }

        const onInsert = () => {
            admProfile.value = emptyAdmProfile;
            submitted.value = false;

            // storageService.value.setStorage(admProfile.value);
            storageService.value.persistObj('admProfile', admProfile.value);
            router.push('/admProfileEdit');
        };

        const onEdit = (param: AdmProfile) => {
            admProfile.value = {...param};

            // storageService.value.setStorage(admProfile.value);
            storageService.value.persistObj('admProfile', admProfile.value);
            router.push('/admProfileEdit');
        }

        const confirmDelete = (param: AdmProfile) => {
            admProfile.value = param;
            deleteDialog.value = true;
        }

        const hideDeleteDialog = () => {
            deleteDialog.value = false;
        }

        const onDelete = () => {
            admProfileService.value.delete(admProfile.value.id).then(() => {
                listaAdmProfile.value = listaAdmProfile.value.filter((val: AdmProfile) => val.id !== admProfile.value.id);
                deleteDialog.value = false;
                admProfile.value = emptyAdmProfile;
                toast.add({severity:'success', summary: 'Successful', detail: 'Page Deleted', life: 3000});
            });   
        };

        const exportPdf = () => {
            const head: string[] = [];
            // eslint-disable-next-line
            const data: any[] = [];

            exportColumns.value.forEach(item => head.push(item.title));
                listaAdmProfile.value.forEach(item => data.push(
                [item.id, item.description, item.profileUsers]
            ));

            exportService.value.exportPdf(head, data, 'profiles.pdf');
        }

        const exportExcel = () => {
            exportService.value.exportExcel(listaAdmProfile.value, 'profiles');
        }

        return { listaAdmProfile, admProfile, selectedAdmProfile, submitted, deleteDialog,
            onExport, onCancel, onInsert, onEdit, confirmDelete, hideDeleteDialog, onDelete, exportPdf, exportExcel,
            onTypeReportChange, onForceDownloadChange }
    }
}
</script>

<style>

</style>
