import { type NextPage } from "next";
import Layout from "~/components/layout/layout";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


const Home: NextPage = () => {

  return (
    <Layout initialPage="collections"/>
  );
};

export default (Home);

