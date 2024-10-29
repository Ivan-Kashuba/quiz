import { DataProvider } from 'react-admin';
import { http } from '@/shared/lib/axios/http.ts';
import { WithPagination } from '@/shared/types/pagination.ts';
import { TQuestion } from '@/entities/Question/types/question.ts';

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { pagination, sort } = params;

    const response = await http.get<WithPagination<any>>(`sa/${resource}`, {
      params: {
        order: sort?.order,
        orderBy: sort?.field,
        pageNumber: pagination?.page,
        limit: pagination?.perPage,
      },
    });

    return {
      data: response.data.data,
      total: response.data.totalCount,
    };
  },

  getOne: async (resource, params) => {
    const response = await http.get(`sa/${resource}/${params.id}`);
    return { data: response.data };
  },

  create: async (resource, params) => {
    const response = await http.post(`sa/${resource}`, params.data);

    return { data: response.data };
  },
  update: async (resource, params) => {
    const response = await http.put(`sa/${resource}/${params.id}`, params.data);
    return { data: { id: params.id, ...response.data } };
  },
  delete: async (resource, params) => {
    const response = await http.delete(`sa/${resource}/${params.id}`);

    return { data: response.data };
  },

  async updateQuestionPublishing(questionId: string, publishStatus: boolean) {
    return await http.put<TQuestion>(`sa/questions/${questionId}/publish`, {
      published: publishStatus,
    });
  },

  async deleteMany(resource, params) {
    await http.delete(`sa/${resource}?ids=${params.ids}`);

    return { data: params.ids };
  },
};
