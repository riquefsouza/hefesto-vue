<template>
    <BarraMenu></BarraMenu>
    <Toast></Toast>

    <Panel header="Menu" class="p-mb-2">
        <ReportPanel @changeTypeReport="onTypeReportChange" @changeForceDownload="onForceDownloadChange"></ReportPanel>
    </Panel>

    <Toolbar class="p-mb-4">
        <template #left>
            <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="onExport"></Button>
        </template>

        <template #right>
            <Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="onInsert" />
            <Button label="Edit" icon="pi pi-pencil" class="p-button-warning p-mr-2" @click="onEdit(selectedAdmMenu)"
                :disabled="!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length"></Button>
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger p-mr-2" @click="confirmDelete(selectedAdmMenu)" 
                :disabled="!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="onCancel"/>
        </template>
    </Toolbar>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="admMenu">Are you sure you want to delete <b>{{admMenu.description}}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDeleteDialog()"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="onDelete()" />
        </template>
    </Dialog>

    <Tree :value="listaNodeMenu" selectionMode="single" v-model:selectionKeys="selectedNodeMenu" :metaKeySelection="false"
        @nodeSelect="onNodeSelect" />

    <Dialog v-model:visible="admMenuDialog" :style="{width: '450px'}" header="Menu Details" :modal="true" class="p-fluid">
        <div className="p-field">
            <label htmlFor="cmbAdmPage">Page:</label>
            <Dropdown id="cmbAdmPage" v-model="admMenu.admPage" :options="listaAdmPage" optionLabel="description" />
        </div>
        <div className="p-field">
            <label htmlFor="description">Menu name:</label>
            <InputText id="description" v-model="admMenu.description" required="true"
             :class="{'p-invalid': submitted && !admMenu.description}" />
            <small class="p-error" v-if="submitted && !admMenu.description">Description is required.</small> 
        </div>
        <div className="p-field">
            <label htmlFor="admMenuParent">Parent menu:</label>
            <Dropdown id="admMenuParent" v-model="admMenu.admMenuParent" :options="listaAdmMenuParent" optionLabel="description" />
        </div>
        <div className="p-field">
            <label htmlFor="order">Order</label>
            <InputNumber id="order" v-model="admMenu.order" integeronly required="true"
             :class="{'p-invalid': submitted && !admMenu.order}" />
            <small class="p-error" v-if="submitted && !admMenu.order">Order is required.</small> 
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="onSave" />
        </template>
    </Dialog>    

</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';
import AdmMenuService from '@/admin/services/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '@/admin/models/AdmMenu';
import AdmPageService from '@/admin/services/AdmPageService';
import { AdmPage } from '@/admin/models/AdmPage';
import TreeNode from '@/base/models/TreeNode';
import { emptyTreeNode } from '@/base/models/NodeOnSelectEventType';
import { ItypeReport, PDFReport, SelectItemGroup } from '@/base/services/ReportService';
import { ReportParamForm, emptyReportParamForm } from '@/base/models/ReportParamsForm';

