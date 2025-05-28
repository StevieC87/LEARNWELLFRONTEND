'use client';

import dynamic from 'next/dynamic';
const SummernoteEditor = dynamic(() => import('./SummernoteEditor'), { ssr: false });

export default function EditPost(props) {

  const { key, name, value, id, locale, schema, type } = props;
  console.log(value, "value in EditPostEditPostEditPostEditPost");
  return (
    <div>
      <h2>Edit Post</h2>
      <SummernoteEditor key={name} name={name} value={value} id={id} locale={locale} schema={schema} type={type} />
    </div>
  );
}
