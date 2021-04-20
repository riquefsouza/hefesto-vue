<template>
    <Toast></Toast>

    <Panel header="Configuration User" class="p-mb-2">
        <ReportPanel></ReportPanel>
    </Panel>

    <Toolbar class="p-mb-4">
        <template #left>
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="onExport"></Button>
        </template>

        <template #right>
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="onInsert" />
            <Button label="Edit" icon="pi pi-pencil" class="p-button-warning p-mr-2" @click="onEdit(selectedAdmUser)"
                :disabled="!selectedAdmUser || !listaAdmUser || !listaAdmUser.length"></Button>
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" @click="confirmDelete(selectedAdmUser)" 
                :disabled="!selectedAdmUser || !listaAdmUser || !listaAdmUser.length" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="onCancel"/>
        </template>
    </Toolbar>  

    <DataTable :value="listaAdmUser" v-model:selection="selectedAdmUser" selectionMode="single" :rows="10" dataKey="id" 
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
                In total there are {{listaAdmUser ? listaAdmUser.length : 0 }} users.
            </div>
        </template>

        <Column field="id" header="Id" :sortable="true" style="min-width:12rem"></Column>
        <Column field="email" header="Email" :sortable="true"></Column>
        <Column field="login" header="Login" :sortable="true"></Column>
        <Column field="name" header="Name" :sortable="true"></Column>
        <Column field="userProfiles" header="User profile(s)" :sortable="true"></Column>
        <Column field="active" header="active" :sortable="true"></Column>
    </DataTable>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="AdmUser">Are you sure you want to delete <b>{{AdmUser.description}}</b>?</span>
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

import AdmUserService from '@/admin/services/AdmUserService';
import { AdmUser, emptyAdmUser } from '@/admin/models/AdmUser';
import { ExportService } from '@/base/services/ExportService';
import { StorageService } from '@/base/services/StorageService';

export default {
    setup() {
        const admUserService = ref<AdmUserService>(new AdmUserService());
        const storageService = ref<StorageService>(new StorageService());
        const exportService = ref<ExportService>(new ExportService());
        
        const listaAdmUser = ref<AdmUser[]>([]);
        const admUser = ref<AdmUser>(emptyAdmUser);
        const selectedAdmUser = ref<AdmUser>(emptyAdmUser);
        const submitted = ref<boolean>(false);
        const toast = useToast();
        // eslint-disable-next-line
        const cols = ref<any[]>([]);
        // eslint-disable-next-line
        const exportColumns = ref<any[]>([]);
        const deleteDialog = ref<boolean>(false);

        onMounted(() => {
            admUserService.value.findAllWithProfiles().then(item => listaAdmUser.value = item);

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'email', header: 'Email' },
                { field: 'login', header: 'Login' },
                { field: 'name', header: 'Name' },
                { field: 'userProfiles', header: 'User profile(s)' },
                { field: 'active', header: 'Active' }
            ];

            exportColumns.value= cols.value.map(col => ({title: col.header, dataKey: col.field}));
        })

        const onExport = () => {
            toast.add({severity:'info', summary: 'User Exported', detail: 'Users Exported', life: 3000});
        }

        const onCancel = () => {
            router.push("/");
        }

        const onInsert = () => {
            admUser.value = emptyAdmUser;
            submitted.value = false;

            // storageService.value.setStorage(admUser);
            storageService.value.persistObj('admUser', admUser.value);
            router.push('/admUserEdit');
        };

        const onEdit = (param: AdmUser) => {
            admUser.value = {...param};

            // storageService.value.setStorage(admUser);
            storageService.value.persistObj('admUser', admUser.value);
            router.push('/admUserEdit');
        }

        const confirmDelete = (param: AdmUser) => {
            admUser.value = param;
            deleteDialog.value = true;
        }

        const hideDeleteDialog = () => {
            deleteDialog.value = false;
        }

        const onDelete = () => {
            listaAdmUser.value = listaAdmUser.value.filter((val: AdmUser) => val.id !== admUser.value.id);
            deleteDialog.value = false;
            admUser.value = emptyAdmUser;
            toast.add({severity:'success', summary: 'Successful', detail: 'User Deleted', life: 3000});
        };

        const exportPdf = () => {
            const head: string[] = [];
            // eslint-disable-next-line
            const data: any[] = [];

            exportColumns.value.forEach(item => head.push(item.title));
                listaAdmUser.value.forEach(item => data.push(
                [item.id, item.email, item.login, item.name, item.userProfiles, item.active]
            ));

            exportService.value.exportPdf(head, data, 'users.pdf');
        }

        const exportExcel = () => {
            exportService.value.exportExcel(listaAdmUser.value, 'users');
        }

        return { listaAdmUser, admUser, selectedAdmUser, submitted, deleteDialog,
            onExport, onCancel, onInsert, onEdit, confirmDelete, hideDeleteDialog, onDelete, exportPdf, exportExcel }
    }
}
</script>

<style>

</style>
