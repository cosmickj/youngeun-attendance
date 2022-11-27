import '@/styles/normalize.css';
import '@/styles/global.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import '@/index.css'; // Tailwind CSS
import 'animate.css';

import router from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '@/App.vue';

import PrimeVue from 'primevue/config';
import VueCookies from 'vue-cookies';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import SelectButton from 'primevue/selectbutton';
import Tree from 'primevue/tree';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(VueCookies);
app.use(PrimeVue);

import { getCurrentUser } from '@/router';
import { useAccountStore } from './store/account';
import type { User } from 'firebase/auth/dist/auth';
import type { UserData } from '@/types/store';

// Waiting for Auth to be Ready
(async () => {
  const accountStore = useAccountStore();
  const currentUser = (await getCurrentUser()) as User;
  if (currentUser) {
    const result = (await accountStore.fetchUser({
      uid: currentUser.uid,
    })) as UserData;
    accountStore.userData = {
      uid: currentUser.uid,
      email: currentUser.email!,
      displayName: currentUser.displayName!,
      ...result,
    };
  }
  accountStore.isAuthReady = true;
})();

app
  .component('Button', Button)
  .component('Card', Card)
  .component('Calendar', Calendar)
  .component('Checkbox', Checkbox)
  .component('Column', Column)
  .component('DataTable', DataTable)
  .component('Dialog', Dialog)
  .component('Dropdown', Dropdown)
  .component('FileUpload', FileUpload)
  .component('InputMask', InputMask)
  .component('InputText', InputText)
  .component('InputSwitch', InputSwitch)
  .component('MultiSelect', MultiSelect)
  .component('Password', Password)
  .component('RadioButton', RadioButton)
  .component('SelectButton', SelectButton)
  .component('Tree', Tree);

app.mount('#app');
