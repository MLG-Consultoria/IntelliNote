import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { storage, type Reminder } from '../../lib/storage';
import BotaoVoltar from '../../Components/BotaoVoltar';

const Calendario = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
      const loadReminders = () => {
          const savedReminders = storage.getReminders();
          setReminders(savedReminders);
      };
      loadReminders();
  }, []);

  const handleDeleteReminder = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    storage.deleteReminder(id);
    setReminders(storage.getReminders());
  };

  const handleNavigateToNote = (noteTitle: string) => {
      navigate(`/VerNota?q=${encodeURIComponent(noteTitle)}`);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho','Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (day: number) => day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  const handleDateClick = (day: number) => setSelectedDate(new Date(year, month, day));

  const selectedDateKey = formatDateKey(selectedDate);
  const dayReminders = reminders.filter(r => r.date === selectedDateKey);
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <main className="flex-1 flex flex-col items-center pt-10 px-4 pb-10 text-gray-900 dark:text-gray-100">
      <BotaoVoltar variant="arrow" className="absolute" />
      <h1 className="text-3xl font-bold mb-8 mt-6 sm:mt-10 text-left w-full max-w-5xl px-2">Calendário de Lembretes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        
        {/* CALENDÁRIO */}
        <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm h-[500px] flex flex-col justify-center relative">
          <div className="absolute top-6 left-6">
             <h2 className="text-xl font-semibold">Selecione uma Data</h2>
             <p className="text-sm text-gray-500">Visualize seus lembretes no calendário</p>
          </div>

          <div className="bg-gray-50 dark:bg-[#18181b] rounded-lg p-4 border border-gray-200 dark:border-gray-800 w-full max-w-sm mx-auto mt-12 md:mt-10 md:w-full md:h-3/4">

            {/* Header do Mês */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                <FaChevronLeft size={14} />
              </button>
              <span className="font-semibold text-sm uppercase tracking-wide text-gray-700 dark:text-gray-200">
                {months[month]} {year}
              </span>
              <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                <FaChevronRight size={14} />
              </button>
            </div>

            {/* Grid dos Dias */}
            <div className="grid grid-cols-7 text-center mb-2">
              {daysOfWeek.map(d => (
                <span key={d} className="text-xs text-gray-500 font-medium py-1">{d}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {blanks.map((_, i) => <div key={`b-${i}`} />)}
              
              {days.map(day => {
                const isTodayCheck = isToday(day);
                const isSelectedCheck = isSelected(day);
                const hasReminder = reminders.some(r => r.date === formatDateKey(new Date(year, month, day)));

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-9 w-9 text-sm rounded-lg flex flex-col items-center justify-center relative transition-all
                      ${isSelectedCheck 
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 font-bold shadow-md transform scale-105' 
                        : 'text-gray-400 hover:bg-neutral-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }
                      ${isTodayCheck && !isSelectedCheck ? 'text-blue-500 font-bold' : ''}
                    `}
                  >
                    {day}
                    {hasReminder && !isSelectedCheck && (
                        <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LEMBRETES */}
        <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col h-[500px]">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Lembretes para {selectedDate.toLocaleDateString('pt-BR')}</h2>
                <p className="text-sm text-gray-500">{dayReminders.length} lembrete(s) encontrado(s)</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-3 custom-scrollbar">
                {dayReminders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                        <p>Nenhum lembrete para esta data</p>
                    </div>
                ) : (
                    dayReminders.map(reminder => (
                        <div 
                            key={reminder.id} 
                            onClick={() => handleNavigateToNote(reminder.title)}
                            className="bg-gray-50 dark:bg-[#18181b] p-4 rounded-lg border border-gray-200 dark:border-gray-800 flex justify-between items-start group hover:border-gray-400 dark:hover:border-gray-600 transition-all cursor-pointer animate-fade-in-slide-down"
                        >
                            <div className="flex flex-col gap-1 pr-4 overflow-hidden">
                                <span className="font-bold text-gray-900 dark:text-white truncate w-full">
                                    {reminder.title}
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {reminder.content}
                                </p>
                            </div>
                            
                            <button 
                                onClick={(e) => handleDeleteReminder(e, reminder.id)}
                                className="text-gray-400 hover:text-red-500 p-1 transition-colors -mt-1 -mr-1"
                                title="Remover lembrete"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </main>
  );
};

export default Calendario;