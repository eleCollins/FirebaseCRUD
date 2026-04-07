'use client'
import { useEffect, useState } from 'react'
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './../firebase/firebase.config';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, 'items'))
    setItems(snapshot.docs.map((doc) => ({ id: doc.id, inputText: doc.data().inputText })))
  }

  const handleAdd = async () => {
    await addDoc(collection(db, 'items'), { inputText })
    setInputText('');
    fetchItems();
  }

  const handleDelete = async (id) => {
    if (!id) return;
    await deleteDoc(doc(db, 'items', id));
    fetchItems();
  }

  const handleEdit = async (id) => {
    const editValue = prompt("Enter the new value");
    if (!editValue) return;
    await updateDoc(doc(db, 'items', id), { inputText: editValue })
    fetchItems();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">NextJS Firebase CRUD</h1>
      <input
        type="text"
        className="border-2 p-2 mr-2"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button className="border p-2 bg-blue-500 text-white" onClick={handleAdd}>Agregar</button>
      <ul className="mt-4">
        {items.map((item) => (
          <li key={item.id} className="mb-2">
            {item.inputText}
            <button className="p-2 border bg-yellow-500 text-white cursor-pointer ml-2" onClick={() => handleEdit(item.id)}>Edit</button>
            <button className="p-2 border bg-red-500 text-white cursor-pointer ml-2" onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}