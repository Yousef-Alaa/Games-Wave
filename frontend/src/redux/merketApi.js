import Cookies from 'js-cookie'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";

export const marketApi = createApi({
    reducerPath: 'marketApi',
    tagTypes: ['market'],
    baseQuery: fetchBaseQuery({ 
        baseUrl: API_URL,
        prepareHeaders: headers => {
            const token = Cookies.get('token')
        
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
        
            return headers
        }
    }),
    endpoints: builder => ({
        getAllItems: builder.query({
            query: _ => '/market',
            providesTags: ['market']
        }),
        addItem: builder.mutation({
            query: item => ({
                url: '/market',
                method: 'POST',
                body: item
            }),
            invalidatesTags: ['market']
        }),
        editItem: builder.mutation({
            query: ({ id, item }) => ({
                url: `/market/${id}`,
                method: 'PUT',
                body: item
            }),
            invalidatesTags: ['market']
        }),
        editItems: builder.mutation({
            query: updatedItems => ({
                url: `/market/update`,
                method: 'PUT',
                body: {updatedItems}
            }),
            invalidatesTags: ['market']
        }),
        deleteItems: builder.mutation({
            query: itemsIds => ({
                url: '/market',
                method: 'DELETE',
                body: { deletedItemsIds: itemsIds },
            }),
            invalidatesTags: ['market']
        })
    }),
})


export const { useGetAllItemsQuery, useAddItemMutation, useEditItemMutation, useEditItemsMutation, useDeleteItemsMutation } = marketApi