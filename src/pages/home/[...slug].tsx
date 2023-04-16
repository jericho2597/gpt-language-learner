import { type NextPage } from "next";
import Layout from "~/components/layout/layout";
import { useRouter } from 'next/router';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


const Home: NextPage = () => {

  const router = useRouter()
  const { slug } = router.query;

  if(slug){
    return (
      <Layout initialPage={slug as string || "collections"}/>
    );
  }

  return <h1>Loading...</h1>
};

export default (Home);