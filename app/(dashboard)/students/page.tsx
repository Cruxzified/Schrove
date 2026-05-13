'use client';
import { useState } from 'react';
import { ChevronDown, Filter, ExternalLink, Zap, MapPin, AlertTriangle, Clock, ChevronLeft, Bus } from 'lucide-react';
import Topbar from '@/components/Topbar';

const mockStudents = [
  { id: 'STU-8821', name: 'Julianne Santiago', details: 'Grade 4 • Route North-01', bus: '12', pickup: 'Oak St & 4th Ave', status: 'Onboard', img: 'JS' },
  { id: 'STU-9104', name: 'Marcus Rivera', details: 'Grade 7 • Route South-04', bus: '08', pickup: 'Maple Ridge Dr', status: 'At Stop', img: 'MR' },
  { id: 'STU-1290', name: 'Elena Bennett', details: 'Grade 11 • East Express', bus: '12', pickup: 'Oak St & 4th Ave', status: 'Onboard', img: 'EB' },
  { id: 'STU-4402', name: 'Kevin Chen', details: 'Grade 2 • Route North-01', bus: '22', pickup: 'Harbor View Dr', status: 'Absent', img: 'KC' },
  { id: 'STU-2933', name: 'Sarah Thompson', details: 'Grade 10 • Route North-01', bus: '12', pickup: 'Pinecrest Apartments', status: 'Onboard', img: 'ST' },
];

export default function StudentsPage() {
  return (
    <>
      <Topbar searchPlaceholder="Search students, routes, or ID..." />
      <div className="page-content bg-[#F8F9FB] min-h-full flex gap-8">
        
        {/* LEFT COLUMN: FILTERS */}
        <div className="w-[300px] flex-shrink-0 flex flex-col gap-6">
          <div className="card-white p-6">
            <h2 className="text-xl font-bold text-violet-900 mb-1">Filters</h2>
            <p className="text-sm text-violet-500 mb-6">Refine student results</p>

            <div className="mb-5">
              <label className="block text-xs font-bold text-violet-600 mb-2 uppercase tracking-wide">Route</label>
              <div className="border border-violet-200 rounded-lg p-2.5 flex items-center justify-between bg-violet-50 cursor-pointer">
                <span className="text-sm font-medium text-violet-700">All Routes</span>
                <ChevronDown size={16} className="text-violet-400" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-violet-600 mb-2 uppercase tracking-wide">Bus Number</label>
              <div className="grid grid-cols-3 gap-2">
                {['12', '08', '22', '15', '03'].map(b => (
                  <button key={b} className="border border-violet-200 py-2 rounded-lg text-sm font-semibold text-violet-700 hover:bg-violet-50">{b}</button>
                ))}
                <button className="border-2 border-violet-900 bg-[#EFF6FF] py-2 rounded-lg text-sm font-bold text-violet-900 font-mono tracking-wider">ALL</button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-violet-600 mb-3 uppercase tracking-wide">Transport Status</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-violet-900 bg-violet-900 flex items-center justify-center">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-violet-800">Onboard</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-violet-900 bg-violet-900 flex items-center justify-center">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-sm font-semibold text-violet-800">At Stop</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border-2 border-violet-300 group-hover:border-violet-400"></div>
                  <span className="text-sm font-medium text-violet-600">Parent Pickup</span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-violet-600 mb-2 uppercase tracking-wide">Grade Level</label>
              <div className="border border-violet-200 rounded-lg p-2.5 flex items-center justify-between bg-violet-50 cursor-pointer">
                <span className="text-sm font-medium text-violet-700">Elementary</span>
                <ChevronDown size={16} className="text-violet-400" />
              </div>
            </div>

            <button className="w-full btn-dark py-3 h-auto text-[15px] shadow-lg shadow-violet-200">
              Apply Filters
            </button>
          </div>

          <div className="dark-accent-card flex flex-col gap-4">
            <Zap size={24} className="text-violet-300" />
            <div>
              <div className="text-3xl font-bold mb-1">98.2%</div>
              <div className="text-sm text-violet-400 font-medium">Arrival Accuracy today</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DATA */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-violet-900">Students Overview</h1>
                <span className="bg-violet-200 text-violet-700 font-bold px-3 py-1 rounded-full text-sm">1,240</span>
              </div>
              <p className="text-[15px] text-violet-500">Manage and monitor student transportation status in real-time.</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline !h-10 bg-white"><Filter size={16} /> Filter</button>
              <button className="btn-outline !h-10 bg-white"><ExternalLink size={16} /> Export</button>
            </div>
          </div>

          <div className="card-white flex-1 overflow-hidden flex flex-col mb-6">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Assigned Bus</th>
                    <th>Pickup Point</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#2e1065] text-white flex items-center justify-center font-bold text-sm shadow-sm">{s.img}</div>
                          <div>
                            <div className="font-bold text-[15px] text-violet-900">{s.name}</div>
                            <div className="text-xs font-medium text-violet-500 mt-0.5">{s.details}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-[13px] font-semibold text-violet-600">{s.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                           <Bus size={16} className="text-violet-400"/>
                           <span className="font-bold text-violet-900 text-[15px]">Bus <br className="hidden"/>{s.bus}</span>
                        </div>
                      </td>
                      <td className="text-[14px] text-violet-600 font-medium">{s.pickup}</td>
                      <td>
                        {s.status === 'Onboard' && <span className="status-badge status-green">Onboard</span>}
                        {s.status === 'At Stop' && <span className="status-badge status-amber">At Stop</span>}
                        {s.status === 'Absent' && <span className="status-badge status-gray">Absent</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-violet-200 p-4 flex items-center justify-between bg-violet-50 mt-auto">
              <div className="text-sm font-medium text-violet-500">
                Showing <span className="font-bold text-violet-900">1-10</span> of 1,240 students
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg border border-violet-200 bg-white flex items-center justify-center text-violet-400 hover:bg-violet-100"><ChevronLeft size={16} /></button>
                <button className="w-8 h-8 rounded-lg bg-violet-900 text-white font-bold text-sm">1</button>
                <button className="w-8 h-8 rounded-lg border border-violet-200 bg-white flex items-center justify-center font-semibold text-violet-600 text-sm hover:bg-violet-100">2</button>
                <button className="w-8 h-8 rounded-lg border border-violet-200 bg-white flex items-center justify-center font-semibold text-violet-600 text-sm hover:bg-violet-100">3</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card-white p-6 relative">
              <div className="absolute top-6 right-6 text-green-600 font-bold text-sm">+12%</div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <MapPin size={22} className="text-blue-600" />
              </div>
              <div className="text-sm font-bold text-violet-500 mb-1">Avg Stop Time</div>
              <div className="text-3xl font-bold text-violet-900">2.4 min</div>
            </div>

            <div className="card-white p-6 relative">
              <div className="absolute top-6 right-6 text-red-600 font-bold text-sm">Alert</div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <AlertTriangle size={22} className="text-orange-500" />
              </div>
              <div className="text-sm font-bold text-violet-500 mb-1">Missed Pickups</div>
              <div className="text-3xl font-bold text-violet-900">04</div>
            </div>

            <div className="card-white p-6">
              <div className="w-12 h-12 rounded-xl bg-violet-900 flex items-center justify-center mb-6">
                <Clock size={22} className="text-white" />
              </div>
              <div className="text-sm font-bold text-violet-500 mb-1">Arrival Prediction</div>
              <div className="text-3xl font-bold text-violet-900">99.1%</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
