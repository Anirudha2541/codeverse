import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 5;

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState([]);

  const [reverseInput, setReverseInput] = useState('React');
  const [arrayInput, setArrayInput] = useState('3, 5, 7, 5, 2, 3, 9');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const normalizedSearch = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.email.toLowerCase().includes(normalizedSearch) ||
        item.username.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [users, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email.';
    if (!mobile.trim()) nextErrors.mobile = 'Mobile number is required.';
    else if (!/^\d{7,15}$/.test(mobile)) nextErrors.mobile = 'Enter a valid mobile number.';
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setSubmitted((prev) => [...prev, { name, email, mobile }]);
    setName('');
    setEmail('');
    setMobile('');
    setFormErrors({});
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMobile('');
    setFormErrors({});
  };

  const reversedString = reverseInput.split('').reverse().join('');
  const parsedArray = arrayInput
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => !Number.isNaN(item));
  const largestNumber = parsedArray.length ? Math.max(...parsedArray) : null;
  const uniqueValues = [...new Set(parsedArray)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40 sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate('/login')}
              className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Login
            </button>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Analytics Hub</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">Welcome back, {user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-400 hover:to-red-500"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Users</p>
            <p className="mt-4 text-3xl font-semibold text-white">{users.length}</p>
            <p className="mt-2 text-sm text-slate-400">Loaded from JSONPlaceholder</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-cyan-700 to-blue-600 p-6 shadow-2xl shadow-cyan-500/20 text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Search Results</p>
            <p className="mt-4 text-3xl font-semibold">{filteredUsers.length}</p>
            <p className="mt-2 text-sm text-cyan-100">Matching users</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Submissions</p>
            <p className="mt-4 text-3xl font-semibold text-white">{submitted.length}</p>
            <p className="mt-2 text-sm text-slate-400">Form entries sent</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">User Listing</h2>
                  <p className="mt-1 text-sm text-slate-400">Search, paginate and review user records from JSONPlaceholder.</p>
                </div>
                <div className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">Total {filteredUsers.length}</div>
              </div>

              <div className="mb-4">
                <label className="sr-only" htmlFor="user-search">Search users</label>
                <input
                  id="user-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Search by name, email or username"
                />
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-slate-800">
                <table className="min-w-full divide-y divide-slate-800 text-left text-slate-200">
                  <thead className="bg-slate-950 text-sm text-slate-400">
                    <tr>
                      <th className="px-4 py-4 font-semibold">Name</th>
                      <th className="px-4 py-4 font-semibold">Email</th>
                      <th className="px-4 py-4 font-semibold">Username</th>
                      <th className="px-4 py-4 font-semibold">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400">
                          Loading users...
                        </td>
                      </tr>
                    ) : fetchError ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-rose-400">
                          {fetchError}
                        </td>
                      </tr>
                    ) : paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400">
                          No users match your search.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-slate-800">
                          <td className="px-4 py-4 text-slate-100">{userItem.name}</td>
                          <td className="px-4 py-4 text-slate-100">{userItem.email}</td>
                          <td className="px-4 py-4 text-slate-100">{userItem.username}</td>
                          <td className="px-4 py-4 text-slate-100">{userItem.phone}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <p className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className="rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm text-slate-200 transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-white">Form Handling</h2>
                <p className="mt-1 text-sm text-slate-400">Submit a contact form and view submitted values below.</p>
              </div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Enter your name"
                  />
                  {formErrors.name && <p className="mt-2 text-sm text-rose-400">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="contact@example.com"
                  />
                  {formErrors.email && <p className="mt-2 text-sm text-rose-400">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Mobile</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="9876543210"
                  />
                  {formErrors.mobile && <p className="mt-2 text-sm text-rose-400">{formErrors.mobile}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:from-cyan-400 hover:to-blue-400"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-3xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </form>

              {submitted.length > 0 && (
                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                  <h3 className="mb-4 text-lg font-semibold text-white">Submitted Data</h3>
                  <div className="space-y-3">
                    {submitted.map((entry, index) => (
                      <div key={`${entry.email}-${index}`} className="rounded-3xl bg-slate-950/80 p-4 shadow-sm shadow-slate-950/30">
                        <p className="text-sm text-slate-300">Name: <span className="font-medium text-white">{entry.name}</span></p>
                        <p className="text-sm text-slate-300">Email: <span className="font-medium text-white">{entry.email}</span></p>
                        <p className="text-sm text-slate-300">Mobile: <span className="font-medium text-white">{entry.mobile}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">JavaScript Logical Test</h2>
              <p className="mt-1 text-sm text-slate-500">Reverse a string, find the largest number, and remove duplicates.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Reverse String</label>
                  <input
                    type="text"
                    value={reverseInput}
                    onChange={(event) => setReverseInput(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                    placeholder="Type text to reverse"
                  />
                  <p className="mt-3 rounded-2xl bg-slate-950/95 px-4 py-3 text-sm text-cyan-100">Reversed: <span className="font-semibold text-white">{reversedString}</span></p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Numbers Array</label>
                  <input
                    type="text"
                    value={arrayInput}
                    onChange={(event) => setArrayInput(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter numbers comma separated"
                  />
                  <div className="mt-3 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p>Largest number: <span className="font-semibold text-slate-900">{largestNumber ?? 'N/A'}</span></p>
                    <p>Unique values: <span className="font-semibold text-slate-900">[{uniqueValues.join(', ')}]</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-2xl">
              <h3 className="text-lg font-semibold">Ready to Build</h3>
              <p className="mt-2 text-sm text-slate-100">This dashboard combines authentication, data fetching, form handling, and JavaScript logic in a clean React + Tailwind UI.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};