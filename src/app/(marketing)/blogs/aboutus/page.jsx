import { fetchPageData, getFieldValue } from '@/lib/pageData';

export default async function AboutUs({ params }) {
    let langslug = await params.lang;

    const { error: fetchError, fields } = await fetchPageData('aboutus', langslug);
    const showerror = !!fetchError;
    const fieldsdata = fields;
    //console.log(fieldsdata, 'fieldatafieldata');
    //console.log('hellohello from homepage.jsx');

    return (
        <div>

            {showerror && (
                <div className="flex flex-col items-center justify-center min-h-screen py-2">
                    <h1 className="text-4xl font-bold mb-4">Error</h1>
                    <p className="text-lg text-red-600">Page not found or an error occurred.</p>
                </div>
            )}
            {!showerror && (
                <>
                    <h1>{getFieldValue(fields, "title")} - Page</h1>
                    <p>{getFieldValue(fields, "summary")}</p>
                </>
            )}
        </div>
    );
}
