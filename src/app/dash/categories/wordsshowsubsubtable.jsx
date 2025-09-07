'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useParams } from 'next/navigation';
import './categories.css';

export default function WordsTable(props) {
    const { category1 = '', subcategory = '', subsubcategory = '', subsubsubcategory = '', subsubsubsubcategory = '' } = props;
    const [groupedWords, setGroupedWords] = useState({});
    const [words, setWords] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null); // Track the row being edited
    const [editedWord, setEditedWord] = useState({});
    const tableRef = useRef(null);
    const sortableRef = useRef(null);

    const handleDragEnd = useCallback((evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

        setWords((prevWords) => {
            const updatedWords = [...prevWords];
            const [movedWord] = updatedWords.splice(oldIndex, 1);
            updatedWords.splice(newIndex, 0, movedWord);

            const reorderedWords = updatedWords.map((word, index) => ({
                ...word,
                order_number: index + 1,
            }));

            updateOrderInBackend(reorderedWords);
            return reorderedWords;
        });
    }, []);

    const updateOrderInBackend = async (updatedWords) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updatedWords }),
            });
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    useEffect(() => {
        if (tableRef.current) {
            sortableRef.current = Sortable.create(tableRef.current, {
                animation: 150,
                draggable: 'tr.sortable-row',
                onEnd: handleDragEnd,
                axis: 'y',
            });
        }

        return () => {
            sortableRef.current?.destroy();
            sortableRef.current = null;
        };
    }, [handleDragEnd]);

    useEffect(() => {
        const fetchspecificsubcatwords = async () => {
            const subcategoryURLENCODE = encodeURIComponent(subcategory);
            const subsubcategoryURLENCODE = encodeURIComponent(subsubcategory);
            const subsubsubcategoryURLENCODE = encodeURIComponent(subsubsubcategory);
            const subsubsubsubcategoryURLENCODE = encodeURIComponent(subsubsubsubcategory);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/fetchspecificwords?category1=${category1}&subcategory=${subcategoryURLENCODE}&subsubcategory=${subsubcategoryURLENCODE}&subsubsubcategory=${subsubsubcategoryURLENCODE}&subsubsubsubcategory=${subsubsubsubcategoryURLENCODE}`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            const data = await res.json();
            setWords(data.querysubcategorywords);
        };
        fetchspecificsubcatwords();
    }, [category1, subcategory]);

    const handleEditClick = (word) => {
        setEditingRowId(word.id || word._id);
        setEditedWord(word);
    };

    const handleSaveClick = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updateWord`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedWord),
            });
            if (res.ok) {
                const updatedWords = words.map((word) =>
                    word.id === editedWord.id || word._id === editedWord._id ? editedWord : word
                );
                setWords(updatedWords);
                setEditingRowId(null);
            } else {
                console.error('Failed to update word');
            }
        } catch (error) {
            console.error('Error updating word:', error);
        }
    };

    const handleDeleteClick = async (wordId) => {
        if (window.confirm('Are you sure you want to delete this word?')) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteWord`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: wordId }),
                });
                if (res.ok) {
                    setWords(words.filter((word) => word.id !== wordId && word._id !== wordId));
                } else {
                    console.error('Failed to delete word');
                }
            } catch (error) {
                console.error('Error deleting word:', error);
            }
        }
    };

    const handleInputChange = (e, field) => {
        setEditedWord({ ...editedWord, [field]: e.target.value });
    };

    return (
        <div>
            {subcategory && <h3 className="text-xl font-bold mb-4">{decodeURIComponent(subcategory)}</h3>}
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Order</th>
                        <th className="border border-gray-400 px-4 py-2">English</th>
                        <th className="border border-gray-400 px-4 py-2">French</th>
                        <th className="border border-gray-400 px-4 py-2">German</th>
                        <th className="border border-gray-400 px-4 py-2">Greek</th>
                        <th className="border border-gray-400 px-4 py-2">Category1</th>
                        <th className="border border-gray-400 px-4 py-2">Category2</th>
                        <th className="border border-gray-400 px-4 py-2">Category3</th>
                        <th className="border border-gray-400 px-4 py-2">Category4</th>
                        <th className="border border-gray-400 px-4 py-2">Actions</th>
                        <th className="border border-gray-400 px-4 py-2">Delete</th>
                    </tr>
                </thead>
                <tbody ref={tableRef}>
                    {words.map((word) => (
                        <tr key={word.id || word._id} className="sortable-row">
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.order_number}
                                        onChange={(e) => handleInputChange(e, 'order_number')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.order_number
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.ENWord}
                                        onChange={(e) => handleInputChange(e, 'ENWord')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.ENWord
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.FRWord}
                                        onChange={(e) => handleInputChange(e, 'FRWord')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.FRWord
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.DEWord}
                                        onChange={(e) => handleInputChange(e, 'DEWord')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.DEWord
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.GRWord}
                                        onChange={(e) => handleInputChange(e, 'GRWord')}
                                        className="inputeditinput"
                                    />

                                ) : (
                                    word.GRWord
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.Category1}
                                        onChange={(e) => handleInputChange(e, 'Category1')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.Category1
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.Category2}
                                        onChange={(e) => handleInputChange(e, 'Category2')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.Category2
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.Category3}
                                        onChange={(e) => handleInputChange(e, 'Category3')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.Category3
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.Category4}
                                        onChange={(e) => handleInputChange(e, 'Category4')}
                                        className="inputeditinput"
                                    />
                                ) : (
                                    word.Category4
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {editingRowId === word.id || editingRowId === word._id ? (
                                    <button className="button button-primary" onClick={handleSaveClick}>
                                        Save
                                    </button>
                                ) : (
                                    <button className="button button-secondary" onClick={() => handleEditClick(word)}>
                                        Edit
                                    </button>
                                )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                <button className="button button-danger" onClick={() => handleDeleteClick(word.id || word._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}