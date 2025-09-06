'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import '../../../categories.css';
import WordsTable from '../../../wordsshowsubsubtable'

export default function SubSubCategory() {
    const { category1, subcategory, subsubcategory } = useParams();
    const [groupedWords, setGroupedWords] = useState({});
    const tableRefs = useRef({});
    const sortablesRef = useRef({});

    return (
        <WordsTable category1={category1} subcategory={subcategory} subsubcategory={subsubcategory}></WordsTable>
    )

}
