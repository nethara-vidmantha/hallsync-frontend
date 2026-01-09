import React, { useEffect, useMemo, useState } from "react";
import { timetableAPI } from "../../services/api";
import { DEPARTMENTS } from "../../utils/constants";
import TimetableTable from "./TimetableTable";
import { toast } from "react-toastify";
import { FaSync, FaCalendarAlt } from "react-icons/fa";

const TimetableViewer = () => {
  const [sections, setSections] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: "",
    department: "",
    sectionCode: "",
    semester: "",
  });

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    fetchTimetables();
  }, [
    filters.academicYear,
    filters.department,
    filters.sectionCode,
    filters.semester,
  ]);

  const fetchSections = async () => {
    try {
      const response = await timetableAPI.getSections();
      setSections(response.data);
    } catch (error) {
      toast.error("Failed to load timetable sections");
    }
  };

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.academicYear) params.academicYear = filters.academicYear;
      if (filters.department) params.department = filters.department;
      if (filters.sectionCode) params.sectionCode = filters.sectionCode;
      if (filters.semester) params.semester = filters.semester;

      const response = await timetableAPI.getAllTimetables(params);
      setTimetables(response.data || []);
      setActiveId(response.data?.[0]?._id || null);
    } catch (error) {
      toast.error("Could not fetch timetables");
    } finally {
      setLoading(false);
    }
  };

  const availableSections = useMemo(() => {
    return sections.filter(
      (section) =>
        (!filters.academicYear ||
          section.academicYear === Number(filters.academicYear)) &&
        (!filters.department || section.department === filters.department)
    );
  }, [sections, filters.academicYear, filters.department]);

  const activeTimetable =
    timetables.find((tt) => tt._id === activeId) || timetables[0];
  const totalConfigured = sections.length || 37;

  return (
    <div className="p-2 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="pill">Timetable library</p>
          <h1 className="text-2xl font-bold text-gray-900">
            View Semester Timetables
          </h1>
          <p className="text-sm text-gray-600">
            {timetables.length} of {totalConfigured} timetables loaded. Use
            filters to pick the section you need.
          </p>
        </div>
        <button
          onClick={fetchTimetables}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <FaSync />
          <span>Refresh</span>
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <select
              value={filters.academicYear}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  academicYear: e.target.value,
                  sectionCode: "",
                })
              }
              className="input-field"
            >
              <option value="">All</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  department: e.target.value,
                  sectionCode: "",
                })
              }
              className="input-field"
            >
              <option value="">All</option>
              {DEPARTMENTS.filter((dept) => dept.value !== "Common").map(
                (dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section
            </label>
            <select
              value={filters.sectionCode}
              onChange={(e) =>
                setFilters({ ...filters, sectionCode: e.target.value })
              }
              className="input-field"
              disabled={!filters.department || !filters.academicYear}
            >
              <option value="">All sections</option>
              {availableSections.map((section) => (
                <option key={section.sectionCode} value={section.sectionCode}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term
            </label>
            <select
              value={filters.semester}
              onChange={(e) =>
                setFilters({ ...filters, semester: e.target.value })
              }
              className="input-field"
            >
              <option value="">All</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  academicYear: "",
                  department: "",
                  sectionCode: "",
                  semester: "",
                })
              }
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <FaCalendarAlt className="text-primary-600" />
            <div>
              <p className="font-semibold text-gray-900">Selected timetable</p>
              {activeTimetable ? (
                <p className="text-sm text-gray-600">
                  Year {activeTimetable.academicYear} ·{" "}
                  {activeTimetable.department}
                  {activeTimetable.sectionName
                    ? ` · ${activeTimetable.sectionName}`
                    : ""}
                  {activeTimetable.semester
                    ? ` · Semester ${activeTimetable.semester}`
                    : ""}
                </p>
              ) : (
                <p className="text-sm text-gray-600">No timetable selected</p>
              )}
            </div>
          </div>
          <div className="w-full md:w-72">
            <select
              value={activeTimetable?._id || ""}
              onChange={(e) => setActiveId(e.target.value)}
              className="input-field"
            >
              {timetables.length === 0 && (
                <option value="">No timetables found</option>
              )}
              {timetables.map((tt) => (
                <option key={tt._id} value={tt._id}>
                  Year {tt.academicYear} · {tt.department}
                  {tt.sectionName ? ` · ${tt.sectionName}` : ""}
                  {tt.semester ? ` · S${tt.semester}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-10">
            Loading timetable...
          </div>
        ) : activeTimetable ? (
          <TimetableTable
            entries={activeTimetable.entries || []}
            title={activeTimetable.sectionName || "Timetable"}
            description={`Configured for Year ${activeTimetable.academicYear} ${
              activeTimetable.department
            }${
              activeTimetable.semester
                ? ` • Semester ${activeTimetable.semester}`
                : ""
            }`}
          />
        ) : (
          <div className="text-center text-gray-600 py-10">
            Select filters to view a semester timetable.
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableViewer;
