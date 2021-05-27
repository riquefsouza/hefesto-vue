<template>
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-4">
            <label for="cmbTypeReport">Choose the type of report:</label>
            <Dropdown id="cmbTypeReport" v-model="selectedTypeReport" :options="typeReport"
                optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" 
                @change="$emit('changeTypeReport', { pTypeReport: selectedTypeReport })">
            </Dropdown>
        </div>
        <div class="p-field p-col-12 p-md-4">
            <label for="forceDownload" style="margin: 4px;">Force Download:</label>
            <Checkbox id="forceDownload" v-model="selectedForceDownload" :binary="true" 
                @change="$emit('changeForceDownload', { forceDownload: selectedForceDownload })">
            </Checkbox>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { PDFReport, ReportService, SelectItemGroup } from '@/base/services/ReportService';

export default {
    setup() {
        const reportService = ref<ReportService>(new ReportService());
        const typeReport = ref<SelectItemGroup[]>();
        const selectedTypeReport = ref<SelectItemGroup>();
        const selectedForceDownload = ref<boolean>(true);

        onMounted(() => {
            typeReport.value = reportService.value.getTypeReport();
            selectedTypeReport.value = PDFReport;
            selectedForceDownload.value = true;            
        })

        return { reportService, typeReport, selectedTypeReport, selectedForceDownload }
    }
}
</script>
