import { AxiosResponse } from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head'
import ArticleList from '../components/ArticleList';
import Tabs from '../components/Tabs';
import { fetchArticles, fetchCategories } from '../http';
import { IArticle, ICategory, ICollectionResponse } from '../types';
import qs from 'qs';

interface IPropTypes {
  categories: {
    items: ICategory[];
  };
  articles: {
    items: IArticle[]
  }
}

const Home: NextPage<IPropTypes> = ({ categories, articles }) => {

  console.log('categories', categories);

  return (
    <>
      <Head>
        <title>Next app</title>
      </Head>
      <Tabs categories={categories.items} />
      <ArticleList articles={articles.items} />
    </>
  )
};

export const getServerSideProps: GetServerSideProps = async () => {

  const options = {
    populate: ['author.avatar'],
    // sort: ['id.desc'],
  };

  const queryString = qs.stringify(options);

  // categories
  const { data: categories }: AxiosResponse<ICollectionResponse<ICategory[]>> = await fetchCategories();
  const { data: articles }: AxiosResponse<ICollectionResponse<IArticle[]>> = await fetchArticles(queryString);

  console.log(JSON.stringify(queryString))

  return {
    props: {
      categories: {
        items: categories.data
      },
      articles: {
        items: articles.data,
        pagination: articles.meta.pagination,
      }
    }
  }
}

export default Home;
