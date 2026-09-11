import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, User, Calendar, Tag, ArrowRight } from 'lucide-react';
import { useResearch } from '../context/ResearchContext';
import { TaskItem } from '../types/research';
import { Badge } from '../components/common/Badge';

export const TasksPage: React.FC = () => {
  const { tasks, updateTaskStatus, createTask, activeWorkspace } = useResearch();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [assignee, setAssignee] = useState('Dr. Alex Rivera');
  const [deadline, setDeadline] = useState('2026-09-20');

  const columns: { id: TaskItem['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-300 bg-slate-100/60' },
    { id: 'in_progress', title: 'In Progress', color: 'border-indigo-300 bg-indigo-50/40' },
    { id: 'review', title: 'Review', color: 'border-purple-300 bg-purple-50/40' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-300 bg-emerald-50/40' }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title,
      description: description || 'Research task created in ResearchPilot workspace.',
      priority,
      status: 'todo',
      assignee,
      deadline,
      tag: 'Research Task'
    });

    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Task Board (Kanban)</h1>
          <p className="text-xs text-slate-500 mt-1">Manage literature tasks, dataset collection, baseline modeling, and paper drafting</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="space-y-4">
              {/* Column Header */}
              <div className={`p-3.5 rounded-xl border ${col.color} flex items-center justify-between`}>
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">{col.title}</span>
                <span className="text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3 min-h-[500px]">
                {colTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={task.priority === 'High' ? 'rose' : task.priority === 'Medium' ? 'amber' : 'slate'}>
                        {task.priority} Priority
                      </Badge>
                      {task.tag && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{task.tag}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {task.assignee}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.deadline}</span>
                    </div>

                    {/* Move Status Dropdown */}
                    <div className="pt-1">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="todo">Move to To Do</option>
                        <option value="in_progress">Move to In Progress</option>
                        <option value="review">Move to Review</option>
                        <option value="completed">Move to Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Task to Board</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement GraphVerify SMT verifier baseline"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
