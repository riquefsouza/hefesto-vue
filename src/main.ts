import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Panel from 'primevue/panel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Tree from 'primevue/tree';
import PickList from 'primevue/picklist';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import ReportPanel from './base/components/ReportPanel.vue';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);

app.use(PrimeVue);
app.use(router);
app.use(ToastService);

app.component('Panel', Panel);
app.component('InputText', InputText);
app.component('Button', Button);
app.component('Menubar', Menubar);
app.component('Textarea', Textarea);
app.component('InputNumber', InputNumber);
app.component('Toolbar', Toolbar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('Tree', Tree);
app.component('PickList', PickList);
app.component('Password', Password);
app.component('Toast', Toast);
app.component('ReportPanel', ReportPanel);

app.mount('#app');
