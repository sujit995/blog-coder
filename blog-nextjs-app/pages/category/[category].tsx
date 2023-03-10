import React from 'react'
import Head from 'next/head'
import Link from 'next/link';
import Tabs from '../../components/Tabs';
import type { GetServerSideProps } from 'next';
import { IArticle, ICategory, ICollectionResponse, IPagination, IQueryOptions } from '../../types';
import { AxiosResponse } from 'axios';
import { fetchArticles, fetchCategories } from '../../http';
import qs from 'qs';
import ArticleList from '../../components/ArticleList';
import { capitalizeFirstLetter, debounce, makeCategory } from '../../utils';
import Pagination from '../../components/Pagination';
import { useRouter } from 'next/router';


interface IPropsType {
  categories: {
    items: ICategory[];
    pagination: IPagination;
  },
  articles: {
    items: IArticle[];
    pagination: IPagination;
  },
  slug: string
}
const category = ({ categories, articles, slug }: IPropsType) => {
  const { page, pageCount } = articles.pagination;
  const router = useRouter();
  const { category: categorySlug } = router.query;

  const formattedCategory = () => {
    return capitalizeFirstLetter(makeCategory(slug));
  }

  const handleSearch = (query: string) => {
    router.push(`/category/${categorySlug}/?search=${query}`);
  };

  return (
    <>
      <Head>
        <title>LazyCoder's Blog {formattedCategory()}</title>
        <meta name="description" content="generated by create next app" />
        <Link rel="icon" href="/skm.png" />
      </Head>
      <Tabs categories={categories.items} handleOnSearch={debounce(handleSearch, 500)} />
      <ArticleList articles={articles.items} />
      <Pagination
        page={page}
        pageCount={pageCount}
        redirectUrl={`/category/${categorySlug}`}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  const options: Partial<IQueryOptions> = {
    populate: ['author.avatar'],
    // sort: ['id: desc'],
    filters: {
      category: {
        slug: query.category,
      }
    },
    pagination: {
      page: query.page ? + query.page : 1,
      pageSize: 3,
    },
  }

  if (query.search) {
    options.filters = {
        Title: {
            $containsi: query.search,
        },
    };
}

  const queryString = qs.stringify(options);

  const { data: categories }: AxiosResponse<ICollectionResponse<ICategory[]>> = await fetchCategories();
  const { data: articles }: AxiosResponse<ICollectionResponse<IArticle[]>> = await fetchArticles(queryString);

  return {
    props: {
      categories: {
        items: categories.data,
        pagination: categories.meta.pagination
      },
      articles: {
        items: articles.data,
        pagination: articles.meta.pagination
      },
      slug: query.category
    }
  }
}

export default category