export default {
    setup() {
        const admMenuService = ref<AdmMenuService>(new AdmMenuService());
        const admPageService = ref<AdmPageService>(new AdmPageService());
        
        const listaAdmMenu = ref<AdmMenu[]>([]);
        const admMenu = ref<AdmMenu>(emptyAdmMenu);
        const selectedAdmMenu = ref<AdmMenu>(emptyAdmMenu);
        const submitted = ref<boolean>(false);
        const admMenuDialog = ref<boolean>(false);
        const listaNodeMenu = ref<TreeNode[]>([]);
        const selectedNodeMenu = ref<TreeNode>(emptyTreeNode);
        const listaAdmPage = ref<AdmPage[]>([]);
        const listaAdmMenuParent = ref<AdmMenu[]>([]);
        const toast = useToast();
        const deleteDialog = ref<boolean>(false);
        // eslint-disable-next-line
        const cols = ref<any[]>([]);
        // eslint-disable-next-line
        const exportColumns = ref<any[]>([]);

        const selectedTypeReport = ref<ItypeReport>();
        const selectedForceDownload = ref(true);
        const reportParamForm = ref<ReportParamForm>(emptyReportParamForm);

        const isSubMenu = (menu: AdmMenu): boolean => {
            return menu.idPage === null;
        }

        const getAdmSubMenus = (listaMenu: AdmMenu[], menuPai: AdmMenu): AdmMenu[] => {
            return listaMenu.filter(menu => menu.idMenuParent === menuPai.id);
        }

        const mountSubMenu = (listaMenu: AdmMenu[], menu: AdmMenu): TreeNode[] => {
            const lstSubMenu: TreeNode[] = [];

            getAdmSubMenus(listaMenu, menu).forEach((subMenu: AdmMenu) => {
            
                if (isSubMenu(subMenu)) {
                    /*
                    const m: TreeNode = {
                        'key' : subMenu.id,
                        'label': subMenu.description,
                        'data': subMenu,
                        'children': mountSubMenu(listaMenu, subMenu)
                    };
                    */
                } else {
                    const m: TreeNode = {
                        'key' : subMenu.id,
                        'label': subMenu.description,
                        'data': subMenu,
                        'children': []
                    };
                    lstSubMenu.push(m);
                }

            });

            return lstSubMenu;
        }

        const updateMenusTree = (listaMenu: AdmMenu[]): void => {
            const _listaNodeMenu: TreeNode[] = [];
            let _listaAdmMenuParent: AdmMenu[] = [];
            const menuRoot: TreeNode = {
                'key': 0,
                'label': 'System Menu',
                'data': '0',
                'children': []
            };

            _listaAdmMenuParent = listaMenu.filter(menu => menu.idMenuParent == null);    

            _listaAdmMenuParent.forEach((itemMenu: AdmMenu) => {
                const m: TreeNode = {
                    'key' : itemMenu.id,
                    'label': itemMenu.description,
                    'data': itemMenu,
                    'children': mountSubMenu(listaMenu, itemMenu)
                };
                menuRoot.children.push(m);
            });

            _listaNodeMenu.push(menuRoot);

            listaNodeMenu.value = _listaNodeMenu;
        }

        onMounted(() => {
            admPageService.value.findAll().then(item => listaAdmPage.value = item);

            admMenuService.value
                .findAll()
                .then(lista => {
                    listaAdmMenu.value = lista;

                    listaAdmMenuParent.value = lista.filter(menu => menu.idMenuParent == null);

                    updateMenusTree(lista);
                });

            cols.value = [
                { field: 'id', header: 'Id' },
                { field: 'description', header: 'Description' }
            ];

            exportColumns.value= cols.value.map(col => ({title: col.header, dataKey: col.field}));

            selectedTypeReport.value = PDFReport.value;
        })

        const onNodeSelect = (node: TreeNode) => {
            const _menu: AdmMenu = node.data as AdmMenu;
            selectedAdmMenu.value = _menu;
        }

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
            admMenuService.value.report(reportParamForm.value).then(() => {
                toast.add({ severity: 'info', summary: 'Menu Exported', detail: 'Menu Exported', life: 3000 });
            });
        }

        const onCancel = () => {
            router.push("/home");
        }

        const onInsert = () => {
            admMenu.value = emptyAdmMenu;
            submitted.value = false;
            admMenuDialog.value = true;
        };

        const onEdit = (param: AdmMenu) => {
            admMenu.value = {...param};
            admMenuDialog.value = true;
        }

        const confirmDelete = (param: AdmMenu) => {
            admMenu.value = param;
            deleteDialog.value = true;
        }

        const hideDialog = () => {
            admMenuDialog.value = false;
            submitted.value = false;
        }

        const hideDeleteDialog = () => {
            deleteDialog.value = false;
        }

        const onDelete = () => {
            admMenuService.value.delete(admMenu.value.id).then(() => {
                listaAdmMenu.value = listaAdmMenu.value.filter((val: AdmMenu) => val.id !== admMenu.value.id);
                deleteDialog.value = false;
                admMenu.value = emptyAdmMenu;
                updateMenusTree(listaAdmMenu.value);
                toast.add({severity:'success', summary: 'Successful', detail: 'Menu Deleted', life: 3000});
            });
        };

        const onSave = () => {
            submitted.value = true;

			if (admMenu.value.description.trim()) {
                if (admMenu.value.id) {
                    admMenuService.value.update(admMenu.value).then((obj: AdmMenu) => {
                        admMenu.value = obj;

                        listaAdmMenu.value[admMenuService.value
                            .findIndexById(listaAdmMenu.value, admMenu.value.id)] = admMenu.value;
                        toast.add({severity:'success', summary: 'Successful', detail: 'Menu Updated', life: 3000});
                    });
                }
                else {
                    admMenuService.value.insert(admMenu.value).then((obj: AdmMenu) => {
                        admMenu.value = obj;

                        admMenu.value.id = listaAdmMenu.value.length + 1;
                        listaAdmMenu.value.push(admMenu.value);
                        toast.add({severity:'success', summary: 'Successful', detail: 'Menu Created', life: 3000});
                    });
                }

                admMenuDialog.value = false;
                admMenu.value = emptyAdmMenu;
                updateMenusTree(listaAdmMenu.value);
            }

        }

        return { listaAdmMenu, admMenu, selectedAdmMenu, submitted, admMenuDialog, listaNodeMenu, selectedNodeMenu, 
            listaAdmPage, listaAdmMenuParent, deleteDialog, hideDialog,
            onNodeSelect, onExport, onCancel, onInsert, onEdit, confirmDelete, hideDeleteDialog, onDelete, onSave,
            onTypeReportChange, onForceDownloadChange }
    }
}
</script>

<style>

</style>
