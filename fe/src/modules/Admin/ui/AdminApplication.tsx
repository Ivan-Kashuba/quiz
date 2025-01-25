import { Admin, Resource } from 'react-admin';
import { dataProvider } from '@/modules/Admin/api/data-provider.ts';
import { QuestionList } from '@/entities/Question/ui/QuestionsList.tsx';
import { authProvider } from '@/shared/lib/auth-provider/auth-provider.ts';
import { AdminLoginPage } from '@/pages/AdminLoginPage.tsx';
import { QuestionCreate } from '@/entities/Question/ui/QuestionCreate.tsx';
import { QuestionEdit } from '@/entities/Question/ui/QuestionEdit.tsx';
import { UsersList } from '@/entities/User/ui/UsersList.tsx';
import { UserCreate } from '@/entities/User/ui/UserCreate.tsx';
import { LucideFileQuestion, UserIcon } from 'lucide-react';
import { createStyledIcon } from '@/modules/Admin/utils/icons.tsx';

export const AdminApplication = () => {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      loginPage={<AdminLoginPage />}
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
        icon={createStyledIcon(LucideFileQuestion, 'questions')}
      />

      <Resource
        name="users"
        list={UsersList}
        create={UserCreate}
        hasCreate
        hasEdit={false}
        icon={createStyledIcon(UserIcon, 'users')}
      />
    </Admin>
  );
};
