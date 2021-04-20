<template>
    <Toast></Toast>

    <Panel header="Configuration Page" class="p-mb-2">
        <ReportPanel></ReportPanel>
    </Panel>

    <Toolbar class="p-mb-4">
        <template #left>
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="onExport"></Button>
        </template>

        <template #right>
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="onInsert" />
            <Button label="Edit" icon="pi pi-pencil" class="p-button-warning p-mr-2" @click="onEdit(selectedAdmPage)"
                :disabled="!selectedAdmPage || !listaAdmPage || !listaAdmPage.length"></Button>
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" @click="confirmDelete(selectedAdmPage)" 
                :disabled="!selectedAdmPage || !listaAdmPage || !listaAdmPage.length" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="onCancel"/>
        </template>
    </Toolbar>  

    <DataTable :value="listaAdmPage" v-model:selection="selectedAdmPage" selectionMode="single" :rows="10" dataKey="id" 
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
                In total there are {{listaAdmPage ? listaAdmPage.length : 0 }} pages.
            </div>
        </template>

        <Column field="id" header="Id" :sortable="true" style="min-width:12rem"></Column>
        <Column field="url" header="Page" :sortable="true"></Column>
        <Column field="description" header="Description" :sortable="true"></Column>
        <Column field="pageProfiles" header="Page profile(s)" :sortable="true"></Column>
    </DataTable>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="AdmPage">Are you sure you want to delete <b>{{AdmPage.description}}</b>?</span>
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

import AdmPageService from '@/admin/services/AdmPageService';
import { AdmPage, emptyAdmPage } from '@/admin/models/AdmPage';
import { ExportService } from '@/base/services/ExportService';
import { StorageService } from '@/base/services/StorageService';

export default {
    setup() {
        const admPageService = ref<AdmPageService>(new AdmPageService());
        const storageService = ref<StorageService>(new StorageService());
        const exportService = ref<ExportService>(new ExportService());
        
        const listaAdmPage = ref<AdmPage[]>([]);
        const admPage = ref<AdmPage>(emptyAdmPage);
        const selectedAdmPage = ref<AdmPage>(emptyAdmPage);
        const submitted = ref<boolean>(false);
        const toast = useToast();
        // eslint-disable-next-line
        const cols = ref<any[]>([]);
        // eslint-disable-next-line
        const exportColumns = ref<any[]>([]);
        const deleteDialog = ref<boolean>(false);

        onMounted(() => {
            admPageService.value.findAllWithProfiles().then(item => listaAdmPage.value = item);

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'url', header: 'Page' },
                { field: 'description', header: 'Description' },
                { field: 'pageProfiles', header: 'Page profile(s)' }
            ];

            exportColumns.value= cols.value.map(col => ({title: col.header, dataKey: col.field}));
        })

        const onExport = () => {
            toast.add({severity:'info', summary: 'Page Exported', detail: 'Pages Exported', life: 3000});
        }

        const onCancel = () => {
            router.push("/");
        }

        const onInsert = () => {
            admPage.value = emptyAdmPage;
            submitted.value = false;

            // storageService.value.setStorage(admPage);
            storageService.value.persistObj('admPage', admPage.value);
            router.push('/admPageEdit');
        };

        const onEdit = (param: AdmPage) => {
            admPage.value = {...param};

            // storageService.value.setStorage(admPage);
            storageService.value.persistObj('admPage', admPage.value);
            router.push('/admPageEdit');
        }

        const confirmDelete = (param: AdmPage) => {
            admPage.value = param;
            deleteDialog.value = true;
        }

        const hideDeleteDialog = () => {
            deleteDialog.value = false;
        }

        const onDelete = () => {
            listaAdmPage.value = listaAdmPage.value.filter((val: AdmPage) => val.id !== admPage.value.id);
            deleteDialog.value = false;
            admPage.value = emptyAdmPage;
            toast.add({severity:'success', summary: 'Successful', detail: 'Page Deleted', life: 3000});
        };

        const exportPdf = () => {
            const head: string[] = [];
            // eslint-disable-next-line
            const data: any[] = [];

            exportColumns.value.forEach(item => head.push(item.title));
                listaAdmPage.value.forEach(item => data.push(
                [item.id, item.url, item.description, item.pageProfiles]
            ));

            exportService.value.exportPdf(head, data, 'pages.pdf');
        }

        const exportExcel = () => {
            exportService.value.exportExcel(listaAdmPage.value, 'pages');
        }

        return { listaAdmPage, admPage, selectedAdmPage, submitted, deleteDialog,
            onExport, onCancel, onInsert, onEdit, confirmDelete, hideDeleteDialog, onDelete, exportPdf, exportExcel }
    }
}
</script>

<style>

</style>
