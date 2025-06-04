import { notFound } from 'next/navigation';
import { slugToPageKey } from '@/lib/i18nSlugMap';
import AboutPage from '@/multilangpags/AboutPage';
// import ContactPage from '@/components/pages/ContactPage';
// import other shared components...

export default function Page({ params }) {

  //! here i need to fetch the page data based on the slug and lang
  // -> see what page component it is  (frm its schema taht is saved in db)
  // -> render it and pass data as props 


  const { lang, slug } = params;
  const pageKey = slugToPageKey[lang]?.[slug];

  if (!pageKey) notFound();

  const PageComponent = pagesByKey[pageKey];
  if (!PageComponent) notFound();

  return <PageComponent lang={lang} />;
}

const pagesByKey = {
  about: AboutPage,
  //contact: ContactPage,
  // add more internal keys
};
