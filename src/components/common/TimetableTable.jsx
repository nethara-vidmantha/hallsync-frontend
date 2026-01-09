import React, { useMemo } from "react";
import { DAYS_OF_WEEK, TIME_SLOTS } from "../../utils/constants";

const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const buildCellMaps = (entries, days) => {
  const startCells = {};
  const skipCells = {};

  entries.forEach((entry) => {
    const day = entry.dayOfWeek;
    if (!days.includes(day)) return;

    const startIdx = TIME_SLOTS.indexOf(entry.startTime);
    const endIdx = TIME_SLOTS.indexOf(entry.endTime);
    const span = endIdx > startIdx ? endIdx - startIdx : 1;

    if (!startCells[day]) startCells[day] = {};
    startCells[day][entry.startTime] = { entry, span };

    for (let i = 1; i < span; i += 1) {
      const time = TIME_SLOTS[startIdx + i];
      if (time) {
        skipCells[`${day}-${time}`] = true;
      }
    }
  });

  return { startCells, skipCells };
};

const TimetableTable = ({ entries = [], title, description }) => {
  const days = useMemo(() => {
    const extraDays = entries
      .map((e) => e.dayOfWeek)
      .filter((day) => day && !DEFAULT_DAYS.includes(day));
    const uniqueExtras = Array.from(new Set(extraDays));
    return [...DEFAULT_DAYS, ...uniqueExtras].filter((day) =>
      DAYS_OF_WEEK.includes(day)
    );
  }, [entries]);

  const { startCells, skipCells } = useMemo(
    () => buildCellMaps(entries, days),
    [entries, days]
  );

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white/70 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-100 bg-white/80">
        <h3 className="font-semibold text-gray-900">
          {title || "Semester Timetable"}
        </h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      {entries.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          No timetable entries
        </div>
      ) : (
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr>
              <th className="w-20 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-50"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time} className="border-t border-gray-100">
                <th className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50">
                  {time}
                </th>
                {days.map((day) => {
                  const skipKey = `${day}-${time}`;
                  if (skipCells[skipKey]) return null;

                  const cell = startCells[day]?.[time];
                  if (cell) {
                    const { entry, span } = cell;
                    return (
                      <td
                        key={`${day}-${time}`}
                        rowSpan={span}
                        className="align-top px-3 py-2 bg-white"
                      >
                        <div className="rounded-lg border border-primary-100 bg-primary-50/60 p-3 shadow-xs">
                          <p className="font-semibold text-gray-900 leading-tight">
                            {entry.subject || "Untitled"}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {entry.startTime} - {entry.endTime}
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            {entry.hall?.name || entry.hallName || "Hall"}
                          </p>
                          {entry.lecturer && (
                            <p className="text-xs text-gray-500 mt-1">
                              {entry.lecturer}
                            </p>
                          )}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`${day}-${time}`}
                      className="h-12 px-3 py-2 bg-white/50"
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TimetableTable;
