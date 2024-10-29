import {
  ArrayInput,
  Edit,
  maxLength,
  minLength,
  required,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useGetOne,
  useGetRecordId,
  useNotify,
  useRedirect,
} from 'react-admin';
import { TQuestion } from '@/entities/Question/types/question.ts';

type TQuestionEditForm = {
  body: string;
  correctAnswers: { answer: string }[];
};

export const QuestionEdit = () => {
  const id = useGetRecordId();
  const notify = useNotify();
  const redirect = useRedirect();

  const { data: question } = useGetOne<TQuestion>('questions', {
    id: id.toString(),
  });

  const initialValues = question
    ? {
        ...question,
        correctAnswers: question.correctAnswers
          ? question.correctAnswers.map((text) => ({ answer: text }))
          : [],
      }
    : {};

  const onSuccess = () => {
    notify('Question has been updated', { undoable: true });
    redirect('list', 'questions');
  };

  const transformData = (data: TQuestionEditForm) => {
    return {
      ...data,
      correctAnswers: data.correctAnswers
        .filter((item) => !!item.answer)
        .map((item) => item.answer),
    };
  };

  return (
    <Edit
      title={'Question Edit'}
      transform={transformData}
      mutationOptions={{ onSuccess }}
    >
      <SimpleForm values={initialValues} defaultValues={initialValues}>
        <TextInput
          name="body"
          source="body"
          label="Question"
          validate={[required(), minLength(10), maxLength(500)]}
        />

        <ArrayInput
          name="correctAnswers"
          source="correctAnswers"
          label="Answers"
          validate={required()}
        >
          <SimpleFormIterator>
            <TextInput validate={required()} source="answer" label="Answer" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
