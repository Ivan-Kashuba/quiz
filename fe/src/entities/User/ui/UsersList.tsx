import { Datagrid, DateField, List, SimpleList, TextField } from 'react-admin';
import { exporter } from '@/shared/lib/exporter/exporter.ts';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TUser } from '@/entities/User/types/user.ts';

const questionsExporter = (users: TUser[]) => {
  exporter(users);
};

export const UsersList = () => {
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <List exporter={questionsExporter}>
      {isSmall ? (
        <SimpleList
          primaryText={(user: TUser) => user.username}
          secondaryText={(user: TUser) => user.code}
        />
      ) : (
        <Datagrid>
          <TextField source="username" />
          <TextField source="code" />
          <DateField source="createdAt" />
          <DateField source="updatedAt" />
        </Datagrid>
      )}
    </List>
  );
};
