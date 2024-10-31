import {
  Create,
  required,
  SimpleForm,
  TextInput,
  Validator,
} from 'react-admin';
import { noOnlySpaces } from '@/shared/validation/validation.ts';

export const UserCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput
          name="username"
          source="username"
          label="Username"
          validate={[required(), noOnlySpaces]}
        />
      </SimpleForm>
    </Create>
  );
};
