import {
  ArrayInput,
  Create,
  maxLength,
  minLength,
  required,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useNotify,
  useRedirect,
} from 'react-admin';
import { dataProvider } from '@/modules/Admin/api/data-provider.ts';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { noOnlySpaces } from '@/shared/validation/validation.ts';

type TQuestionCreateForm = {
  body: string;
  correctAnswers: { answer: string }[];
};

export const QuestionCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data: TQuestionCreateForm) => {
    try {
      const transformedData = {
        ...data,
        correctAnswers: data.correctAnswers
          .filter((item) => !!item.answer)
          .map((item) => item.answer),
      };

      const response = await dataProvider.create('questions', {
        data: transformedData,
      });

      redirect('list', 'questions');
      notify('Question has been created successfully');
      return response;
    } catch (err: any) {
      notify(`Error: ${err.message}`, { type: 'warning' });
    }
  };

  return (
    <Create>
      <SimpleForm onSubmit={handleSubmit as SubmitHandler<FieldValues>}>
        <TextInput
          name="body"
          source="body"
          label="Question"
          validate={[required(), minLength(10), maxLength(500), noOnlySpaces]}
        />
        <ArrayInput
          name="correctAnswers"
          source="correctAnswers"
          label="Answers"
          validate={required()}
          defaultValue={[{ answer: '' }]}
        >
          <SimpleFormIterator>
            <TextInput
              validate={(required(), noOnlySpaces)}
              source="answer"
              label="Answer"
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};
