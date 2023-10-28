import React, { useEffect, useState } from "react";
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const API = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [editRecords, setEditRecords] = useState({});

  async function fetchData() {
    try {
      const response = await axios.get(API);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function search(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm) {
      const filteredResults = data.filter(item => (
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.role.toLowerCase().includes(searchTerm)
      ));
      setFilteredData(filteredResults);
      setCurrentPage(1);
    } else {
      setFilteredData(data);
      setCurrentPage(1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCurrentPage(newPage) {
    setCurrentPage(newPage);
  }

  function nextPage() {
    if (currentPage < nPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function saveUserChanges(id) {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        // Update the user information with the edited values
        const editedItem = editRecords[id];
        return {
          ...item,
          name: editedItem.name,
          email: editedItem.email,
          role: editedItem.role,
        };
      }
      return item;
    });

    setData(updatedData);
    setFilteredData(updatedData);

    // Clear the edit state after saving
    setEditRecords({ ...editRecords, [id]: null });
  }

  function removeUser(id) {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    setEditRecords({ ...editRecords, [id]: null });
  }

  function deleteSelectedRecords() {
    const updatedData = data.filter(item => !selectedRecords.includes(item.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRecords([]);
    setEditRecords({});
  }

  function toggleRecordSelection(id) {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  }

  function editUser(id, name, email, role) {
    // Set the edit state for the specified user
    setEditRecords({
      ...editRecords,
      [id]: { name, email, role },
    });
  }

  const nPage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const numbers = Array.from({ length: nPage }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow border h-full p-5">
      <input type="text" onChange={search} placeholder="Search by name, email, and role" className="w-full rounded border px-4 m-4" />

      <table className="text-center w-full mb-4 text-lg">
        <thead>
          <tr className="p-5 border">
            <th>Select</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, i) => (
            <tr key={i} className={`border ${selectedRecords.includes(record.id) ? 'bg-gray-200' : ''}`}>
              <td className="py-2">
                <input
                  type="checkbox"
                  onChange={() => toggleRecordSelection(record.id)}
                  checked={selectedRecords.includes(record.id)}
                />
              </td>
              <td>{editRecords[record.id] ? (
                <input
                  type="text"
                  value={editRecords[record.id].name}
                  onChange={(e) => setEditRecords({
                    ...editRecords,
                    [record.id]: { ...editRecords[record.id], name: e.target.value },
                  })}
                />
              ) : record.name}
              </td>
              <td>{editRecords[record.id] ? (
                <input
                  type="text"
                  value={editRecords[record.id].email}
                  onChange={(e) => setEditRecords({
                    ...editRecords,
                    [record.id]: { ...editRecords[record.id], email: e.target.value },
                  })}
                />
              ) : record.email}
              </td>
              <td>{editRecords[record.id] ? (
                <input
                  type="text"
                  value={editRecords[record.id].role}
                  onChange={(e) => setEditRecords({
                    ...editRecords,
                    [record.id]: { ...editRecords[record.id], role: e.target.value },
                  })}
                />
              ) : record.role}
              </td>
              <td className="flex items-end justify-evenly">
                {editRecords[record.id] ? (
                  <button onClick={() => saveUserChanges(record.id)}>Save</button>
                ) : (
                  <AiOutlineEdit
                    onClick={() => editUser(record.id, record.name, record.email, record.role)}
                    className="hover:cursor-pointer mt-4 text-blue-600"
                  />
                )}
                <AiOutlineDelete onClick={() => removeUser(record.id)} className="hover:cursor-pointer mt-4 text-red-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between w-full">
        <button onClick={deleteSelectedRecords} className="bg-red-500 text-white rounded p-2 mr-4">
          Delete Selected
        </button>
        <nav className="flex items-center">
          <ul className="pagination flex space-x-2">
            <li className="pagination-item">
              <a
                href="#"
                onClick={prevPage}
                className={`pagination-link ${currentPage === 1 ? 'pagination-disabled' : 'pagination-active'}`}
              >
                {"<"}
              </a>
            </li>
            {numbers.map((n, i) => (
              <li key={i} className="pagination-item">
                <a
                  href="#"
                  onClick={() => changeCurrentPage(n)}
                  className={`pagination-link ${currentPage === n ? 'pagination-active' : ''}`}
                >
                  {n}
                </a>
              </li>
            ))}
            <li className="pagination-item">
              <a
                href="#"
                onClick={nextPage}
                className={`pagination-link ${currentPage === nPage ? 'pagination-disabled' : 'pagination-active'}`}
              >
                {">"}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Home;
