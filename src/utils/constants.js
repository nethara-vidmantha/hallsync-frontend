export const BUILDINGS = [
  { value: 'Auditorium', label: 'Auditorium' },
  { value: 'Guesthouse', label: 'Guesthouse' },
  { value: 'LectureComplex', label: 'Lecture Complex' },
  { value: 'LabBuilding', label: 'Lab Building' }
];

export const FLOORS = {
  Auditorium: [{ value: 'Ground', label: 'Ground Floor' }],
  Guesthouse: [{ value: 'Ground', label: 'Ground Floor' }],
  LectureComplex: [
    { value: 'LGF', label: 'Lower Ground Floor (LGF)' },
    { value: 'GF', label: 'Ground Floor (GF)' },
    { value: 'FF', label: 'First Floor (FF)' },
    { value: 'SF', label: 'Second Floor (SF)' }
  ],
  LabBuilding: [
    { value: 'Ground', label: 'Ground Floor' },
    { value: '1st', label: '1st Floor' },
    { value: '2nd', label: '2nd Floor' },
    { value: '3rd', label: '3rd Floor' },
    { value: '4th', label: '4th Floor' }
  ]
};

export const DEPARTMENTS = [
  { value: 'ICT', label: 'ICT' },
  { value: 'ET', label: 'ET' },
  { value: 'BST', label: 'BST' },
  { value: 'Common', label: 'Common' }
];

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];
