'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

interface AcademicYear {
  id: string
  year: number
  semester: number
  label: string
  startDate: Date
  endDate: Date
}

interface AcademicYearContextType {
  currentAcademicYear: AcademicYear
  setAcademicYear: (year: AcademicYear) => void
  academicYears: AcademicYear[]
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined)

export function useAcademicYear() {
  const context = useContext(AcademicYearContext)
  if (!context) {
    throw new Error('useAcademicYear must be used within AcademicYearProvider')
  }
  return context
}

function generateAcademicYears(): AcademicYear[] {
  const years: AcademicYear[] = []
  const currentYear = new Date().getFullYear()
  
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    // Semester 1 (July - December)
    years.push({
      id: `${year}-1`,
      year,
      semester: 1,
      label: `${year} - Semester 1 (Jul-Dec)`,
      startDate: new Date(year, 6, 1), // July 1
      endDate: new Date(year, 11, 31)   // Dec 31
    })
    
    // Semester 2 (January - June)
    years.push({
      id: `${year}-2`,
      year,
      semester: 2,
      label: `${year} - Semester 2 (Jan-Jun)`,
      startDate: new Date(year, 0, 1),  // Jan 1
      endDate: new Date(year, 5, 30)     // Jun 30
    })
  }
  
  return years.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
}

function getCurrentAcademicYear(years: AcademicYear[]): AcademicYear {
  const now = new Date()
  const currentYear = years.find(y => 
    now >= y.startDate && now <= y.endDate
  )
  return currentYear || years[0]
}

export function AcademicYearProvider({ children }: { children: React.ReactNode }) {
  const academicYears = generateAcademicYears()
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear>(
    getCurrentAcademicYear(academicYears)
  )

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedAcademicYear')
    if (saved) {
      const savedYear = academicYears.find(y => y.id === saved)
      if (savedYear) setCurrentAcademicYear(savedYear)
    }
  }, [])

  const setAcademicYear = (year: AcademicYear) => {
    setCurrentAcademicYear(year)
    localStorage.setItem('selectedAcademicYear', year.id)
  }

  return (
    <AcademicYearContext.Provider value={{ currentAcademicYear, setAcademicYear, academicYears }}>
      {children}
    </AcademicYearContext.Provider>
  )
}

export function AcademicYearSelector() {
  const { currentAcademicYear, setAcademicYear, academicYears } = useAcademicYear()

  return (
    <div className="inline-flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-gray-600" />
      <select
        value={currentAcademicYear.id}
        onChange={(e) => {
          const year = academicYears.find(y => y.id === e.target.value)
          if (year) setAcademicYear(year)
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gitam-primary focus:border-transparent"
      >
        {academicYears.map((year) => (
          <option key={year.id} value={year.id}>
            {year.label}
          </option>
        ))}
      </select>
    </div>
  )
}
