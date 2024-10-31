import { DataProvider } from 'react-admin';
import { http } from '@/shared/lib/axios/http.ts';
import { WithPagination } from '@/shared/types/pagination.ts';
import { TQuestion } from '@/entities/Question/types/question.ts';

const getApiPrefix = (resource: string) =>
  resource === 'questions' ? 'sa' : '';

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const apiPrefix = getApiPrefix(resource);

    const { pagination, sort } = params;

    const response = await http.get<WithPagination<any>>(
      `${apiPrefix}/${resource}`,
      {
        params: {
          order: sort?.order,
          orderBy: sort?.field,
          pageNumber: pagination?.page,
          limit: pagination?.perPage,
        },
      }
    );

    return {
      data: response.data.data,
      total: response.data.totalCount,
    };
  },

  getOne: async (resource, params) => {
    const apiPrefix = getApiPrefix(resource);

    const response = await http.get(`${apiPrefix}/${resource}/${params.id}`);
    return { data: response.data };
  },

  create: async (resource, params) => {
    const apiPrefix = getApiPrefix(resource);

    const response = await http.post(`${apiPrefix}/${resource}`, params.data);

    return { data: response.data };
  },

  update: async (resource, params) => {
    const apiPrefix = getApiPrefix(resource);
    const response = await http.put(
      `${apiPrefix}/${resource}/${params.id}`,
      params.data
    );
    return { data: { id: params.id, ...response.data } };
  },

  delete: async (resource, params) => {
    const apiPrefix = getApiPrefix(resource);
    const response = await http.delete(`${apiPrefix}/${resource}/${params.id}`);

    return { data: response.data };
  },

  async updateQuestionPublishing(questionId: string, publishStatus: boolean) {
    return await http.put<TQuestion>(`sa/questions/${questionId}/publish`, {
      published: publishStatus,
    });
  },

  async deleteMany(resource, params) {
    const apiPrefix = getApiPrefix(resource);
    await http.delete(`${apiPrefix}/${resource}?ids=${params.ids}`);

    return { data: params.ids };
  },
};
