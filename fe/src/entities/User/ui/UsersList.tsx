import {
  Datagrid,
  DateField,
  List,
  SimpleList,
  TextField,
  TextInput,
} from 'react-admin';
import { exporter } from '@/shared/lib/exporter/exporter.ts';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TUser } from '@/entities/User/types/user.ts';

const questionsExporter = (users: TUser[]) => {
  exporter(users);
};

export const UsersList = () => {
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const filters = [<TextInput label="Search" source="search" alwaysOn />];

  return (
    <List
      exporter={questionsExporter}
      sort={{ field: 'createdAt', order: 'DESC' }}
      filters={filters}
    >
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
