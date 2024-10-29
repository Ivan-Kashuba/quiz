import { Admin, Resource } from 'react-admin';
import { dataProvider } from '@/modules/Admin/api/data-provider.ts';
import { QuestionList } from '@/entities/Question/ui/QuestionsList.tsx';
import { authProvider } from '@/shared/lib/auth-provider/auth-provider.ts';
import { LoginPage } from '@/pages/LoginPage.tsx';
import { QuestionCreate } from '@/entities/Question/ui/QuestionCreate.tsx';
import { QuestionEdit } from '@/entities/Question/ui/QuestionEdit.tsx';

export const AdminApplication = () => {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      loginPage={<LoginPage />}
      defaultTheme={'dark'}
      authProvider={authProvider}
      requireAuth
    >
      <Resource
        name="questions"
        list={QuestionList}
        edit={QuestionEdit}
        create={QuestionCreate}
        hasEdit
        hasCreate
      />
    </Admin>
  );
};
