import React, { useEffect, useState } from "react";
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const API = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedRecords, setSelectedRecords] = useState([]); // For storing selected records

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

  const nPage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const numbers = Array.from({ length: nPage }, (_, i) => i + 1);

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

  function removeUser(record) {
    const updatedData = data.filter(item => item.id !== record.id);
    setData(updatedData);
    setFilteredData(updatedData);
  }

  function deleteSelectedRecords() {
    const updatedData = data.filter(item => !selectedRecords.includes(item.id));
    setData(updatedData);
    setFilteredData(updatedData);
    setSelectedRecords([]); 
  }

  function toggleRecordSelection(id) {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow border h-full p-5 ">
      <input type="text" onChange={search} placeholder="Search by name,email and role" className="w-full rounded border px-4 m-4" />
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
            <tr key={i} className="border">
              <td className="py-2">
                <input
                  type="checkbox"
                  onChange={() => toggleRecordSelection(record.id)}
                  checked={selectedRecords.includes(record.id)}
                />
              </td>
              <td>{record.name}</td>
              <td>{record.email}</td>
              <td>{record.role}</td>
              <td className="flex items-end justify-evenly">
                <AiOutlineEdit className="hover:cursor-pointer mt-4 text-blue-600" />
                <AiOutlineDelete onClick={() => removeUser(record)} className="hover:cursor-pointer mt-4 text-red-600" />
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
          <ul className="flex space-x-2">
            <li>
              <a
                href="#"
                onClick={prevPage}
                className={`cursor-pointer ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'}`}
              >
                {"<"}
              </a>
            </li>
            {numbers.map((n, i) => (
              <li key={i}>
                <a
                  href="#"
                  onClick={() => changeCurrentPage(n)}
                  className={`cursor-pointer ${currentPage === n ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {n}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                onClick={nextPage}
                className={`cursor-pointer ${currentPage === nPage ? 'text-gray-400' : 'text-blue-600'}`}
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
