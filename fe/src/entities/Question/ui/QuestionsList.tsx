import {
  BooleanField,
  BooleanInput,
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  SimpleList,
  TextField,
  TextInput,
  useDataProvider,
  useNotify,
  useRefresh,
} from 'react-admin';

import { TQuestion } from '@/entities/Question/types/question.ts';
import { exporter } from '@/shared/lib/exporter/exporter.ts';
import { Block, CheckCircle } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import useMediaQuery from '@mui/material/useMediaQuery';

const questionsExporter = (questions: TQuestion[]) => {
  const formattedQuestions = questions.map((question) => ({
    ...question,
    correctAnswers: question.correctAnswers.join(', '),
  }));

  exporter(formattedQuestions);
};

const PublishButton = (question: TQuestion) => {
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      dataProvider.updateQuestionPublishing(question.id, !question.published),
    onSuccess: () => {
      notify('Publishing changed successfully', { type: 'info' });
      refresh();
    },
    onError: () => {
      notify('Something went wrong', { type: 'warning' });
    },
  });

  const handleActivate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    mutate();
  };

  return (
    <Button
      onClick={handleActivate}
      disabled={isPending}
      startIcon={question.published ? <Block /> : <CheckCircle />}
    >
      {question.published ? 'Unpublish' : 'Publish'}
    </Button>
  );
};

export const QuestionList = () => {
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const filters = [
    <TextInput label="Search" source="search" alwaysOn />,
    <BooleanInput
      label="Published"
      defaultValue={false}
      source="publishedStatus"
    />,
  ];

  return (
    <List
      exporter={questionsExporter}
      sort={{ field: 'createdAt', order: 'DESC' }}
      filters={filters}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(question: TQuestion) => question.body}
          secondaryText={(question: TQuestion) =>
            question.correctAnswers.join(', ')
          }
          tertiaryText={(record: TQuestion) => <PublishButton {...record} />}
        />
      ) : (
        <Datagrid>
          <TextField source="body" />
          <BooleanField source="published" />
          <TextField source="correctAnswers" />
          <DateField source="createdAt" />
          <DateField source="updatedAt" />
          <FunctionField
            render={(question) => <PublishButton {...question} />}
          />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};
