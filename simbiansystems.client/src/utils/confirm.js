import Swal from 'sweetalert2';
const ask = (title, text, confirmButtonText) => Swal.fire({ title, text, icon: 'warning', showCancelButton: true, confirmButtonColor: '#004A7C', confirmButtonText, cancelButtonText: 'Cancel' }).then((r) => r.isConfirmed);
export const confirmDelete = (name = 'this item') => ask('Delete?', `This permanently removes ${name}.`, 'Delete');
export const confirmLogout = () => ask('Log out?', 'You will need to sign in again.', 'Log out');
export const confirmPublish = (publish = true) => ask(publish ? 'Publish selected items?' : 'Unpublish selected items?', '', publish ? 'Publish' : 'Unpublish');
