<template>
    <div>
        <Toast></Toast>

        <Panel header="Configuration User" class="p-mb-2">
            <div class="p-grid p-justify-end">
                <Button label="Save" icon="pi pi-check" class="p-button-success p-mr-2" @click="onSave"></Button>
                <Button label="Clean" icon="pi pi-star-o" class="p-button-primary p-mr-2" @click="onClean"></Button>
                <Button label="Cancel" icon="pi pi-times" class="p-button-secondary p-mr-2" @click="onCancel"></Button>
            </div>
            <div class="p-fluid p-formgrid">
                <div class="p-col-10">
                    <p>As minimum requirements for user passwords, the following should be considered:</p>
                    <ul>
                        <li>Minimum length of 8 characters;</li>
                        <li>Presence of at least 3 of the 4 character classes below:
                            <ul>
                                <li>uppercase characters;</li>
                                <li>lowercase characters;</li>
                                <li>numbers;</li>
                                <li>special characters;</li>
                                <li>Absence of strings (eg: 1234) or consecutive identical characters (yyyy);</li>
                                <li>Absence of any username identifier, such as: John Silva - user: john.silva - password cannot contain "john" or "silva".</li>
                            </ul>
                        </li>
                    </ul>
                </div>	
                <div class="p-field p-lg-4 p-md-6 p-sm-12">
                    <label for="currentPassword">Current password:</label>
                    <Password id="currentPassword" v-model="admUser.currentPassword" required="true" :feedback="false" maxlength="10"
                    :class="{'p-invalid': submitted && !admUser.currentPassword}" />
                    <small class="p-error" v-if="submitted && !admUser.currentPassword">Current password is required.</small>
                </div>
                <div class="p-field p-lg-4 p-md-6 p-sm-12">
                    <label for="newPassword">New password:</label>
                    <Password id="newPassword" v-model="admUser.newPassword" required="true" :feedback="false" maxlength="10"
                    :class="{'p-invalid': submitted && !admUser.newPassword}" />
                    <small class="p-error" v-if="submitted && !admUser.newPassword">New password is required.</small>
                </div>
                <div class="p-field p-lg-4 p-md-6 p-sm-12">
                    <label for="confirmNewPassword">Confirm new password:</label>
                    <Password id="confirmNewPassword" v-model="admUser.confirmNewPassword" required="true" :feedback="false" maxlength="10"
                    :class="{'p-invalid': submitted && !admUser.confirmNewPassword}" />
                    <small class="p-error" v-if="submitted && !admUser.confirmNewPassword">Confirm New password is required.</small>
                </div>
            </div>                    
        </Panel>
        <br/>
        <br/>
        <br/>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';
import { useToast } from 'primevue/usetoast';

import { AdmUser, cleanAdmUser, emptyAdmUser } from '@/admin/models/AdmUser';
import ChangePasswordService from '@/admin/services/ChangePasswordService';

export default {
    setup() {
        const changePasswordService = ref<ChangePasswordService>(new ChangePasswordService());
        
        const admUser = ref<AdmUser>(emptyAdmUser);
        const submitted = ref<boolean>(false);
        const toast = useToast();

        const onClean = () => {
            admUser.value = {...cleanAdmUser};
        }

        onMounted(() => {
            onClean();
        })

        const onCancel = () => {
            router.push('/');
        }

        const onSave = () => {
            submitted.value = true;

            if (admUser.value.newPassword !== admUser.value.confirmNewPassword) {
                toast.add({ severity: 'error', summary: 'Error',
                    detail: 'New password and confirm password do not match!', life: 3000
                });
            } else {

                if (!changePasswordService.value.validatePassword(admUser.value.email, admUser.value.currentPassword)) {
                    toast.add({ severity: 'error', summary: 'Error',
                        detail: 'The current password does not meet the security criteria.', life: 3000
                    });
                    return;
                }

                if (!changePasswordService.value.validatePassword(admUser.value.email, admUser.value.newPassword)) {
                    toast.add({ severity: 'error', summary: 'Error',
                        detail: 'The new password does not meet the security criteria.', life: 3000
                    });
                    return;
                }

                if (changePasswordService.value.updatePassword(admUser.value.newPassword)) {
                    toast.add({ severity: 'success', summary: 'Successful',
                        detail: 'Password changed successfully!', life: 3000
                    });
                }
            }

        }

        return { admUser, submitted, onClean, onCancel, onSave }
    }
}
</script>

<style>

</style>
